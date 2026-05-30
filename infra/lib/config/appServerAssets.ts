import * as path from "path";

const APP_SERVER_ASSET_DIR = path.resolve(
  __dirname,
  "..",
  "..",
  "assets",
  "app-server",
);

export type AppServerAssetName =
  | "events-system.nginx.conf"
  | "refresh-events-system-env.sh.tpl";

export function appServerAssetPath(fileName: AppServerAssetName): string {
  return path.join(APP_SERVER_ASSET_DIR, fileName);
}
