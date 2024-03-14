from package import boto3
import json 

def lambda_handler(event, context):
  pass

if __name__ == '__main__':
  first_part = 'promptPartOne'
  text = 'text'
  second_part = 'promptPartTwo'
  initial_prompt_doc = open('../initial.json')
  prompt_json = json.load(initial_prompt_doc)
  full_prompt = prompt_json[first_part] + prompt_json[text] + prompt_json[second_part]
  print(full_prompt)
