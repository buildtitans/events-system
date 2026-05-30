import * as ec2 from "aws-cdk-lib/aws-ec2";

export const appConfig = {
  domainName: "events-system.dev",
  webServer: {
    nameTag: "events-system-webserver",
    instanceType: "t3.large",
    subnetType: ec2.SubnetType.PUBLIC,
  },
  database: {
    name: "events_system_db",
    user: "events_system_user",
  },
  secrets: {
    appRuntimeConfigName: "events-system/app/runtime",
  },
  paths: {
    appRoot: "/var/www/events-system",
    serverEnvFile: "/etc/events-system/server.env",
  },
} as const;
