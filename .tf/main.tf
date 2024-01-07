# Thanks https://spacelift.io/blog/terraform-api-gateway
# and https://dev.to/esenac/deploy-an-aws-lambda-function-in-go-with-terraform-12ap
# https://medium.com/onfido-tech/aws-api-gateway-with-terraform-7a2bebe8b68f

### CORE API ###

resource "aws_api_gateway_rest_api" "chat_poc_api" {
  name = "chat-poc-api-terraform"
  description = "The API for the Chat POC Lambda"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "root" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  parent_id = aws_api_gateway_rest_api.chat_poc_api.root_resource_id
  path_part = "initialchat"
}

### DEPLOYMENT ###

resource "aws_api_gateway_deployment" "initial_chat_api" {
  depends_on = [
    aws_api_gateway_integration.lambda_integration,
    aws_api_gateway_integration.options_integration, # Add this line
  ]

  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
}

resource "aws_api_gateway_stage" "development" {
  deployment_id = aws_api_gateway_deployment.initial_chat_api.id
  rest_api_id   = aws_api_gateway_rest_api.chat_poc_api.id
  stage_name    = "development"
}

### USAGE ###

resource "aws_api_gateway_usage_plan" "chat" {
  name         = "decision-chat-usage-plan"
  description  = "The usage plan for the decision chat API"

  api_stages {
    api_id = aws_api_gateway_rest_api.chat_poc_api.id
    stage  = aws_api_gateway_stage.development.stage_name
  }

  quota_settings {
    limit  = 100
    period = "DAY"
  }

  throttle_settings {
    burst_limit = 5
    rate_limit  = 10
  }
}

### AUTHENTICATION ###

resource "aws_api_gateway_api_key" "local_dev" {
  name = "local_dev_key"
}

resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = aws_api_gateway_api_key.local_dev.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.chat.id
}

### POST ###

resource "aws_api_gateway_method" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = "POST"
  authorization = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.initial_chat_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.proxy.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_integration_response" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.proxy.http_method
  status_code = aws_api_gateway_method_response.proxy.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" =  "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'*'",
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_method.proxy,
    aws_api_gateway_integration.lambda_integration
  ]
}

### OPTIONS ###

resource "aws_api_gateway_method" "options" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.options.http_method
  integration_http_method = "OPTIONS"
  type = "MOCK"
}

resource "aws_api_gateway_method_response" "options_response" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.chat_poc_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" =  "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'*'",
    "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }

  depends_on = [
    aws_api_gateway_method.options,
    aws_api_gateway_integration.options_integration
  ]
}

### LAMBDA ###

resource "aws_lambda_function" "initial_chat_lambda" {
  filename = var.initial_chat_lambda_zipfile_path
  function_name = "initialChat"
  role = var.lambda_bedrock_dev_role_arn
  handler = "bootstrap"
  runtime = "provided.al2023"
  timeout = var.lambda_bedrock_timeout
}