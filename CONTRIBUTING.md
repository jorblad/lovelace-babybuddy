# Contributing

Thank you for contributing! This project uses a label-driven release workflow so maintainers can control semantic version bumps at merge time.

## Pull Request labels (release control)

Before merging a PR, add one of these labels to indicate the next release bump:

- `release:major` or `major` — increments the major version (X.0.0)
- `release:minor` or `minor` — increments the minor version (0.Y.0)
- `release:patch` or `patch` — increments the patch version (0.0.Z)

If no release label is present when a PR is merged, no tag or release will be created.

## Workflow (what happens on merge)

1. Merge the PR into `master`/`main`.
2. The GitHub Actions workflow reads the PR labels and determines bump level.
3. The workflow bumps the semantic version from the latest tag (or from `v0.0.0` if none), creates and pushes a new annotated tag (e.g. `v1.2.3`) and creates a GitHub Release containing commits since the last tag.

## Local release helper

There is a helper script at `scripts/release.sh` to create releases locally:

```bash
chmod +x scripts/release.sh
# bump patch (default)
./scripts/release.sh
# or bump minor
./scripts/release.sh minor
# or create an explicit tag
./scripts/release.sh v1.2.3
```

Use the script when you want to create a release manually instead of using the label workflow.

## Testing locally in your Home Assistant lab

You can push the built files in `dist/` to your lab HA pod using the helper:

```bash
./scripts/deploy_to_k3s.sh -n <namespace> -p <pod-name>
```

The script copies `dist/` into `/config/www/babybuddy-test`. Use resource URLs like `/local/babybuddy-test/<file>.js?v=<ts>` to load updated files and bust the cache.

## Suggestions for repository admins

- Consider adding branch protection rules requiring a release label before enabling merge to `master`/`main`.
- Encourage PR authors to include a short changelog line in the PR description — the workflow will include commit messages in the release notes.

Thank you — open an issue or PR if you want this process adjusted.
