import * as path from "path";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { AppServerServices } from "./appServerServices";
import { appServerAssetPath } from "../config/appServerAssets";
import { appConfig } from "../config/appConfig";
import { renderTemplateFile } from "../config/renderTemplate";

type AppServerBootstrapDeps = {
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbSecretArn: string;
  cookieSecretArn: string;
  appRuntimeConfigArn: string;
};

export class AppServerBootstrap {
  constructor(private readonly deps: AppServerBootstrapDeps) {}

  public buildInit(): ec2.CloudFormationInit {
    const services = new AppServerServices({
      appRoot: APP_ROOT,
      envFilePath: SERVER_ENV_FILE,
      nextCommand: `${NODE_BIN} ${APP_ROOT}/next-standalone/server.js`,
      fastifyCommand: `${PNPM_BIN} --dir ${APP_ROOT}/src/server start:fastify`,
    });

    return ec2.CloudFormationInit.fromElements(
      initCommand("00-system-update", "dnf update -y"),
      initCommand(
        "01-install-node-repo",
        "curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -",
      ),
      initCommand("02-install-runtime-tools", "dnf install -y nodejs jq awscli"),
      initCommand("03-install-pnpm", "npm install -g pnpm"),
      initCommand("04-create-app-dir", `mkdir -p ${APP_ROOT}`),
      initCommand("05-create-config-dir", `mkdir -p ${SERVER_CONFIG_DIR}`),
      initCommand("06-install-nginx", "dnf install -y nginx"),
      ec2.InitFile.fromString(
        REFRESH_ENV_SCRIPT,
        this.renderRefreshEnvScript(),
        executableRootFile,
      ),
      initCommand("07-refresh-server-env", REFRESH_ENV_SCRIPT),
      ec2.InitFile.fromFileInline(
        NGINX_CONFIG_FILE,
        appServerAssetPath("events-system.nginx.conf"),
        readableRootFile,
      ),
      initCommand("08-validate-nginx", "nginx -t"),
      ec2.InitService.enable("nginx", {
        serviceManager: ec2.ServiceManager.SYSTEMD,
        enabled: true,
        ensureRunning: true,
      }),
      ...services.buildInitElements(),
      ec2.InitFile.fromString(
        `${APP_ROOT}/BOOTSTRAPPED.txt`,
        "CloudFormationInit ran successfully\n",
      ),
    );
  }

  private renderRefreshEnvScript(): string {
    return renderTemplateFile(
      appServerAssetPath("refresh-events-system-env.sh.tpl"),
      {
        APP_RUNTIME_CONFIG_ARN: this.deps.appRuntimeConfigArn,
        COOKIE_SECRET_ARN: this.deps.cookieSecretArn,
        DB_HOST: this.deps.dbHost,
        DB_NAME: this.deps.dbName,
        DB_PORT: this.deps.dbPort,
        DB_SECRET_ARN: this.deps.dbSecretArn,
        DB_USER: this.deps.dbUser,
        SERVER_ENV_FILE,
      },
    );
  }
}

const APP_ROOT = appConfig.paths.appRoot;
const SERVER_ENV_FILE = appConfig.paths.serverEnvFile;
const SERVER_CONFIG_DIR = path.posix.dirname(SERVER_ENV_FILE);
const REFRESH_ENV_SCRIPT = "/usr/local/bin/refresh-events-system-env.sh";
const NGINX_CONFIG_FILE = "/etc/nginx/conf.d/events-system.conf";
const NODE_BIN = "/usr/bin/node";
const PNPM_BIN = "/usr/bin/pnpm";

const executableRootFile: ec2.InitFileOptions = {
  mode: "000700",
  owner: "root",
  group: "root",
};

const readableRootFile: ec2.InitFileOptions = {
  mode: "000644",
  owner: "root",
  group: "root",
};

function initCommand(key: string, command: string): ec2.InitCommand {
  return ec2.InitCommand.shellCommand(command, { key });
}
