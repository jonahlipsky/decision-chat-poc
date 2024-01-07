variable "initial_chat_lambda_zipfile_path" {
  description = "Name of zipped lambda file for initial chat"
  type = string
  default = "../go-lambda-chat/lambda-poc/chatPocFunction-v0.0.5.zip"
}

variable "lambda_bedrock_dev_role_arn" {
  description = "Role to assume for Lambdas invoking Bedrock"
  type = string
  default = "arn:aws:iam::442848236251:role/chat-bedrock-poc"
}

variable "lambda_bedrock_timeout" {
  description = "How long before timeout for Bedrock invocations"
  type = number
  default = 60
}