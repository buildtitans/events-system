import path from "path";
import { config } from "dotenv";
import { Stack, StackProps, CfnOutput, Tags, Fn } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as route53 from "aws-cdk-lib/aws-route53";
import { AppServer } from "../constructs/appServer";
import { AppEdge } from "../constructs/appEdge";
import { AppSecrets } from "../constructs/appSecrets";
import { DbBootstrap } from "../constructs/dbBootstrap";
import { appConfig } from "../config/appConfig";

config({ path: path.resolve(process.cwd(), ".env") });

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = this.createHostedZone(appConfig.domainName);
    const vpc = this.lookupVpc();
    const instanceRole = this.createInstanceRole();
    const webSecurityGroup = this.createWebSecurityGroup(vpc);
    const releaseBucket = this.createReleaseBucket();

    releaseBucket.grantRead(instanceRole);

    const appSecrets = new AppSecrets(this, "AppSecrets", {
      instanceRole,
    });

    const db = new DbBootstrap(this, "DbBootstrap", {
      vpc,
      webSecurityGroup,
      instanceRole,
      databaseName: appConfig.database.name,
      databaseUser: appConfig.database.user,
    });

    const appServer = new AppServer(this, "AppServer", {
      vpc,
      role: instanceRole,
      securityGroup: webSecurityGroup,
      db: {
        host: db.database.instanceEndpoint.hostname,
        port: db.database.instanceEndpoint.port.toString(),
        name: db.databaseName,
        user: db.databaseUser,
        secretArn: db.secret.secretArn,
      },
      secrets: {
        cookieSecretArn: appSecrets.cookieSecret.secretArn,
        appRuntimeConfigArn: appSecrets.appRuntimeConfig.secretArn,
      },
    });

    const appEdge = new AppEdge(this, "AppEdge", {
      vpc,
      hostedZone,
      domainName: appConfig.domainName,
      targetInstance: appServer.instance,
    });

    webSecurityGroup.addIngressRule(
      appEdge.loadBalancerSecurityGroup,
      ec2.Port.tcp(80),
      "Allow ALB to reach nginx on the web instance",
    );

    Tags.of(appServer.instance).add("Name", appConfig.webServer.nameTag);
    this.addInstanceOutputs(appServer.instance, releaseBucket, hostedZone);
  }

  private createHostedZone(domainName: string): route53.PublicHostedZone {
    return new route53.PublicHostedZone(this, "EventsSystemHostedZone", {
      zoneName: domainName,
    });
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
    return new ec2.SecurityGroup(this, "ES-Webserver-SG", {
      vpc,
      allowAllOutbound: true,
    });
  }

  private createReleaseBucket(): s3.Bucket {
    return new s3.Bucket(this, "ReleaseArtifactsBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
    });
  }

  private addInstanceOutputs(
    instance: ec2.Instance,
    releaseBucket: s3.Bucket,
    hostedZone: route53.PublicHostedZone,
  ): void {
    new CfnOutput(this, "InstancePublicIp", {
      value: instance.instancePublicIp,
    });

    new CfnOutput(this, "InstancePublicDns", {
      value: instance.instancePublicDnsName,
    });

    new CfnOutput(this, "InstanceId", {
      value: instance.instanceId,
    });

    new CfnOutput(this, "ReleaseBucketName", {
      value: releaseBucket.bucketName,
    });

    new CfnOutput(this, "HostedZoneId", {
      value: hostedZone.hostedZoneId,
    });

    new CfnOutput(this, "HostedZoneNameServers", {
      value: hostedZone.hostedZoneNameServers
        ? Fn.join(", ", hostedZone.hostedZoneNameServers)
        : "",
    });
  }
}
