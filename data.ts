import { Construct } from 'constructs'
import { Resource } from 'cdktf'
import { DataAwsIamPolicyDocument } from '@cdktf/provider-aws'

export { DataPolicyDocuments }

class DataPolicyDocuments extends Resource {
    fleetIqDeveloperPolicy: DataAwsIamPolicyDocument
    fleetIqEc2TrustPolicy: DataAwsIamPolicyDocument
    fleetIqEc2Policy: DataAwsIamPolicyDocument
    fleetIqServiceTrustPolicy: DataAwsIamPolicyDocument

    constructor(scope: Construct, name: string) {
        super(scope, name)

        const fleetIqDeveloperPolicyDocument = new DataAwsIamPolicyDocument(this, 'fleetIqDeveloperPolicyDocument', {
            statement: [
                {
                    sid: 'passRole',
                    effect: 'Allow',
                    actions: ['iam:PassRole'],
                    resources: ['*']
                },
                {
                    sid: 'serviceLinkedRole',
                    effect: 'Allow',
                    actions: ['iam:CreateServiceLinkedRole'],
                    resources: ['arn:*:iam::*:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling']
                },
                {
                    sid: 'ec2',
                    effect: 'Allow',

                    actions: [
                        "ec2:DescribeAvailabilityZones",
                        "ec2:DescribeSubnets",
                        "ec2:RunInstances"
                    ],

                    resources: ['*']
                },
                {
                    sid: 'events',
                    effect: 'Allow',

                    actions: [
                        "events:PutRule",
                        "events:PutTargets"
                    ],

                    resources: ['*']
                },
                {
                    sid: 'autoscaling',
                    effect: 'Allow',

                    actions: [
                        "autoscaling:CreateAutoScalingGroup",
                        "autoscaling:DescribeAutoScalingGroups",
                        "autoscaling:ExitStandby",
                        "autoscaling:PutLifecycleHook",
                        "autoscaling:PutScalingPolicy",
                        "autoscaling:ResumeProcesses",
                        "autoscaling:SetInstanceProtection",
                        "autoscaling:UpdateAutoScalingGroup",
                        "autoscaling:DeleteAutoScalingGroup"
                    ],

                    resources: ['*']
                }
            ]
        })

        const fleetIqEc2TrustPolicyDocument = new DataAwsIamPolicyDocument(this, 'fleetIqEc2TrustPolicyDocument', {
            statement: [
                {
                    sid: 'fleetIqEc2TrustPolicyDocument',
                    effect: 'Allow',

                    principals: [
                        {
                            type: 'Service',
                            identifiers: ['ec2.amazonaws.com']
                        }
                    ]
                }
            ]
        })

        const fleetIqEc2PolicyDocument = new DataAwsIamPolicyDocument(this, 'fleetIqEc2PolicyDocument', {
            statement: [
                {
                    sid: 'fleetIqEc2PolicyDocument',
                    effect: 'Allow',
                    actions: ['gamelift:*'],
                    resources: ['*']
                }
            ]
        })

        const fleetIqServiceTrustPolicyDocument = new DataAwsIamPolicyDocument(this, 'fleetIqServiceTrustPolicyDocument', {
            statement: [
                {
                    sid: 'fleetIqServiceTrustPolicyDocument',
                    effect: 'Allow',

                    principals: [
                        {
                            type: 'Service',
                            identifiers: [
                                'gamelift.amazonaws.com',
                                'autoscaling.amazonaws.com'
                            ]
                        }
                    ],

                    actions: [ 'sts:AssumeRole' ],
                }
            ]
        })

        this.fleetIqDeveloperPolicy = fleetIqDeveloperPolicyDocument
        this.fleetIqEc2TrustPolicy = fleetIqEc2TrustPolicyDocument
        this.fleetIqEc2Policy = fleetIqEc2PolicyDocument
        this.fleetIqServiceTrustPolicy = fleetIqServiceTrustPolicyDocument
    }
}
