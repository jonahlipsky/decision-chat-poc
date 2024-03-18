from package import boto3
import json 

def lambda_handler(api_gateway_event, context):
  event = json.loads(api_gateway_event['body'])

  ### VALIDATIONS ###
  required_keys = ['conversationStatus', 'userMessage', 'conversation']
  optional_keys = ['test', 'model']
  acceptable_keys = set(required_keys + optional_keys)
  bad_keys = []
  for key in event:
    if key not in acceptable_keys:
      bad_keys.append(key)

  lambda_proxy_error_response = build_response(400)
  
  if len(bad_keys):
    lambda_proxy_error_response['body'] = f"The following keys are not permitted: {bad_keys}"
    return lambda_proxy_error_response
  
  if event.get('model') and event['model'] not in set(['haiku', 'sonnet']):
    lambda_proxy_error_response['body'] = f"The model is not allowed: {event['model']}"
    return lambda_proxy_error_response

  missing_keys = []
  for key in required_keys:
    if key not in event:
      missing_keys.append(key)
  
  if len(missing_keys):
    lambda_proxy_error_response['body'] = f"The following keys are required: {missing_keys}"
    return lambda_proxy_error_response
  
  ### CONSTRUCT MODEL INPUT ###
  if event.get('test'):
    initial_prompt = 'Your role is to give me feedback about a decision I am trying to make.'
  else:
    initial_prompt = get_initial_prompt()

  if event['conversationStatus'] == 'beginDecisionConversation':
    conversation_messages = [user_message(initial_prompt)]
  elif event['conversationStatus'] == 'continueDecisionConversation':
    first_user_message = user_message(initial_prompt)
    next_user_message = user_message(event['userMessage'])
    conversation_messages = [first_user_message] + event['conversation'] + [next_user_message]
  
  model_selection = event.get('model')
  if not model_selection:
    model_selection = 'haiku'
  model_id = claude_model_id(model_selection)
  model_input = claude3_input_body(conversation_messages)
  
  ### RUN MODEL INVOCATION ###
  bedrock_runtime = boto3.client('bedrock-runtime')
  runtime_response = bedrock_runtime.invoke_model(
    modelId=model_id, 
    body=json.dumps(model_input),
  )
  bedrock_result = json.loads(runtime_response.get("body").read())

  ## BUILD AND RETURN RESULT ###
  conversation_messages.append(extract_assistant_core_response(bedrock_result))
  lambda_proxy_response = build_response(200)
  lambda_proxy_response['body'] = json.dumps({
    'conversationStatus': 'continueDecisionConversation',
    'conversation': conversation_messages[1:]
  })
  return lambda_proxy_response

######################
### HELPER METHODS ###
######################

def claude_model_id(model):
  match model:
    case 'haiku':
      return 'anthropic.claude-3-haiku-20240307-v1:0'
    case 'sonnet':
      return 'anthropic.claude-3-sonnet-20240229-v1:0'
    
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

def extract_assistant_core_response(bedrock_response):
  return {k: bedrock_response[k] for k in ('role', 'content')}

def user_message(prompt):
  return {
    "role": "user",
    "content": [{"type": "text", "text": prompt}],
  }

def claude3_input_body(messages):
  return {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 4096,
    "messages": messages,
  }

def build_response(response_code):
  return { 
    'statusCode': response_code,  
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

### LOCAL TESTING HELPER METHODS ###

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

### LOCAL TESTING ###
# if __name__ == '__main__':
  # file = open('../initial.json')
  # prompt_json = json.load(file)
  # full_prompt = assemble_prompt(prompt_json)
  # bedrock_runtime = boto3.client('bedrock-runtime')
  # body = claude3_input_body(full_prompt)
  # model_id = "anthropic.claude-3-haiku-20240307-v1:0"
  # response = bedrock_runtime.invoke_model(modelId=model_id, body=json.dumps(body))
  # result = json.loads(response.get("body").read())
  # print_output(result)
  # print_models()
