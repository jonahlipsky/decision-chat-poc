# Thanks https://spacelift.io/blog/terraform-api-gateway

resource "aws_api_gateway_rest_api" "chat_poc_api" {
  name = "chat-poc-api-terraform"
  description = "The API for the Chat POC Lambda"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "chat_poc_api_root" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  parent_id = aws_api_gateway_rest_api.chat_poc_api.root_resource_id
  path_part = "initial_chat"
}

### POST ###

resource "aws_api_gateway_method" "chat_poc_api_post" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.chat_poc_api_root.id
  http_method = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.chat_poc_api_root.id
  http_method = aws_api_gateway_method.chat_poc_api_post.http_method
  integration_http_method = "POST"
  type = "MOCK"
}

resource "aws_api_gateway_method_response" "chat_poc_api_post" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.chat_poc_api_root.id
  http_method = aws_api_gateway_method.chat_poc_api_post.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "chat_poc_api_post" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.chat_poc_api_root.id
  http_method = aws_api_gateway_method.chat_poc_api_post.http_method
  status_code = aws_api_gateway_method_response.chat_poc_api_post.status_code

  depends_on = [
    aws_api_gateway_method.chat_poc_api_post,
    aws_api_gateway_integration.lambda_integration
  ]
}

### OPTIONS ###
resource "aws_api_gateway_method" "chat_poc_api_options" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.chat_poc_api_root.id
  http_method = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.chat_poc_api_root.id
  http_method = aws_api_gateway_method.chat_poc_api_options.http_method
  integration_http_method = "OPTIONS"
  type = "MOCK"
}

### DEPLOYMENT ###

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda_integration,
    aws_api_gateway_integration.options_integration, # Add this line
  ]

  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  stage_name = "dev"
}