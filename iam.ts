import { Construct } from 'constructs'
import { Resource } from 'cdktf'
import {
    IamGroup, IamInstanceProfile,
    IamPolicy,
    IamPolicyAttachment, IamRole,
} from '@cdktf/provider-aws'
import { DataPolicyDocuments } from './data'

export class FleetIqIam extends Resource {

    constructor(scope: Construct, name: string) {
        super(scope, name)

        const FleetIqDevName: string = 'fleetIq-developer'
        const FleetIqSvcName: string = 'fleetIq-service'
        const FleetIqEC2Name: string = 'fleetIq-ec2'

        const dataIamPolicies = new DataPolicyDocuments(this, 'dataIamPolicies')

        const fleetIqDeveloperPolicy = new IamPolicy(this, 'fleetIqDeveloperPolicy', {
            name: FleetIqDevName,
            description: 'See https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-iam-permissions-users.html',
            policy: dataIamPolicies.fleetIqDeveloperPolicy.json
        })

        const fleetIqDeveloperGroup = new IamGroup(this, 'fleetIqDeveloperGroup', {
            name: FleetIqDevName,
        })

        new IamPolicyAttachment(this, 'fleetIqDeveloperGroupPolicyAttachment', {
            name: FleetIqDevName,
            policyArn: fleetIqDeveloperPolicy.arn,
            groups: [ fleetIqDeveloperGroup.name ]
        })

        const fleetIqServiceRole = new IamRole(this, 'fleetIqServiceRole', {
            name: FleetIqSvcName,
            assumeRolePolicy: dataIamPolicies.fleetIqServiceTrustPolicy.json
        })

        new IamPolicyAttachment(this, 'fleetIqServiceRolePolicyAttachment', {
            name: FleetIqSvcName,
            policyArn: 'arn:aws:iam::aws:policy/GameLiftGameServerGroupPolicy',
            roles: [ fleetIqServiceRole.name ]
        })

        const fleetIqEc2Role = new IamRole(this, 'fleetIqEc2Role', {
            name: FleetIqEC2Name,
            assumeRolePolicy: dataIamPolicies.fleetIqEc2TrustPolicy.json
        })

        const fleetIqEc2Policy = new IamPolicy(this, 'fleetIqEc2Policy', {
            name: FleetIqEC2Name,
            description: 'See https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-iam-permissions-roles.html',
            policy: dataIamPolicies.fleetIqEc2Policy.json
        })

        new IamPolicyAttachment(this, 'fleetIqEc2PolicyAttachment', {
            name: FleetIqEC2Name,
            policyArn: fleetIqEc2Policy.arn,
            roles: [ fleetIqEc2Role.name ]
        })

        new IamInstanceProfile(this, 'fleetIqEc2InstanceProfile', {
            name: FleetIqEC2Name,
            role: fleetIqEc2Role.name
        })
    }
}
