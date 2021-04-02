import json
import string
import random 

data = {}

data['students'] = []

for _ in range(30):
    data['students'].append({
		'stName': ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    })

for i in range(30):
	data['students'][i]['id'] = i

with open('data.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)