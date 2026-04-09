import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/stacks/infra-stack";

const app = new cdk.App();

new InfraStack(app, "EventsSystemStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
