import { Pool, QueryResult } from "pg";
import { user, task, theory } from "./interfaces";

require('dotenv').config();
var parse = require('pg-connection-string').parse;

var config = parse(process.env.DATABASE_URL);
config.ssl = { rejectUnauthorized: false };
var pool = new Pool(config);
// user methods

function usercred(id: number) : Promise<QueryResult<user>> {
	return pool.query('SELECT * FROM logins WHERE id = $1', [id]);
}

function adduser(username: string, hash: string) : Promise<QueryResult<user>>  {
	return pool.query('INSERT INTO logins(names, role, hash) VALUES ($1, 1, $2) RETURNING *', [username, hash]);
}

function signup(id: number, hash : string) : Promise<QueryResult<user>> {
	return pool.query('UPDATE logins SET hash = $2 WHERE id = $1 RETURNING *', [id, hash]);
}

function changepw(id: number, hash : string) : Promise<QueryResult<user>> {
	return pool.query('UPDATE logins SET hash = $2 WHERE id = $1 RETURNING *', [id, hash]);
}

function changename(username: string, id: number) : Promise<QueryResult<user>> {
	return pool.query('UPDATE logins SET names = $2 WHERE id = $1 RETURNING *', [id, username]);
}

function check(id: number) : Promise<QueryResult<user>> {
	return pool.query('SELECT 1 FROM logins WHERE id = $1 LIMIT 1', [id]);
}

function prune(id: number) : Promise<QueryResult<user>> {
	return pool.query('DELETE * FROM logins WHERE id = $1', [id]);
}

function pruneappt(id: number) : Promise<QueryResult<user>> {
	return pool.query('DELETE * FROM appointments WHERE sid = $1', [id]);
}

export {usercred, adduser, signup, changepw, changename, check, prune, pruneappt};

// task and theory methods

function gettask(id: number) : Promise<QueryResult<task>> {
	return pool.query('SELECT * FROM tasks WHERE taskid = $1', [id]);	
}

function alltasks() : Promise<QueryResult<task>> {
	return pool.query('SELECT * FROM tasks');	
}

function inserttask(isOpen: boolean, diff: number, question: string, correct: string) : Promise<QueryResult<task>> {
	return pool.query('INSERT INTO tasks(isOpen, diff, question, correct) VALUES($1, $2, $3, $4) RETURNING *', [isOpen, diff, question, correct]);
}

function updatetask(isOpen: boolean, diff: number, question: string, correct: string, id: number) : Promise<QueryResult<task>> {
	return pool.query('UPDATE tasks SET isOpen = $1, diff = $2, question = $3, correct = $4 WHERE taskid = $5 RETURNING *', [isOpen, diff, question, correct, id]);
}

function deletetask(id: number) : Promise<QueryResult<task>> {
	return pool.query('DELETE FROM tasks WHERE taskid = $1 RETURNING', [id]);
}

function gettheory(id: number) : Promise<QueryResult<theory>> {
	return pool.query('SELECT * FROM theory WHERE theoryid = $1', [id]);	
}

function alltheories() : Promise<QueryResult<theory>> {
	return pool.query('SELECT * FROM theory');	
}

function inserttheory(title: string, body: string) : Promise<QueryResult<theory>> {
	return pool.query('INSERT INTO theory(title, body) VALUES ($1, $2) RETURNING *', [title, body]);
}

function updatetheory(title: string, body: string, id: number) : Promise<QueryResult<theory>> {
	return pool.query('UPDATE theory SET title = $1, body = $2 WHERE theoryid = $3 RETURNING *', [title, body, id]);
}

function deletetheory(id: number) : Promise<QueryResult<theory>> {
	return pool.query('DELETE FROM theory WHERE theoryid = $1 RETURNING *', [id]);
}

export {gettask, alltasks, inserttask, updatetask, deletetask, gettheory, alltheories, inserttheory, updatetheory, deletetheory};

// student interaction methods 

function students() : Promise<QueryResult<user>> {
	return pool.query('SELECT id, names FROM logins WHERE role = 1')
}

export {students}