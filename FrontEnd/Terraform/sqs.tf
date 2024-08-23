# Créer une file d'attente SQS
resource "aws_sqs_queue" "user_signup_queue" {
  name = "user-signup-queue"
}

# Autoriser SNS à publier des messages sur la file d'attente SQS
resource "aws_sqs_queue_policy" "sns_sqs_policy" {
  queue_url = aws_sqs_queue.user_signup_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = "*",
        Action = "SQS:SendMessage",
        Resource = aws_sqs_queue.user_signup_queue.arn,
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.user_signup.arn
          }
        }
      }
    ]
  })
}
