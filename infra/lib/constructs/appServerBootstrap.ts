import * as ec2 from "aws-cdk-lib/aws-ec2";
import { AppServerServices } from "./appServerServices";

type AppServerBootstrapDeps = {
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbSecretArn: string;
};

export class AppServerBootstrap {
  private readonly dbHost: string;
  private readonly dbPort: string;
  private readonly dbName: string;
  private readonly dbUser: string;
  private readonly dbSecretArn: string;
  constructor(deps: AppServerBootstrapDeps) {
    this.dbHost = deps.dbHost;
    this.dbPort = deps.dbPort;
    this.dbName = deps.dbName;
    this.dbUser = deps.dbUser;
    this.dbSecretArn = deps.dbSecretArn;
  }

  public buildInit(): ec2.CloudFormationInit {
    const services = new AppServerServices({
      appRoot: "/var/www/events-system",
      envFilePath: "/etc/events-system/server.env",
      nextCommand: "/usr/bin/pnpm --dir /var/www/events-system start",
      fastifyCommand:
        "/usr/bin/pnpm --dir /var/www/events-system/src/server start:fastify",
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
      ec2.InitCommand.shellCommand("dnf install -y nodejs jq awscli", {
        key: "02-install-runtime-tools",
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
      ec2.InitCommand.shellCommand(
        [
          `DB_SECRET=$(aws secretsmanager get-secret-value --secret-id ${this.dbSecretArn} --query SecretString --output text)`,
          `DB_PASSWORD=$(echo "$DB_SECRET" | jq -r .password)`,
          `echo "PGPASSWORD=$DB_PASSWORD" >> /etc/events-system/server.env`,
        ].join(" && "),
        {
          key: "06-write-db-password",
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
