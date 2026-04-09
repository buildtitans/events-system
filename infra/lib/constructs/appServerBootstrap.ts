import * as ec2 from "aws-cdk-lib/aws-ec2";
import { AppServerServices } from "./appServerServices";

type AppServerBootstrapDeps = {
  dbHost: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbSecretArn: string;
  cookieSecretArn: string;
};

export class AppServerBootstrap {
  private readonly dbHost: string;
  private readonly dbPort: string;
  private readonly dbName: string;
  private readonly dbUser: string;
  private readonly dbSecretArn: string;
  private readonly cookieSecretArn: string;
  constructor(deps: AppServerBootstrapDeps) {
    this.dbHost = deps.dbHost;
    this.dbPort = deps.dbPort;
    this.dbName = deps.dbName;
    this.dbUser = deps.dbUser;
    this.dbSecretArn = deps.dbSecretArn;
    this.cookieSecretArn = deps.cookieSecretArn;
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
      ec2.InitCommand.shellCommand("dnf install -y nginx", {
        key: "06-install-nginx",
      }),
      ec2.InitFile.fromString(
        "/etc/events-system/server.env",
        [
          `PGHOST=${this.dbHost}`,
          `PGPORT=${this.dbPort}`,
          `PGDATABASE=${this.dbName}`,
          `PGUSER=${this.dbUser}`,
          "PGMAX=10",
          "PROD_FASTIFY_HOST=127.0.0.1",
          "PROD_FASTIFY_PORT=3001",
          "NODE_ENV=production",
        ].join("\n") + "\n",
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
          key: "07-write-db-password",
        },
      ),
      ec2.InitCommand.shellCommand(
        [
          `COOKIE_SECRET=$(aws secretsmanager get-secret-value --secret-id ${this.cookieSecretArn} --query SecretString --output text | jq -r .secret)`,
          `echo "COOKIES_SECRET=$COOKIE_SECRET" >> /etc/events-system/server.env`,
        ].join(" && "),
        {
          key: "write-cookie-secret",
        },
      ),
      ec2.InitFile.fromString(
        "/etc/nginx/conf.d/events-system.conf",
        [
          "map $http_x_forwarded_proto $forwarded_proto {",
          "    default $http_x_forwarded_proto;",
          '    ""      $scheme;',
          "}",
          "",
          "server {",
          "    listen 80;",
          "    server_name _;",
          "",
          "    location /api/trpc {",
          "        proxy_pass http://127.0.0.1:3001;",
          "        proxy_http_version 1.1;",
          "        proxy_set_header Host $host;",
          "        proxy_set_header X-Real-IP $remote_addr;",
          "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;",
          "        proxy_set_header X-Forwarded-Proto $forwarded_proto;",
          "    }",
          "",
          "    location / {",
          "        proxy_pass http://127.0.0.1:3000;",
          "        proxy_http_version 1.1;",
          "        proxy_set_header Host $host;",
          "        proxy_set_header X-Real-IP $remote_addr;",
          "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;",
          "        proxy_set_header X-Forwarded-Proto $forwarded_proto;",
          "    }",
          "}",
          "",
        ].join("\n"),
        {
          mode: "000644",
          owner: "root",
          group: "root",
        },
      ),
      ec2.InitCommand.shellCommand("nginx -t", {
        key: "08-validate-nginx",
      }),
      ec2.InitService.enable("nginx", {
        serviceManager: ec2.ServiceManager.SYSTEMD,
        enabled: true,
        ensureRunning: true,
      }),
      ...services.buildInitElements(),
      ec2.InitFile.fromString(
        "/var/www/events-system/BOOTSTRAPPED.txt",
        "CloudFormationInit ran successfully\n",
      ),
    );
  }
}
