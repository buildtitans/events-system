import * as ec2 from "aws-cdk-lib/aws-ec2";
import { AppServerServices } from "./appServerServices";
import { requireEnv } from "../config/requireEnv";

const dbHost = requireEnv("PGHOST");
const dbPort = requireEnv("PGPORT");
const dbName = requireEnv("PGDATABASE");
const dbUser = requireEnv("PGUSER");

export class AppServerBootstrap {
  private readonly dbHost: string;
  private readonly dbPort: string;
  private readonly dbName: string;
  private readonly dbUser: string;
  constructor() {
    this.dbHost = dbHost;
    this.dbPort = dbPort;
    this.dbName = dbName;
    this.dbUser = dbUser;
  }

  public buildInit(): ec2.CloudFormationInit {
    const services = new AppServerServices({
      appRoot: "/var/www/events-system",
      envFilePath: "/etc/events-system/server.env",
      nextCommand: "/usr/bin/pnpm --dir /var/www/events-system start",
      fastifyCommand:
        "/usr/bin/pnpm --dir /var/www/events-system/src/server serve:fastify",
    });

    return ec2.CloudFormationInit.fromElements(
      ec2.InitCommand.shellCommand("dnf update -y", {
        key: "00-system-update",
      }),
      ec2.InitCommand.shellCommand(
        "curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -",
        {
          key: "01-install-node-repo",
        },
      ),
      ec2.InitCommand.shellCommand("dnf install -y nodejs", {
        key: "02-install-nodejs",
      }),
      ec2.InitCommand.shellCommand("npm install -g pnpm", {
        key: "03-install-pnpm",
      }),
      ec2.InitCommand.shellCommand("mkdir -p /var/www/events-system", {
        key: "04-create-app-dir",
      }),
      ec2.InitCommand.shellCommand("mkdir -p /etc/events-system", {
        key: "05-create-config-dir",
      }),
      ec2.InitFile.fromString(
        "/etc/events-system/server.env",
        [
          `PGHOST=${this.dbHost}`,
          `PGPORT=${this.dbPort}`,
          `PGDATABASE=${this.dbName}`,
          `PGUSER=${this.dbUser}`,
        ].join("\n"),
        {
          mode: "000600",
          owner: "root",
          group: "root",
        },
      ),
      ...services.buildInitElements(),
      ec2.InitFile.fromString(
        "/var/www/events-system/BOOTSTRAPPED.txt",
        "CloudFormationInit ran successfully\n",
      ),
    );
  }
}
