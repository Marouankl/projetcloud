const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const s3Client = new S3Client({ region: process.env.TABLE_REGION });
const BUCKET_NAME = 's3-book-images';  // Update with your actual bucket name

const tableName = process.env.TABLE_NAME || "booksTable";

// Declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Réponse aux requêtes OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Pas de contenu à renvoyer pour OPTIONS
  }

  next();
});

// Helper function to convert URL params to the expected type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param, 10);
    default:
      return param;
  }
};

// DynamoDB Routes
app.get('/books', async (req, res) => {
  const params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: 'Could not load items: ' + err.message });
  }
});

app.get('/books/:id', async (req, res) => {
  const params = {
    TableName: tableName,
    Key: {
      id: req.params.id
    }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    res.json(data.Item || {});
  } catch (err) {
    res.status(500).json({ error: 'Could not load item: ' + err.message });
  }
});

app.post('/books', async (req, res) => {
  const newBook = req.body;

  // Validate and generate an ID if not provided
  if (!newBook.id) {
    newBook.id = String(Date.now());
  }

  const params = {
    TableName: tableName,
    Item: newBook
  };

  try {
    // Log the data being sent to DynamoDB
    console.log('Adding book to DynamoDB:', newBook);

    // Add the book to DynamoDB
    await ddbDocClient.send(new PutCommand(params));

    // Fetch the item back from DynamoDB to ensure it was stored correctly
    const getItemParams = {
      TableName: tableName,
      Key: { id: newBook.id }
    };
    const result = await ddbDocClient.send(new GetCommand(getItemParams));

    // Log the retrieved item
    console.log('Retrieved book from DynamoDB:', result.Item);

    // Return the complete book data in the response
    res.json({ success: 'Book added successfully!', data: result.Item });
  } catch (err) {
    res.status(500).json({ error: 'Could not add book: ' + err.message });
  }
});


app.put('/books/:id', async (req, res) => {
  const params = {
    TableName: tableName,
    Item: {
      id: req.params.id,
      ...req.body
    }
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    res.json({ success: 'Item created/updated successfully!', data: params.Item });
  } catch (err) {
    res.status(500).json({ error: 'Could not create/update item: ' + err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  const params = {
    TableName: tableName,
    Key: {
      id: req.params.id
    }
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    res.json({ success: 'Item deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete item: ' + err.message });
  }
});

// S3 Routes
app.post('/upload', async (req, res) => {
  const { fileName, fileContent } = req.body;

  if (!fileName || !fileContent) {
    return res.status(400).json({ error: 'Missing fileName or fileContent' });
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileContent, 'base64'),
      ContentEncoding: 'base64',
    });
    await s3Client.send(command);
    res.json({ success: 'File uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file: ' + err.message });
  }
});

app.get('/list', async (req, res) => {
  try {
    const command = new ListObjectsCommand({ Bucket: BUCKET_NAME });
    const data = await s3Client.send(command);
    res.json(data.Contents);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list objects: ' + err.message });
  }
});

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

// const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
// const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');
// const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
// const bodyParser = require('body-parser');
// const express = require('express');
// const multer = require('multer');

// // Initialize DynamoDB client
// const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
// const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// const s3Client = new S3Client({ region: process.env.TABLE_REGION });
// const BUCKET_NAME = 's3-book-images';  

// const tableName = process.env.TABLE_NAME || "booksTable";

// // Declare a new express app
// const app = express();
// app.use(bodyParser.json());
// app.use(awsServerlessExpressMiddleware.eventContext());

// // Setup multer for file upload
// const upload = multer();

// // Enable CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

//   // Response to OPTIONS requests
//   if (req.method === 'OPTIONS') {
//     return res.status(204).end();
//   }

//   next();
// });

// // DynamoDB Routes
// app.get('/books', async (req, res) => {
//   const params = {
//     TableName: tableName,
//     Select: 'ALL_ATTRIBUTES',
//   };

//   try {
//     const data = await ddbDocClient.send(new ScanCommand(params));
//     res.json(data.Items);
//   } catch (err) {
//     res.status(500).json({ error: 'Could not load items: ' + err.message });
//   }
// });

// app.get('/books/:id', async (req, res) => {
//   const params = {
//     TableName: tableName,
//     Key: {
//       id: req.params.id
//     }
//   };

//   try {
//     const data = await ddbDocClient.send(new GetCommand(params));
//     res.json(data.Item || {});
//   } catch (err) {
//     res.status(500).json({ error: 'Could not load item: ' + err.message });
//   }
// });

// app.post('/books', async (req, res) => {
//   const newBook = req.body;

//   // Validate and generate an ID if not provided
//   if (!newBook.id) {
//     newBook.id = String(Date.now());
//   }

//   const params = {
//     TableName: tableName,
//     Item: newBook
//   };

//   try {
//     // Log the data being sent to DynamoDB
//     console.log('Adding book to DynamoDB:', newBook);

//     // Add the book to DynamoDB
//     await ddbDocClient.send(new PutCommand(params));

//     // Fetch the item back from DynamoDB to ensure it was stored correctly
//     const getItemParams = {
//       TableName: tableName,
//       Key: { id: newBook.id }
//     };
//     const result = await ddbDocClient.send(new GetCommand(getItemParams));

//     // Log the retrieved item
//     console.log('Retrieved book from DynamoDB:', result.Item);

//     // Return the complete book data in the response
//     res.json({ success: 'Book added successfully!', data: result.Item });
//   } catch (err) {
//     res.status(500).json({ error: 'Could not add book: ' + err.message });
//   }
// });

// app.put('/books/:id', async (req, res) => {
//   const params = {
//     TableName: tableName,
//     Item: {
//       id: req.params.id,
//       ...req.body
//     }
//   };

//   try {
//     await ddbDocClient.send(new PutCommand(params));
//     res.json({ success: 'Item created/updated successfully!', data: params.Item });
//   } catch (err) {
//     res.status(500).json({ error: 'Could not create/update item: ' + err.message });
//   }
// });

// app.delete('/books/:id', async (req, res) => {
//   const params = {
//     TableName: tableName,
//     Key: {
//       id: req.params.id
//     }
//   };

//   try {
//     await ddbDocClient.send(new DeleteCommand(params));
//     res.json({ success: 'Item deleted successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: 'Could not delete item: ' + err.message });
//   }
// });

// // S3 Routes
// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   try {
//     const uploadParams = {
//       Bucket: BUCKET_NAME,
//       Key: req.file.originalname,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype
//     };

//     await s3Client.send(new PutObjectCommand(uploadParams));
//     const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.TABLE_REGION}.amazonaws.com/${req.file.originalname}`;
//     res.json({ url: fileUrl });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to upload file: ' + err.message });
//   }
// });

// app.get('/list', async (req, res) => {
//   try {
//     const command = new ListObjectsCommand({ Bucket: BUCKET_NAME });
//     const data = await s3Client.send(command);
//     res.json(data.Contents);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to list objects: ' + err.message });
//   }
// });

// app.get('/download/:fileName', async (req, res) => {
//   const fileName = req.params.fileName;

//   try {
//     const command = new GetObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: fileName,
//     });
//     const data = await s3Client.send(command);
//     res.setHeader('Content-Type', data.ContentType);
//     data.Body.pipe(res);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to download file: ' + err.message });
//   }
// });

// app.delete('/delete/:fileName', async (req, res) => {
//   const fileName = req.params.fileName;

//   try {
//     const command = new DeleteObjectCommand({
//       Bucket: BUCKET_NAME,
//       Key: fileName,
//     });
//     await s3Client.send(command);
//     res.json({ success: 'File deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete file: ' + err.message });
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log("App started on port 3000");
// });

// // Export the app object
// module.exports = app;
