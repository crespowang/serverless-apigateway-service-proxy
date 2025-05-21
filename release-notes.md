# Serverless API Gateway Service Proxy v4.0.0

## Major Changes

- **Upgraded AWS SDK from v2 to v3**: This is a significant update that modernizes the codebase and provides better TypeScript support, modularity, and middleware capabilities
- **Implemented modular import approach**: AWS SDK v3 uses a modular architecture for reduced bundle size and more efficient imports
- **Updated all AWS service clients**: Modified the client-command pattern used throughout the codebase

## Breaking Changes

- Requires changes to any custom code that interacts with this plugin and uses AWS SDK
- The AWS SDK v3 client-command pattern differs significantly from v2 method calls

## Migration Guide

If you're extending this plugin with custom code that interacts with AWS SDK:

1. Replace global AWS import with modular imports:

   ```js
   // Old (v2)
   const AWS = require('aws-sdk')
   const s3 = new AWS.S3()

   // New (v3)
   const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
   const s3Client = new S3Client({ region: 'us-east-1' })
   ```

2. Update method calls to use commands:

   ```js
   // Old (v2)
   const result = await s3.getObject({ Bucket: 'mybucket', Key: 'mykey' }).promise()

   // New (v3)
   const result = await s3Client.send(new GetObjectCommand({ Bucket: 'mybucket', Key: 'mykey' }))
   ```

## Additional Notes

- This version maintains compatibility with Serverless Framework v4
- All tests have been updated to work with AWS SDK v3
