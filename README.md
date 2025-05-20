This is a fork of the https://github.com/serverless-operations/serverless-apigateway-service-proxy project, and it fixes the issue as per https://github.com/serverless-operations/serverless-apigateway-service-proxy/issues/170.

You should use this exactly the same way how you use the original plugin. Except, the name of the package is different. It is @inquisitive/serverless-apigateway-service-proxy. So you need to

```
npm install @inquisitive/serverless-apigateway-service-proxy
```

then in your servereless.yml

```
plugins:
  - '@inquisitive/serverless-apigateway-service-proxy'
...
```

custom:
apiGatewayServiceProxies: - kinesis:
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
