from package import boto3
import json 

def lambda_handler(event, context):
  s3 = boto3.client('s3')
  s3_response = s3.get_object(Bucket='decisionchat', Key='initial.json')
  prompt_json = json.loads(s3_response['Body'].read())

if __name__ == '__main__':
  first_part = 'promptPartOne'
  text = 'text'
  second_part = 'promptPartTwo'
  content_type = 'application/json'
  file = open('../initial.json')
  prompt_json = json.load(file)
  full_prompt = prompt_json[first_part] + prompt_json[text] + prompt_json[second_part]
  bedrock = boto3.client('bedrock-runtime')
  body = {
    "prompt": full_prompt,
    "max_tokens_to_sample": 4000,
    "temperature": 0.1,
    "stop_sequences": ["\n\nHuman:"],
  }
  model_id = "anthropic.claude-v2"
  response = bedrock.invoke_model_with_response_stream(modelId=model_id, body=json.dumps(body))
  for event in response.get("body"):
    chunk = json.loads(event["chunk"]["bytes"])["completion"]
    print(chunk)
