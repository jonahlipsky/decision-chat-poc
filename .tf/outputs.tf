output "deployment_invoke_url" {
  description = "Deployment invoke url"
  value       = aws_api_gateway_deployment.initial_chat_api.invoke_url
}

output "local_dev_key" {
  description = "Local dev API key"
  value = aws_api_gateway_api_key.local_dev.value
  sensitive = true
}