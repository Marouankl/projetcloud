const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const s3Client = new S3Client({ region: process.env.TABLE_REGION });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

let tableName = "booksTable";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName += '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: Update if needed
const partitionKeyName = "id";
const partitionKeyType = "N";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/books";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// Declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Convert URL string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param, 10);
    default:
      return param;
  }
};

// HTTP Get method to list DynamoDB objects
app.get(path, async (req, res) => {
  const params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({error: 'Could not load items: ' + err.message});
  }
});

// HTTP Get method to query DynamoDB objects
app.get(path + hashKeyPath, async (req, res) => {
  const condition = {
    [partitionKeyName]: {
      ComparisonOperator: 'EQ',
      AttributeValueList: []
    }
  };

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName].AttributeValueList.push(req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH);
  } else {
    try {
      condition[partitionKeyName].AttributeValueList.push(convertUrlType(req.params[partitionKeyName], partitionKeyType));
    } catch (err) {
      return res.status(500).json({error: 'Wrong column type: ' + err.message});
    }
  }

  const queryParams = {
    TableName: tableName,
    KeyConditions: condition
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(queryParams));
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({error: 'Could not load items: ' + err.message});
  }
});

// HTTP Get method for getting a single DynamoDB object
app.get('/books/:id', async (req, res) => {
  const params = {};
  params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);

  const getItemParams = {
    TableName: tableName,
    Key: params
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(getItemParams));
    res.json(data.Item || {});
  } catch (err) {
    res.status(500).json({error: 'Could not load item: ' + err.message});
  }
});

// HTTP Put method for inserting DynamoDB object
app.put(path, async (req, res) => {
  if (!req.body[partitionKeyName]) {
    req.body[partitionKeyName] = Date.now();  // Génération d'un ID unique basé sur l'heure actuelle
  }

  const putItemParams = {
    TableName: tableName,
    Item: req.body
  };

  try {
    await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'Put call succeeded!', data: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Could not insert item: ' + err.message });
  }
});


// HTTP Post method for inserting DynamoDB object
app.post(path, async (req, res) => {
  if (!req.body[partitionKeyName]) {
    req.body[partitionKeyName] = Date.now();  // Génération d'un ID unique basé sur l'heure actuelle
  }

  const putItemParams = {
    TableName: tableName,
    Item: req.body
  };

  try {
    await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'Post call succeeded!', data: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Could not insert item: ' + err.message });
  }
});

// HTTP Delete method for removing DynamoDB object
app.delete(path + '/object' + hashKeyPath + sortKeyPath, async (req, res) => {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      return res.status(500).json({error: 'Wrong column type: ' + err.message});
    }
  }

  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      return res.status(500).json({error: 'Wrong column type: ' + err.message});
    }
  }

  const removeItemParams = {
    TableName: tableName,
    Key: params
  };

  try {
    const data = await ddbDocClient.send(new DeleteCommand(removeItemParams));
    res.json({ success: 'Delete call succeeded!', data });
  } catch (err) {
    res.status(500).json({error: 'Could not delete item: ' + err.message});
  }
});

// S3 Routes
// Upload file to S3
app.post(path, async (req, res) => {
  const { fileName, fileContent } = req.body;

  if (!fileName || !fileContent) {
    return res.status(400).json({ error: 'Missing fileName or fileContent' });
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileContent, 'base64'), // Encodage en base64
      ContentEncoding: 'base64', // Encodage défini comme base64
    });
    await s3Client.send(command);
    res.json({ success: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file: ' + err.message });
  }
});

// List files in S3 bucket
app.get(path, async (req, res) => {
  try {
    const command = new ListObjectsCommand({ Bucket: BUCKET_NAME });
    const data = await s3Client.send(command);
    res.json(data.Contents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list objects: ' + err.message });
  }
});

// Download file from S3
app.get('/download/:fileName', async (req, res) => {
  const fileName = req.params.fileName;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });
    const data = await s3Client.send(command);
    res.setHeader('Content-Type', data.ContentType);
    data.Body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download file: ' + err.message });
  }
});

// Delete file from S3
app.delete('/delete/:fileName', async (req, res) => {
  const fileName = req.params.fileName;

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });
    await s3Client.send(command);
    res.json({ success: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file: ' + err.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("App started on port 3000");
});

// Export the app object
module.exports = app;
