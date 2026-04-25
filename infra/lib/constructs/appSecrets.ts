import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

type AppSecretsProps = {
  instanceRole: iam.IRole;
};

export class AppSecrets extends Construct {
  public readonly cookieSecret: secretsmanager.Secret;
  public readonly appRuntimeConfig: secretsmanager.ISecret;
  constructor(scope: Construct, id: string, props: AppSecretsProps) {
    super(scope, id);

    const { instanceRole } = props;

    this.cookieSecret = new secretsmanager.Secret(this, "CookieSecret", {
      description: "Cookie signing secret for the Events System app",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: "secret",
        excludePunctuation: true,
        includeSpace: false,
        passwordLength: 64,
      },
    });

    this.appRuntimeConfig = secretsmanager.Secret.fromSecretNameV2(
      this,
      "AppRuntimeConfig",
      "events-system/app/runtime",
    );

    this.cookieSecret.grantRead(instanceRole);
    this.appRuntimeConfig.grantRead(instanceRole);
  }
}
