# @inquisitive/serverless-apigateway-service-proxy

[![npm version](https://badge.fury.io/js/%40inquisitive%2Fserverless-apigateway-service-proxy.svg)](https://www.npmjs.com/package/@inquisitive/serverless-apigateway-service-proxy)

This is a fork of the [serverless-operations/serverless-apigateway-service-proxy](https://github.com/serverless-operations/serverless-apigateway-service-proxy) project that fixes compatibility with Serverless Framework v4 (issue [#170](https://github.com/serverless-operations/serverless-apigateway-service-proxy/issues/170)).

## What is this plugin?

The Serverless API Gateway Service Proxy plugin enables direct integration between Amazon API Gateway and various AWS services without requiring Lambda functions as intermediaries. This allows you to:

- Create more cost-effective and lower-latency API endpoints
- Reduce complexity by eliminating unnecessary Lambda functions
- Connect API Gateway directly to services like Kinesis, SQS, SNS, S3, DynamoDB, and EventBridge

## Installation

You can install this plugin from npm:

```bash
# Using npm
npm install @inquisitive/serverless-apigateway-service-proxy --save-dev

# Using yarn
yarn add @inquisitive/serverless-apigateway-service-proxy --dev
```

![NPM](https://nodei.co/npm/@inquisitive/serverless-apigateway-service-proxy.png)

## Usage

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - '@inquisitive/serverless-apigateway-service-proxy'
```

Then define your service proxies under the `custom.apiGatewayServiceProxies` section.

## Supported AWS Services

This plugin supports direct API Gateway integration with:

- Kinesis Streams
- SQS
- S3
- SNS
- DynamoDB
- EventBridge

## Configuration Examples

### Kinesis Example

```yaml
custom:
  apiGatewayServiceProxies:
    - kinesis:
        path: /kinesis
        method: post
        streamName: { Ref: 'YourStream' }
        cors: true

resources:
  Resources:
    YourStream:
      Type: AWS::Kinesis::Stream
      Properties:
        ShardCount: 1
```

### SQS Example

```yaml
custom:
  apiGatewayServiceProxies:
    - sqs:
        path: /sqs
        method: post
        queueName: { 'Fn::GetAtt': ['SQSQueue', 'QueueName'] }
        cors: true

resources:
  Resources:
    SQSQueue:
      Type: 'AWS::SQS::Queue'
```

### S3 Example

```yaml
custom:
  apiGatewayServiceProxies:
    - s3:
        path: /s3/{key}
        method: post
        action: PutObject
        bucket:
          Ref: S3Bucket
        key:
          pathParam: key
        cors: true

resources:
  Resources:
    S3Bucket:
      Type: 'AWS::S3::Bucket'
```

### SNS Example

```yaml
custom:
  apiGatewayServiceProxies:
    - sns:
        path: /sns
        method: post
        topicName: { 'Fn::GetAtt': ['SNSTopic', 'TopicName'] }
        cors: true

resources:
  Resources:
    SNSTopic:
      Type: AWS::SNS::Topic
```

### DynamoDB Example

```yaml
custom:
  apiGatewayServiceProxies:
    - dynamodb:
        path: /dynamodb/{id}
        method: put
        tableName: { Ref: 'YourTable' }
        hashKey:
          pathParam: id
          attributeType: S
        action: PutItem
        cors: true

resources:
  Resources:
    YourTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: YourTable
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

### EventBridge Example

```yaml
custom:
  apiGatewayServiceProxies:
    - eventbridge:
        path: /eventbridge
        method: post
        source: 'custom_source'
        detailType: 'custom_detail_type'
        eventBusName: { Ref: 'YourBusName' }
        cors: true

resources:
  Resources:
    YourBus:
      Type: AWS::Events::EventBus
      Properties:
        Name: YourEventBus
```

## Common Features

### Enabling CORS

Add CORS support to any endpoint:

```yaml
custom:
  apiGatewayServiceProxies:
    - kinesis:
        path: /kinesis
        method: post
        streamName: { Ref: 'YourStream' }
        cors: true # Enable CORS with default settings
```

For more granular control:

```yaml
cors:
  origin: '*'
  headers:
    - Content-Type
    - X-Amz-Date
    - Authorization
    - X-Api-Key
  allowCredentials: false
```

### Adding Authorization

```yaml
custom:
  apiGatewayServiceProxies:
    - sqs:
        path: /sqs
        method: post
        queueName: { 'Fn::GetAtt': ['SQSQueue', 'QueueName'] }
        authorizationType: 'AWS_IAM' # Options: 'NONE', 'AWS_IAM', 'CUSTOM', 'COGNITO_USER_POOLS'
```

## Why This Fork?

The original project has compatibility issues with Serverless Framework v4, specifically:

- In Serverless v4, the internal path structure changed, causing the error: `Cannot find module 'serverless/lib/plugins/aws/package/compile/events/api-gateway/lib/rest-api'`
- This fork updates the dependencies and fixes these compatibility issues to work with the latest version of the Serverless Framework (v4+)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
