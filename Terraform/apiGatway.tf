# Création de l'API Gateway REST
resource "aws_api_gateway_rest_api" "my_api" {
  name        = var.api_gateway_name
  description = "API for managing books"
}

# Création de la ressource 'books'
resource "aws_api_gateway_resource" "api_resource" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
  path_part   = "books"
}

# Création de la ressource 'books/{id}'
resource "aws_api_gateway_resource" "api_resource_by_id" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  parent_id   = aws_api_gateway_resource.api_resource.id
  path_part   = "{id}"
}

# Méthode ANY pour la ressource 'books'
resource "aws_api_gateway_method" "api_method_any_books" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

# Intégration Lambda pour la méthode ANY sur '/books'
resource "aws_api_gateway_integration" "api_integration_any_books" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.api_resource.id
  http_method             = aws_api_gateway_method.api_method_any_books.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.my_lambda.arn}/invocations"
}

# Méthode GET pour la ressource '/books/{id}'
resource "aws_api_gateway_method" "api_method_get_by_id" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.api_resource_by_id.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.id" = true
  }
}

# Intégration Lambda pour la méthode GET sur '/books/{id}'
resource "aws_api_gateway_integration" "api_integration_get_by_id" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.api_resource_by_id.id
  http_method             = aws_api_gateway_method.api_method_get_by_id.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${aws_lambda_function.my_lambda.arn}/invocations"
}

# Méthode OPTIONS pour la ressource 'books' (CORS)
resource "aws_api_gateway_method" "api_options_books" {
  rest_api_id   = aws_api_gateway_rest_api.my_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# Intégration MOCK pour la méthode OPTIONS sur '/books' (CORS)
resource "aws_api_gateway_integration" "api_options_integration_books" {
  rest_api_id             = aws_api_gateway_rest_api.my_api.id
  resource_id             = aws_api_gateway_resource.api_resource.id
  http_method             = aws_api_gateway_method.api_options_books.http_method
  type                    = "MOCK"
}

# Réponse de la méthode OPTIONS pour '/books'
resource "aws_api_gateway_method_response" "api_options_method_response_books" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = aws_api_gateway_method.api_options_books.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
  }
}

# Réponse d'intégration pour la méthode OPTIONS sur '/books'
resource "aws_api_gateway_integration_response" "api_options_integration_response_books" {
  depends_on = [
    aws_api_gateway_integration.api_options_integration_books
  ]
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = aws_api_gateway_method.api_options_books.http_method
  status_code = aws_api_gateway_method_response.api_options_method_response_books.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
  }
}

# Déploiement de l'API
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.api_integration_any_books,
    aws_api_gateway_integration.api_integration_get_by_id,
    aws_api_gateway_integration.api_options_integration_books
  ]
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  stage_name  = "prod"
}

# Permission Lambda pour permettre à API Gateway d'invoquer la fonction
resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.my_api.execution_arn}/*/*"
}