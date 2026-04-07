import * as ec2 from "aws-cdk-lib/aws-ec2";

type AppServerServicesProps = {
  appRoot: string;
  envFilePath: string;
  nextCommand: string;
  fastifyCommand: string;
};

export class AppServerServices {
  constructor(private readonly props: AppServerServicesProps) {}

  public buildInitElements(): ec2.InitElement[] {
    const { appRoot, envFilePath, nextCommand, fastifyCommand } = this.props;

    return [
      ec2.InitService.systemdConfigFile("next", {
        description: "Next.js application",
        cwd: appRoot,
        command: nextCommand,
        environmentFiles: [envFilePath],
        keepRunning: true,
        afterNetwork: true,
      }),

      ec2.InitService.systemdConfigFile("fastify", {
        description: "Fastify API server",
        cwd: appRoot,
        command: fastifyCommand,
        environmentFiles: [envFilePath],
        keepRunning: true,
        afterNetwork: true,
      }),
    ];
  }
}
