import { Construct } from 'constructs'
import { App, S3Backend, TerraformStack } from 'cdktf'
import { AwsProvider } from '@cdktf/provider-aws'
import { FleetIqIam } from './iam'

class GameliftStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'aws', {
      region: 'eu-west-2'
    })

    new FleetIqIam(this, 'gameliftIam')
  }
}

const app = new App();
const stack = new GameliftStack(app, 'gamelift')
new S3Backend(stack, {
  bucket: 'gdsgrp-org-state',
  key: 'gamelift/state.json',
  region: 'eu-west-2'
})
app.synth()
