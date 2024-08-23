# Déclaration de la fonction Lambda unique
resource "aws_lambda_function" "my_lambda" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_role.arn
  handler       = var.lambda_handler
  runtime       = var.lambda_runtime
  filename       = "lamda/lamda.zip"

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.books_table.name
      BUCKET_NAME = aws_s3_bucket.book_images.bucket
      SNS_TOPIC_ARN = aws_sns_topic.user_signup.arn
    }
  }

  memory_size = 128
  timeout     = 30
}

# Autoriser Cognito à invoquer la fonction Lambda
resource "aws_lambda_permission" "cognito_permission" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.user_pool.arn
}