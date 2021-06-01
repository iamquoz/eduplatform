#!/bin/fish
if test !$dbspawned
	# todo create tables in db
	# set -U dbspawned yes
end
npm install react-scripts
npm run build
go build
