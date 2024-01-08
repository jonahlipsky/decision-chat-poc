# variable "initial_chat_lambda_zipfile_path" {
#   description = "Name of zipped lambda file for initial chat"
#   type = string
#   default = "../go-lambda-chat/lambda-poc/chatPocFunction-v0.0.5.zip"
# }

# variable "lambda_bedrock_dev_role_arn" {
#   description = "Role to assume for Lambdas invoking Bedrock"
#   type = string
#   default = "arn:aws:iam::442848236251:role/chat-bedrock-poc"
# }

# variable "lambda_bedrock_timeout" {
#   description = "How long before timeout for Bedrock invocations"
#   type = number
#   default = 60
# }

variable "lambda_function_name" {
  description = "Name of lambda function"
  type = string
  default = "chatPocFunction"
}

variable "initial_chat_lambda_invoke_arn" {
  description = "ARN for lambda to invoke"
  type = string
  default = "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:442848236251:function:chatPocFunction/invocations"
}