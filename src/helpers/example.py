import json
import string
import random 

data = []

for i in range(15):
	data.append({
		'id': str(i + 1),
		'stat': []
	})
	for j in range(6):
		data[i]['stat'].append({
			'id': str(j + 1),
			'Total': [random.randint(15, 30), random.randint(15, 30), random.randint(15, 30)],
			'Correct': [random.randint(0, 15), random.randint(0, 15), random.randint(0, 15) ],
			'TotalAttempts': random.randint(0, 15)
		})

with open('stats.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)