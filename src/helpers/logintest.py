import json

data = []

for i in range(20): 
	data.append({
		'id': str(i + 1),
		'pass': str(i + 1)
	})

with open('logins.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)
