# Créer un sujet SNS pour les notifications d'inscription
resource "aws_sns_topic" "user_signup" {
  name = "user-signup-topic"
}

# Créer un abonnement SNS pour envoyer des notifications par e-mail
resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.user_signup.arn
  protocol  = "email"
  endpoint  = "kmarouan5@gmail.com"  
}