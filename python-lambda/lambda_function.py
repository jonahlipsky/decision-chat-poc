from package import boto3
import json 

def lambda_handler(event, context):
  if 'text' in event:
    return { "body": "Hello World" }
  else:
      print(f"event: {event}")
      print(f"context: {context}")
  
  s3 = boto3.client('s3')
  s3_response = s3.get_object(Bucket='decisionchat', Key='initial.json')
  prompt_json = json.loads(s3_response['Body'].read())
  full_prompt = assemble_prompt(prompt_json)
  bedrock_runtime = boto3.client('bedrock-runtime')
  body = haiku_input_body(full_prompt)
  # print_models()
  model_id = "anthropic.claude-3-haiku-20240307-v1:0"
  response = bedrock_runtime.invoke_model(modelId=model_id, body=json.dumps(body))
  result = json.loads(response.get("body").read())
  # print_output(result)
  return result

def print_anthropic_models(available_models):
  for output in available_models['modelSummaries']:
    if 'anthropic' in output['modelArn']:
      print(output)

def haiku_input_body(prompt):
  return {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 4096,
    "messages": [
      {
          "role": "user",
          "content": [{"type": "text", "text": prompt}],
      }
    ],
  }

def assemble_prompt(prompt_json):
  first_part = 'promptPartOne'
  text = 'text'
  second_part = 'promptPartTwo'
  result = prompt_json[first_part] + prompt_json[text] + prompt_json[second_part]
  return result

def print_output(result):
  input_tokens = result["usage"]["input_tokens"]
  output_tokens = result["usage"]["output_tokens"]
  output_list = result.get("content", [])

  print("Invocation details:")
  print(f"- The input length is {input_tokens} tokens.")
  print(f"- The output length is {output_tokens} tokens.")

  print(f"- The model returned {len(output_list)} response(s):")
  for output in output_list:
      print(output["text"])

def print_models():
  bedrock = boto3.client('bedrock')
  available_models = bedrock.list_foundation_models()
  print_anthropic_models(available_models)

if __name__ == '__main__':
  file = open('../initial.json')
  prompt_json = json.load(file)
  full_prompt = assemble_prompt(prompt_json)
  bedrock_runtime = boto3.client('bedrock-runtime')
  body = haiku_input_body(full_prompt)
  # print_models()
  model_id = "anthropic.claude-3-haiku-20240307-v1:0"
  response = bedrock_runtime.invoke_model(modelId=model_id, body=json.dumps(body))
  result = json.loads(response.get("body").read())
  print_output(result)

  # for event in response.get("body"):
  #   chunk = json.loads(event["chunk"]["bytes"])["completion"]
  #   print(chunk)
