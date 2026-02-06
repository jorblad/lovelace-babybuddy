#!/usr/bin/env bash
set -euo pipefail

# Minimal release helper:
# - Ensures you're on master/main
# - Fetches tags
# - Bumps semver (patch/minor/major) or accepts an explicit semver argument
# - Creates an annotated tag, pushes it, and creates a GitHub Release using `gh` if available

usage() {
  cat <<EOF
Usage: $0 [patch|minor|major|vX.Y.Z]

Examples:
  $0           # bumps patch (default)
  $0 minor     # bumps minor
  $0 v1.2.3    # create release v1.2.3 explicitly

Requirements:
  - git available and repository clean
  - authenticated GitHub CLI (`gh`) for automatic release creation (optional)
  - push permissions to origin
EOF
  exit 1
}

if [ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ]; then
  usage
fi

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2; exit 2
fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "master" ] && [ "$BRANCH" != "main" ]; then
  echo "Please run this from the master or main branch. Current: $BRANCH" >&2
  exit 3
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree not clean. Commit or stash changes first." >&2
  git status --porcelain
  exit 4
fi

git fetch --tags origin

LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
echo "Latest tag: $LATEST_TAG"

INPUT=${1:-patch}

if [[ "$INPUT" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  NEW_VER=${INPUT#v}
else
  VER=${LATEST_TAG#v}
  IFS=. read -r MAJOR MINOR PATCH <<<"$VER"
  case "$INPUT" in
    major)
      MAJOR=$((MAJOR+1)); MINOR=0; PATCH=0;;
    minor)
      MINOR=$((MINOR+1)); PATCH=0;;
    patch)
      PATCH=$((PATCH+1));;
    *)
      echo "Unknown argument: $INPUT" >&2; usage;;
  esac
  NEW_VER="$MAJOR.$MINOR.$PATCH"
fi

NEW_TAG="v$NEW_VER"
echo "Creating new tag: $NEW_TAG"

# Ensure there are commits since the last tag
if [ "$LATEST_TAG" != "v0.0.0" ]; then
  if [ -z "$(git log --oneline ${LATEST_TAG}..HEAD)" ]; then
    echo "No commits since ${LATEST_TAG}; aborting." >&2
    exit 5
  fi
fi

git tag -a "$NEW_TAG" -m "Release $NEW_TAG"
git push origin "$NEW_TAG"

# Build release notes from commits since last tag
if [ "$LATEST_TAG" = "v0.0.0" ]; then
  NOTES=$(git log --oneline -n 30 --pretty=format:'- %s (%h)')
else
  NOTES=$(git log --pretty=format:'- %s (%h)' ${LATEST_TAG}..HEAD)
fi

if command -v gh >/dev/null 2>&1; then
  gh release create "$NEW_TAG" --title "$NEW_TAG" --notes "$NOTES"
  echo "GitHub release created for $NEW_TAG"
else
  echo "Tag pushed. Install and authenticate GitHub CLI to auto-create release:"
  echo "  gh release create $NEW_TAG --title \"$NEW_TAG\" --notes \"<notes>\""
fi

echo "Done."
