import { AppServerBootstrap } from "../lib/constructs/appServerBootstrap";

describe("AppServerBootstrap", () => {
  it("builds CloudFormation init from app server assets", () => {
    expect(() =>
      new AppServerBootstrap({
        appRuntimeConfigArn: "arn:aws:secretsmanager:us-east-1:123:secret:app",
        cookieSecretArn: "arn:aws:secretsmanager:us-east-1:123:secret:cookie",
        dbHost: "database.example.com",
        dbName: "events_system_db",
        dbPort: "5432",
        dbSecretArn: "arn:aws:secretsmanager:us-east-1:123:secret:db",
        dbUser: "events_system_user",
      }).buildInit(),
    ).not.toThrow();
  });
});
