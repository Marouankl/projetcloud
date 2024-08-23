# Créer un User Pool Cognito
resource "aws_cognito_user_pool" "user_pool" {
  name = var.cognito_user_pool_name

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  auto_verified_attributes = ["email"]

  mfa_configuration = "OPTIONAL"
  email_verification_message = "Your verification code is {####}."
  email_verification_subject  = "Verify your email"
  sms_verification_message = "Your verification code is {####}."

  username_attributes = ["email"]

  lambda_config {
    post_confirmation = aws_lambda_function.my_lambda.arn
  }
}

# Créer un Client User Pool Cognito
resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                = var.cognito_user_pool_client_name
  user_pool_id        = aws_cognito_user_pool.user_pool.id
  generate_secret     = false
  explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
}

