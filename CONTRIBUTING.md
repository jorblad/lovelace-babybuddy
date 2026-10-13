# Contributing

Thank you for contributing! This project uses [release-please](https://github.com/googleapis/release-please)
driven by [Conventional Commits](https://www.conventionalcommits.org/). Releases are created automatically
from a release pull request that release-please keeps up to date as you merge work into `master`.

## Commits (Conventional Commits / semantic commits)

Every commit message should follow the Conventional Commits format, because release-please uses the
commit type to decide the next semantic version bump and to group the changelog:

```
<type>(optional scope): <short summary>

optional body

optional footer(s)
```

Supported types and how they affect the version:

- `feat:` — a new feature → **minor** bump (e.g. `0.7.0` → `0.8.0`)
- `fix:` — a bug fix → **patch** bump (e.g. `0.7.0` → `0.7.1`)
- `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:` — included in the changelog, no version bump by themselves
- `feat!:` / `fix!:` / `refactor!:` (or a `BREAKING CHANGE:` footer) — a **major** bump

Examples:

```
feat(feedings-card): add per-day split bars
fix(timeline-card): handle empty results gracefully
docs: document Swedish localization example
chore(deps): bump actions/checkout
```

While the project is pre-1.0 (`0.x`), breaking changes bump the **minor** version instead of major
(`bump-minor-pre-major` is enabled in `release-please-config.json`).

Breaking paragraphs, scopes, and bodies are optional but encouraged. Keep the subject line short and
imperative ("add", "fix", "update"), not "added"/"fixed".

## Release flow (what happens automatically)

1. You open PRs and merge them into `master` using conventional commit messages.
2. release-please opens (and keeps updated) a **Release PR** that updates `CHANGELOG.md`, `version.txt`
   and the version in `.release-please-manifest.json`.
3. When you are ready to release, **merge the Release PR**. release-please then creates the Git tag
   (e.g. `v0.8.0`) and the GitHub Release with the generated notes.

There are no manual labels or scripts to run for releases anymore.

## Local release helper (legacy)

> Deprecated: releases are now fully automated via release-please. Keep this only for emergency
> manual tagging.

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

Prefer letting release-please handle tagging so the changelog and manifest stay in sync.

## Testing locally in your Home Assistant lab

You can push the built files in `dist/` to your lab HA pod using the helper:

```bash
./scripts/deploy_to_k3s.sh -n <namespace> -p <pod-name>
```

The script copies `dist/` into `/config/www/babybuddy-test`. Use resource URLs like
`/local/babybuddy-test/<file>.js?v=<ts>` to load updated files and bust the cache.

## Running the test suite

Card smoke tests run under Node (no browser required). See `.github/workflows/ci.yml`.

```bash
npm test
```

This validates that every card registers its custom element, that `setConfig` behaves as expected,
and that translations cover all supported languages.

## Suggestions for repository admins

- Ensure "Allow GitHub Actions to create and approve pull requests" is enabled under
  Settings → Actions → General, so release-please can open its Release PR.
- Encourage PR authors to write conventional commit messages; the release notes are generated from them.

Thank you — open an issue or PR if you want this process adjusted.
