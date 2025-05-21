'use strict'

const _ = require('lodash')
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

// AWS SDK v3 imports - modular approach
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  DeleteItemCommand
} = require('@aws-sdk/client-dynamodb')
const { CloudFormationClient, DescribeStacksCommand } = require('@aws-sdk/client-cloudformation')

const region = 'us-east-1'
const s3Client = new S3Client({ region })
const dynamodbClient = new DynamoDBClient({ region })
const cloudformationClient = new CloudFormationClient({ region })

function getApiGatewayEndpoint(outputs) {
  return outputs.ServiceEndpoint.match(/https:\/\/.+\.execute-api\..+\.amazonaws\.com.+/)[0]
}

async function getStackOutputs(stackName) {
  const result = await cloudformationClient.send(
    new DescribeStacksCommand({ StackName: stackName })
  )
  const stack = result.Stacks[0]

  const keys = stack.Outputs.map((x) => x.OutputKey)
  const values = stack.Outputs.map((x) => x.OutputValue)

  return _.zipObject(keys, values)
}

async function getDynamodbItemWithHashKey(tableName, hashKeyAttribute, hashKey) {
  return await dynamodbClient.send(
    new GetItemCommand({
      Key: {
        [hashKeyAttribute]: hashKey
      },
      TableName: tableName
    })
  )
}

async function getDynamodbItemWithHashKeyAndRangeKey(
  tableName,
  hashKeyAttribute,
  hashKey,
  rangeKeyAttribute,
  rangeKey
) {
  return await dynamodbClient.send(
    new GetItemCommand({
      Key: {
        [hashKeyAttribute]: hashKey,
        [rangeKeyAttribute]: rangeKey
      },
      TableName: tableName
    })
  )
}

async function putDynamodbItem(tableName, item) {
  await dynamodbClient.send(
    new PutItemCommand({
      Item: item,
      TableName: tableName
    })
  )
}

async function cleanUpDynamodbItems(tableName, hashKeyAttribute, rangeKeyAttribute) {
  const items = await dynamodbClient.send(new ScanCommand({ TableName: tableName }))
  if (items.Count > 0) {
    await Promise.all(
      items.Items.map(async (item) => {
        const key = {
          [hashKeyAttribute]: item[hashKeyAttribute]
        }

        if (rangeKeyAttribute) {
          key[rangeKeyAttribute] = item[rangeKeyAttribute]
        }
        await dynamodbClient.send(
          new DeleteItemCommand({
            Key: key,
            TableName: tableName
          })
        )
      })
    )
  }
}

async function getS3Object(bucket, key) {
  const resp = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key
    })
  )

  return resp.Body
}

async function deleteS3Object(bucket, key) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    })
  )
}

function deployService(stage, config) {
  execSync(`npx serverless deploy --stage ${stage} --config ${path.basename(config)}`, {
    stdio: 'inherit',
    cwd: path.dirname(config)
  })
}

function removeService(stage, config) {
  execSync(`npx serverless remove --stage ${stage} --config ${path.basename(config)}`, {
    stdio: 'inherit',
    cwd: path.dirname(config)
  })
}

async function deployWithRandomStage(config) {
  const serviceName = yaml.safeLoad(fs.readFileSync(config)).service
  const stage = Math.random().toString(32).substring(2)
  const stackName = `${serviceName}-${stage}`
  deployService(stage, config)
  const outputs = await getStackOutputs(stackName)
  const endpoint = getApiGatewayEndpoint(outputs)

  return { stackName, stage, outputs, endpoint, region }
}

module.exports = {
  deployService,
  removeService,
  deployWithRandomStage,
  getS3Object,
  deleteS3Object,
  getDynamodbItemWithHashKey,
  getDynamodbItemWithHashKeyAndRangeKey,
  putDynamodbItem,
  cleanUpDynamodbItems
}
