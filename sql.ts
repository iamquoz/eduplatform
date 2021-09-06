import { Pool, QueryResult } from "pg";
import { user, task, theory } from "./interfaces";

require('dotenv').config();
var parse = require('pg-connection-string').parse;
var pool : Pool;

// local or deployed
try {
	var config = parse(process.env.DATABASE_URL);
	pool = new Pool(config);
} catch (_) {
	pool = new Pool({
		user: 'postgres',
		host: 'localhost',
		database: process.env.dbname,
		password: process.env.pw,
		port: 5432
	})
}

// user methods

function usercred(id: number) : Promise<QueryResult<user>> {
	return pool.query('SELECT * FROM users WHERE id = $1', [id]);
}

function adduser(username: string) : Promise<QueryResult<user>>  {
	return pool.query('INSERT INTO users(names, hash) VALUES ($1, $2) RETURNING *', [username, '']);
}

function signup(id: number, hash : string) : Promise<QueryResult<user>> {
	return pool.query('UPDATE users set hash = $2 WHERE id = $1 RETURNING *', [id, hash]);
}

function changepw(username: string, hash : string) : Promise<QueryResult<user>> {
	return pool.query('UPDATE users SET hash = $2 WHERE names = $1 RETURNING *', [username, hash]);
}

function changename(username: string, id: number) : Promise<QueryResult<user>> {
	return pool.query('UPDATE users SET names = $2 WHERE id = $1 RETURNING *', [id, username]);
}

function check(id: number) : Promise<QueryResult<user>> {
	return pool.query('SELECT 1 FROM users WHERE id = $1 LIMIT 1', [id]);
}

function prune(id: number) : Promise<QueryResult<user>> {
	return pool.query('DELETE * FROM users WHERE id = $1', [id]);
}

function pruneappt(id: number) : Promise<QueryResult<user>> {
	return pool.query('DELETE * FROM appointments WHERE sid = $1', [id]);
}

export {usercred, adduser, signup, changepw, changename, check, prune, pruneappt};

// task and theory methods

function gettask(id: number) : Promise<QueryResult<task>> {
	return pool.query('SELECT * FROM tasks WHERE id = $1', [id]);	
}

function gettheory(id: number) : Promise<QueryResult<theory>> {
	return pool.query('SELECT * FROM theory WHERE id = $1', [id]);	
}

function alltheories() : Promise<QueryResult<theory>> {
	return pool.query('SELECT * FROM theory');	
}


export {gettask, gettheory, alltheories};

// student interaction methods 

function students() : Promise<QueryResult<user>> {
	return pool.query('SELECT id, names FROM users WHERE role = 1')
}

export {students}