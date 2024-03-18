from package import boto3
import json 

def lambda_handler(api_gateway_event, context):
  event = json.loads(api_gateway_event['body'])
  response = build_success_response()

  if event['conversationStatus'] == 'beginDecisionConversation':
    full_prompt = 'Your role is to give me feedback about a decision I am trying to make.'
    messages = [user_message(full_prompt)]
    model_input = haiku_input_body(messages)
  else:
    initial_prompt = get_initial_prompt()
    full_prompt = initial_prompt + event['conversation']

  bedrock_runtime = boto3.client('bedrock-runtime')
  # print_models()
  model_id = "anthropic.claude-3-haiku-20240307-v1:0"
  response = bedrock_runtime.invoke_model(
    modelId=model_id, 
    body=json.dumps(model_input),
  )
  result = json.loads(response.get("body").read())
  messages.append(result)
  
  response['body'] = json.dumps({
    'conversationStatus': 'continueDecisionConversation',
    'conversation': messages
  })
  print(response)
  return response

def get_initial_prompt():
  s3 = boto3.client('s3')
  s3_response = s3.get_object(Bucket='decisionchat', Key='initial.json')
  prompt_json = json.loads(s3_response['Body'].read())
  full_prompt = assemble_prompt(prompt_json)
  return full_prompt

def print_anthropic_models(available_models):
  for output in available_models['modelSummaries']:
    if 'anthropic' in output['modelArn']:
      print(output)

def user_message(prompt):
  return {
    "role": "user",
    "content": [{"type": "text", "text": prompt}],
  }

def haiku_input_body(messages):
  return {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 4096,
    "messages": messages,
  }

def build_success_response():
  return { 
    'statusCode': 200,  
    'isBase64Encoded': False,
    'headers': { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, 
    'multiValueHeaders': {},
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
