import json
if __name__ == '__main__':
  f = open('initial.json')
  js = json.load(f)
  print(js)
  