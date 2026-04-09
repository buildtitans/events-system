import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as elbv2Targets from "aws-cdk-lib/aws-elasticloadbalancingv2-targets";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

export type AppEdgeProps = {
  vpc: ec2.IVpc;
  hostedZone: route53.IHostedZone;
  domainName: string;
  targetInstance: ec2.Instance;
  targetPort?: number;
};

export class AppEdge extends Construct {
  public readonly certificate: acm.Certificate;
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;
  public readonly loadBalancerSecurityGroup: ec2.SecurityGroup;
  public readonly targetGroup: elbv2.ApplicationTargetGroup;

  constructor(scope: Construct, id: string, props: AppEdgeProps) {
    super(scope, id);

    const {
      vpc,
      hostedZone,
      domainName,
      targetInstance,
      targetPort = 80,
    } = props;

    this.loadBalancerSecurityGroup = new ec2.SecurityGroup(
      this,
      "LoadBalancerSecurityGroup",
      {
        vpc,
        allowAllOutbound: true,
        description: "Security group for the public application load balancer",
      },
    );

    this.loadBalancerSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP traffic to the ALB",
    );

    this.loadBalancerSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS traffic to the ALB",
    );

    this.certificate = new acm.Certificate(this, "Certificate", {
      domainName,
      subjectAlternativeNames: [`www.${domainName}`],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    this.loadBalancer = new elbv2.ApplicationLoadBalancer(
      this,
      "LoadBalancer",
      {
        vpc,
        internetFacing: true,
        securityGroup: this.loadBalancerSecurityGroup,
      },
    );

    this.targetGroup = new elbv2.ApplicationTargetGroup(this, "TargetGroup", {
      vpc,
      port: targetPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [new elbv2Targets.InstanceTarget(targetInstance, targetPort)],
      healthCheck: {
        path: "/",
        protocol: elbv2.Protocol.HTTP,
        healthyHttpCodes: "200-399",
      },
    });

    this.loadBalancer.addListener("HttpRedirectListener", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      open: true,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: "HTTPS",
        port: "443",
        permanent: true,
      }),
    });

    const httpsListener = this.loadBalancer.addListener("HttpsListener", {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [this.certificate],
      open: true,
    });

    httpsListener.addTargetGroups("AppTargets", {
      targetGroups: [this.targetGroup],
    });

    const aliasTarget = route53.RecordTarget.fromAlias(
      new route53Targets.LoadBalancerTarget(this.loadBalancer),
    );

    new route53.ARecord(this, "RootAliasARecord", {
      zone: hostedZone,
      target: aliasTarget,
    });

    new route53.AaaaRecord(this, "RootAliasAaaaRecord", {
      zone: hostedZone,
      target: aliasTarget,
    });

    new route53.ARecord(this, "WwwAliasARecord", {
      zone: hostedZone,
      recordName: "www",
      target: aliasTarget,
    });

    new route53.AaaaRecord(this, "WwwAliasAaaaRecord", {
      zone: hostedZone,
      recordName: "www",
      target: aliasTarget,
    });
  }
}
