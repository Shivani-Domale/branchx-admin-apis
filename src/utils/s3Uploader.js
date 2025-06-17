const AWS = require('aws-sdk');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const uploadFileToS3 = async (fileBuffer, originalName, folder = "admin") => {
  const extension = path.extname(originalName);
  const fileName = `${uuidv4()}${extension}`;
  const key = `${folder}/${fileName}`;

  const contentType = mime.lookup(extension);
  if (!contentType) {
    throw new Error('Unsupported file type');
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  };

  await s3.upload(params).promise();

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

const deleteFileFromS3 = async (fileUrl) => {
  const url = new URL(fileUrl);
  const key = decodeURIComponent(url.pathname.slice(1));

  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  await s3.deleteObject(params).promise();
};

module.exports = {
  uploadFileToS3,
  deleteFileFromS3
};
