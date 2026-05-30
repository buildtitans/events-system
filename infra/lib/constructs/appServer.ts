import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { AppServerBootstrap } from "./appServerBootstrap";
import { appConfig } from "../config/appConfig";

type AppServerProps = {
  vpc: ec2.IVpc;
  role: iam.IRole;
  securityGroup: ec2.ISecurityGroup;
  db: {
    host: string;
    port: string;
    name: string;
    user: string;
    secretArn: string;
  };
  secrets: {
    cookieSecretArn: string;
    appRuntimeConfigArn: string;
  };
};

export class AppServer extends Construct {
  public readonly instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: AppServerProps) {
    super(scope, id);

    const bootstrap = new AppServerBootstrap({
      dbHost: props.db.host,
      dbPort: props.db.port,
      dbName: props.db.name,
      dbUser: props.db.user,
      dbSecretArn: props.db.secretArn,
      cookieSecretArn: props.secrets.cookieSecretArn,
      appRuntimeConfigArn: props.secrets.appRuntimeConfigArn,
    });

    this.instance = new ec2.Instance(this, "Instance", {
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: appConfig.webServer.subnetType,
      },
      role: props.role,
      instanceType: new ec2.InstanceType(appConfig.webServer.instanceType),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup: props.securityGroup,
      init: bootstrap.buildInit(),
    });
  }
}
