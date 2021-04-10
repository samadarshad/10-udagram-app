import type { AWS } from '@serverless/typescript';

import functions from 'functions';
import resources from 'resources';
import iamRoleStatements from 'iamRoleStatements';
import environment from 'environment';

const serverlessConfiguration: AWS = {
  service: 'serverless-udagram-app',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    topicName: 'imagesTopic-${self:provider.stage}',
    imagesSearchDomainName: 'images-search-${self:provider.stage}'
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    // @ts-ignore
    region: "${opt:region, 'eu-west-2'}",
    stage: "${opt:stage, 'dev'}",    
    environment,
    iamRoleStatements,
    lambdaHashingVersion: '20201221',    
  },
  functions,
  resources
};

module.exports = serverlessConfiguration;
