# Serverless API Gateway Service Proxy v2.2.1

## Features

- **Enhanced S3 Integration**: Added support for HTTP 206 Partial Content response with its relevant headers
- **Improved Range Header Support**: Added S3 integration for Range header in GetObject operations
- **Accept-Ranges Header**: Added Accept-Ranges header to responses for better client compatibility

## What's Fixed

- Added proper handling of Range request headers for S3 GetObject operations
- Added Content-Range response headers for partial content responses
- Implemented proper status code selection patterns to handle 206 responses

## Technical Details

- Added a 206 status code to the method responses
- Updated the selection pattern to differentiate between 200 and 206 responses
- Added support for passing Range header from the client to S3
- Added integration response mapping for content-range and accept-ranges headers

## Use Cases

This update is particularly useful for applications that need to handle large files or streaming media where clients can request specific byte ranges of a resource.
