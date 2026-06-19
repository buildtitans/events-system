# Release Packaging

BT-Infra owns deployment orchestration for `events-system`. This repo owns building and packaging the app artifact that BT-Infra later deploys.

## Build Environment

Release artifacts are built in an Amazon Linux 2023 container with Linux x64 and Node.js 24. The pinned package manager is `pnpm@10.12.1`.

This is a pnpm-only workspace. `pnpm-lock.yaml` is the single dependency lockfile; do not regenerate or commit `package-lock.json`.

Artifact packaging intentionally refuses to run on a different operating system, architecture, or Node major version. This prevents Windows-built or otherwise incompatible native modules from entering a release.

In a matching Linux environment, create a contract-shaped artifact with:

```bash
pnpm release:build
```

The artifact is written to `.deploy/artifacts/` and metadata is written to `.deploy/release-metadata.json`.

The default artifact key shape is:

```text
events-system/releases/events-system-YYYYMMDD-HHMMSS-SHA.tgz
```

## Artifact Contents

The artifact extracts directly into `/var/www/events-system` and includes:

- `.bt-infra-release.json`
- `bin/start-next`
- `bin/start-fastify`
- `bin/db-migrate`
- `bin/db-seed`
- `next-standalone/server.js`
- `next-standalone/.next/static`
- `next-standalone/public`
- `src/server/package.json`
- `src/server/dist`
- `src/server/node_modules`

The Fastify dependency tree is produced with the current `pnpm deploy --prod` implementation using the frozen shared workspace lockfile, hoisted node linker, and copy-based package imports. The staging copy dereferences links, removes package-manager command shims, and rejects every remaining symlink because BT-Infra rejects special files before downtime.

The package script validates the staging directory, creates the `.tgz`, extracts it into a clean directory, and validates the extracted copy again. Validation covers the manifest, executable launchers, compiled entry points, Next assets, production dependency resolution, native `argon2` loading, symlinks, secret-like files/content, and infrastructure configuration.

The archive uses the source commit timestamp and normalized ownership/order metadata for reproducible contents. Its contents are rooted directly at the application root; there is no enclosing release directory.

## CI

CI runs in Amazon Linux 2023 with Node.js 24. It installs the frozen pnpm lockfile, fails on known high/critical dependency advisories, lints, type checks, tests, builds Next and Fastify, and packages and validates the release artifact. CI does not upload to AWS or execute a deploy.

## Release

The manual `Release` workflow repeats the same audit, test, build, package, extraction, and validation gates. The Amazon Linux build job transfers only the finished `.tgz` to a separate protected upload job. That job configures AWS credentials through GitHub OIDC, uploads the artifact to the BT-Infra release bucket, and calls BT-Infra's reusable deployment workflow with the app name and uploaded S3 key.

The workflow uses the protected GitHub `prod` environment and expects these environment variables:

- `AWS_REGION`
- `AWS_ROLE_TO_ASSUME`
- `BT_INFRA_RELEASE_BUCKET_NAME`

`AWS_ROLE_TO_ASSUME` should be the BT-Infra-managed upload role ARN. `BT_INFRA_RELEASE_BUCKET_NAME` should be the BT-Infra `ReleaseBucketName` stack output.

The upload role remains limited to `events-system/releases/*` and does not receive SSM permissions. BT-Infra's protected `prod` environment owns the separate deployment role and runtime configuration.

## BT-Infra Handoff

After upload, the workflow calls:

```yaml
uses: buildtitans/BT-Infra/.github/workflows/deploy-release.yaml@main
with:
  app_name: events-system
  artifact_key: events-system/releases/ARTIFACT_NAME.tgz
```

The BT-Infra repository must allow this repository to use its reusable workflow. Its `prod` environment must contain the instance ID, app-specific deploy role ARN, AWS region, and private-repository checkout token described in the BT-Infra continuous-deployment documentation.
