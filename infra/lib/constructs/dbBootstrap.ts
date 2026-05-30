import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { RemovalPolicy, Duration } from "aws-cdk-lib";

type DbBootstrapProps = {
  vpc: ec2.IVpc;
  webSecurityGroup: ec2.ISecurityGroup;
  instanceRole: iam.IRole;
  databaseName: string;
  databaseUser: string;
};

export class DbBootstrap extends Construct {
  public readonly securityGroup: ec2.SecurityGroup;
  public readonly database: rds.DatabaseInstance;
  public readonly secret: secretsmanager.ISecret;
  public readonly databaseName: string;
  public readonly databaseUser: string;

  constructor(scope: Construct, id: string, props: DbBootstrapProps) {
    super(scope, id);

    const { vpc, webSecurityGroup, instanceRole, databaseName, databaseUser } =
      props;

    this.databaseName = databaseName;
    this.databaseUser = databaseUser;

    this.securityGroup = new ec2.SecurityGroup(this, "EventsDb-SG", {
      vpc,
      allowAllOutbound: true,
    });

    this.securityGroup.addIngressRule(
      webSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow Postgres from EC2 app server",
    );

    //TODO: look into changing the SubnetType
    // ex) subnetType:ec2.SubnetType.PUBLIC →  subnetType: ec2.SubnetType.PRIVATE_ISOLATED

    this.database = new rds.DatabaseInstance(this, "EventsSystemDb", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [this.securityGroup],
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_11,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      databaseName: this.databaseName,
      credentials: rds.Credentials.fromGeneratedSecret(this.databaseUser),
      publiclyAccessible: false,
      multiAz: false,
      deletionProtection: false,
      removalPolicy: RemovalPolicy.DESTROY,
      backupRetention: Duration.days(0),
    });

    if (!this.database.secret) {
      throw new Error("Database secret was not created.");
    }

    this.secret = this.database.secret;
    this.secret.grantRead(instanceRole);
  }
}
