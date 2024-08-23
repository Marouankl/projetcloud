variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "lambda_role_name" {
  description = "The name of the IAM role for Lambda"
  type        = string
  default     = "lamdaRole"
}

variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
  default     = "myLambdaFunction"
}

variable "lambda_runtime" {
  description = "The runtime of the Lambda function"
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_handler" {
  description = "The handler of the Lambda function"
  type        = string
  default     = "index.handler"
}

variable "cognito_user_pool_name" {
  description = "The name of the Cognito User Pool"
  type        = string
  default     = "cognitoUser"
}

variable "cognito_user_pool_client_name" {
  description = "The name of the Cognito User Pool Client"
  type        = string
  default     = "cognitoUserPoolClient"
}

variable "api_gateway_name" {
  description = "The name of the API Gateway"
  type        = string
  default     = "apiBooks"
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  type        = string
  default     = "booksTable"
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
  default     = "s3-book-images"
}
