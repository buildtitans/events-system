# Release Packaging

BT-Infra owns deployment orchestration for `events-system`. This repo owns building and packaging the app artifact that BT-Infra later deploys.

## Local Build

Create a contract-shaped artifact:

```powershell
pnpm release:build
```

The artifact is written to `.deploy/artifacts/` and metadata is written to `.deploy/release-metadata.json`.

The default artifact key shape is:

```text
events-system/releases/events-system-YYYYMMDD-HHMMSS-SHA.tgz
```

## Artifact Contents

The artifact extracts directly into `/var/www/events-system` and includes:

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `next.config.ts`
- `next-standalone/server.js`
- `next-standalone/.next/static`
- `next-standalone/public`
- `src/server/package.json`
- `src/server/dist`

The package script excludes `.env*` files and fails if any are found in the staged release.

## CI

CI builds Next, builds Fastify, and runs `pnpm release:package` to verify the artifact contract. It does not upload to AWS or execute a deploy.

## Upload

The manual `Release Upload` workflow builds, tests, packages, configures AWS credentials through GitHub OIDC, and uploads the artifact to the BT-Infra release bucket. It does not call BT-Infra deploy commands or SSM.

The workflow uses the protected GitHub `prod` environment and expects these environment variables:

- `AWS_REGION`
- `AWS_ROLE_TO_ASSUME`
- `BT_INFRA_RELEASE_BUCKET_NAME`

`AWS_ROLE_TO_ASSUME` should be the BT-Infra-managed upload role ARN. `BT_INFRA_RELEASE_BUCKET_NAME` should be the BT-Infra `ReleaseBucketName` stack output.

`BT_INFRA_INSTANCE_ID` is not needed for upload-only. It will be needed later for a dry-run deploy-plan workflow.

## BT-Infra Handoff

After a future workflow uploads the artifact to the BT-Infra release bucket, the dry-run deploy handoff is:

```powershell
npm run deploy:plan -- --app events-system --instance-id INSTANCE_ID --bucket RELEASE_BUCKET --artifact-key events-system/releases/ARTIFACT_NAME.tgz --format commands
```

Real execution must stay explicit and protected. Do not add `--execute --yes` unless a deploy has been intentionally approved.
