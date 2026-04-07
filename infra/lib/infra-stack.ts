import { Stack, StackProps, CfnOutput, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

const dbHost = process.env.PGHOST;
const dbPort = process.env.PGPORT;
const dbName = process.env.PGDATABASE;
const dbUser = process.env.PGUSER;

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVpc", {
      isDefault: true,
    });

    const instanceRole = new iam.Role(this, "WebServerRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonSSMManagedInstanceCore",
      ),
    );

    const instanceType = new ec2.InstanceType("t3.large");

    const machineImage = ec2.MachineImage.latestAmazonLinux2023();

    const sg = new ec2.SecurityGroup(this, "Webserver-SG", {
      vpc,
      allowAllOutbound: true,
    });

    sg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP traffic",
    );

    sg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS traffic",
    );

    const instance = new ec2.Instance(this, "ES-Webserver", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role: instanceRole,
      instanceType,
      machineImage,
      securityGroup: sg,
    });
    instance.addUserData(
      "dnf update -y",
      "curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -",
      "dnf install -y nodejs",
      "npm install -g pnpm",
      "mkdir -p /var/www/events-system",
      "mkdir -p /etc/events-system",
      `echo PGHOST=${dbHost} >> /etc/events-system/server.env`,
      `echo PGPORT=${dbPort} >> /etc/events-system/server.env`,
      `echo PGDATABASE=${dbName} >> /etc/events-system/server.env`,
      `echo PGUSER=${dbUser} >> /etc/events-system/server.env`,
      'echo "UserData ran successfully" > /var/www/events-system/BOOTSTRAPPED.txt',
    );

    Tags.of(instance).add("Name", "build-titans-webserver");

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
