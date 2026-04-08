import path from "path";
import { config } from "dotenv";
import { Stack, StackProps, CfnOutput, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { AppServerBootstrap } from "../constructs/appServerBootstrap";
import { AppSecrets } from "../constructs/appSecrets";
import { DbBootstrap } from "../constructs/dbBootstrap";

config({ path: path.resolve(process.cwd(), ".env") });

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = this.lookupVpc();
    const instanceRole = this.createInstanceRole();
    const webSecurityGroup = this.createWebSecurityGroup(vpc);

    const appSecrets = new AppSecrets(this, "AppSecrets", {
      instanceRole,
    });

    const db = new DbBootstrap(this, "DbBootstrap", {
      vpc,
      webSecurityGroup,
      instanceRole,
    });

    const instance = this.createWebInstance(
      vpc,
      instanceRole,
      webSecurityGroup,
      db,
      appSecrets,
    );

    Tags.of(instance).add("Name", "events-system-webserver");
    this.addInstanceOutputs(instance);
  }

  private lookupVpc(): ec2.IVpc {
    return ec2.Vpc.fromLookup(this, "DefaultVpc", {
      isDefault: true,
    });
  }

  private createInstanceRole(): iam.Role {
    const role = new iam.Role(this, "WebServerRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonSSMManagedInstanceCore",
      ),
    );

    return role;
  }

  private createWebSecurityGroup(vpc: ec2.IVpc): ec2.SecurityGroup {
    const securityGroup = new ec2.SecurityGroup(this, "ES-Webserver-SG", {
      vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP traffic",
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS traffic",
    );

    return securityGroup;
  }

  private createWebInstance(
    vpc: ec2.IVpc,
    role: iam.Role,
    securityGroup: ec2.SecurityGroup,
    db: DbBootstrap,
    appSecrets: AppSecrets,
  ): ec2.Instance {
    const boostrap = new AppServerBootstrap({
      dbHost: db.database.instanceEndpoint.hostname,
      dbName: db.databaseName,
      dbPort: db.database.instanceEndpoint.port.toString(),
      dbUser: db.databaseUser,
      dbSecretArn: db.secret.secretArn,
      cookieSecretArn: appSecrets.cookieSecret.secretArn,
    });

    return new ec2.Instance(this, "ES-Webserver", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role,
      instanceType: new ec2.InstanceType("t3.large"),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup,
      init: boostrap.buildInit(),
    });
  }

  private addInstanceOutputs(instance: ec2.Instance): void {
    new CfnOutput(this, "InstancePublicIp", {
      value: instance.instancePublicIp,
    });

    new CfnOutput(this, "InstancePublicDns", {
      value: instance.instancePublicDnsName,
    });

    new CfnOutput(this, "InstanceId", {
      value: instance.instanceId,
    });
  }
}
