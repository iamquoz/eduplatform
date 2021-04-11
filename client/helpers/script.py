import json
import string
import random 

data = {}

data['tasks'] = []

for j in range(30):
    data['tasks'].append({
		'text': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
    'difficulty': ''.join(random.choices(['1', '2', '3', '4'], k = 1)),
    'isOpen': random.choice([True, False]),
    'variants': [],
    'answer': '',
    'id': j,
    })
    if data['tasks'][j]['isOpen'] is True:
      for k in range(4):
        data['tasks'][j]['variants'].append(''.join(random.choices(string.ascii_uppercase + string.digits, k=10)))
      data['tasks'][j]['answer'] = ''.join(random.choices(['1', '2', '3', '4'], k = 1))

with open('tasks.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)