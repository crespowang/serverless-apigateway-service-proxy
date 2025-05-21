# Serverless API Gateway Service Proxy v3.0.1

## Major Changes

- **Serverless Framework v4 Compatibility**: Updated the plugin to work with the latest Serverless Framework v4
- **Fork from Original Repository**: Created as a fork of `serverless-operations/serverless-apigateway-service-proxy` to address compatibility issues
- **Updated Package Name**: Changed to `@inquisitive/serverless-apigateway-service-proxy`

## Why This Release?

The original plugin had compatibility issues with Serverless Framework v4, particularly:

- In Serverless v4, the internal path structure changed, causing the error: `Cannot find module 'serverless/lib/plugins/aws/package/compile/events/api-gateway/lib/rest-api'`
- This fork updates the dependencies and fixes these compatibility issues to work with the latest version of the Serverless Framework (v4+)

## What's Fixed

- Updated file paths to match the new Serverless Framework v4 structure
- Added new files for API Gateway compilation logic
- Enhanced error handling for better debugging
- Updated dependencies and devDependencies for compatibility

## Additional Notes

- Switched from npm to yarn for dependency management
- Enhanced documentation to reflect changes and new compatibility features
- Maintained backward compatibility with existing configurations
