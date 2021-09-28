import { Pool, QueryResult } from "pg";
import { user, task, theory, assignment, statReq, doneReq } from "./interfaces";

require('dotenv').config();
var parse = require('pg-connection-string').parse;

var config = parse(process.env.DATABASE_URL);
config.ssl = { rejectUnauthorized: false };

var pool = new Pool(config);
// user methods


/**
 * SELECT *
 * FROM logins
 * WHERE id = id
 * @param id id of the user we want to check
 * @returns user value
 */
function usercred(id: number) : Promise<QueryResult<user>> {
	return pool.query('SELECT * FROM logins WHERE id = $1', [id]);
}
/**
 * INSERT INTO logins(names, role, hash)
 * VALUES (username, 1, hash)
 * RETURNING *
 * @param username name of the user we add
 * @param hash bcrypt of empty string
 * @returns user value
 */
function adduser(username: string, hash: string) : Promise<QueryResult<user>>  {
	return pool.query('INSERT INTO logins(names, role, hash) VALUES ($1, 1, $2) RETURNING *', [username, hash]);
}

/**
 * UPDATE logins 
 * SET hash = hash
 * WHERE id = id
 * @param id id of the user we sign up
 * @param hash their new password
 * @returns user value
 */
function signup(id: number, hash: string) : Promise<QueryResult<user>> {
	return pool.query('UPDATE logins SET hash = $2 WHERE id = $1 RETURNING *', [id, hash]);
}

function changepw(id: number, hash: string) : Promise<QueryResult<user>> {
	return pool.query('UPDATE logins SET hash = $2 WHERE id = $1 RETURNING *', [id, hash]);
}
/**
 * UPDATE logins
 * SET names = username
 * WHERE id = id
 * RETURNING *
 * @param username new name
 * @param id their id 
 * @returns user value
 */
function changename(username: string, id: number) : Promise<QueryResult<user>> {
	return pool.query('UPDATE logins SET names = $2 WHERE id = $1 RETURNING *', [id, username]);
}

/**
 * SELECT 1 
 * FROM logins
 * WHERE id = id
 * LIMIT 1
 * @param id id of a user who's role we check
 * @returns user value
 */
function check(id: number) : Promise<QueryResult<user>> {
	return pool.query('SELECT 1 FROM logins WHERE id = $1 LIMIT 1', [id]);
}

/**
 * DELETE * 
 * FROM logins
 * WHERE id = id
 * RETURNING *
 * @param id id of a user we delete
 * @returns user id
 */
function prune(id: number) : Promise<QueryResult<user>> {
	return pool.query('DELETE FROM logins WHERE id = $1 RETURNING *', [id]);
}
/**
 * DELETE * 
 * FROM appointments
 * WHERE sid = id
 * @param id id of a user we delete
 */
function pruneappt(id: number) : Promise<QueryResult> {
	return pool.query('DELETE FROM assignments WHERE sid = $1', [id]);
}

export {usercred, adduser, signup, changepw, changename, check, prune, pruneappt};

// task and theory methods
/**
 * SELECT *
 * FROM tasks
 * WHERE taskid = id
 * @param id id of the task we delete
 * @returns task value
 */
function gettask(id: number) : Promise<QueryResult<task>> {
	return pool.query('SELECT * FROM tasks WHERE taskid = $1', [id]);	
}

/**
 * SELECT *
 * FROM tasks
 * @returns arr of task values
 */
function alltasks() : Promise<QueryResult<task>> {
	return pool.query('SELECT * FROM tasks');	
}

/**
 * INSERT INTO tasks(isOpen, diff, question, correct)
 * VALUES(isOpen, diff, question, correct) 
 * RETURNING *
 * @param isOpen open or closed question
 * @param diff 1-4 difficulty of a question
 * @param question question text
 * @param correct correct answer (if closed)
 * @returns task value
 */
function inserttask(isOpen: boolean, diff: number, question: string, correct: string) : Promise<QueryResult<task>> {
	return pool.query('INSERT INTO tasks("isOpen", diff, question, correct) VALUES($1, $2, $3, $4) RETURNING *', [isOpen, diff, question, correct]);
}
/**
 * UPDATE tasks 
 * SET isOpen = isOpen, diff = diff, question = question, correct = correct
 * WHERE taskid = id
 * RETURNING *
 * @param isOpen open or closed question
 * @param diff 1-4 difficulty of a question
 * @param question question text
 * @param correct correct answer (if closed)
 * @param id id of the task we edit
 * @returns task value
 */
function updatetask(isOpen: boolean, diff: number, question: string, correct: string, id: number) : Promise<QueryResult<task>> {
	return pool.query('UPDATE tasks SET "isOpen" = $1, diff = $2, question = $3, correct = $4 WHERE taskid = $5 RETURNING *', [isOpen, diff, question, correct, id]);
}

/**
 * DELETE FROM tasks
 * WHERE taskid = id
 * RETURNING *
 * @param id id of the task we delete
 * @returns task value
 */
function deletetask(id: number) : Promise<QueryResult<task>> {
	return pool.query('DELETE FROM tasks WHERE taskid = $1 RETURNING *', [id]);
}

/**
 * SELECT * 
 * FROM theory
 * WHERE theoryid = id
 * @param id id of the theory we get
 * @returns theory value
 */
function gettheory(id: number) : Promise<QueryResult<theory>> {
	return pool.query('SELECT * FROM theory WHERE theoryid = $1', [id]);	
}

/**
 * SELECT *
 * FROM theory
 * @returns arr of theory values
 */
function alltheories() : Promise<QueryResult<theory>> {
	return pool.query('SELECT * FROM theory');	
}
/**
 * INSERT INTO theory(title, body)
 * VALUES (title, body)
 * RETURNING *
 * @param title header of theory
 * @param body main text of theory
 * @returns 
 */
function inserttheory(title: string, body: string) : Promise<QueryResult<theory>> {
	return pool.query('INSERT INTO theory(title, body) VALUES ($1, $2) RETURNING *', [title, body]);
}
/**
 * UPDATE theory 
 * SET title = title, body = body
 * WHERE theoryid = id
 * RETURNING *
 * @param title header 
 * @param body main text
 * @param id id of the theory we update
 * @returns 
 */
function updatetheory(title: string, body: string, id: number) : Promise<QueryResult<theory>> {
	return pool.query('UPDATE theory SET title = $1, body = $2 WHERE theoryid = $3 RETURNING *', [title, body, id]);
}
/**
 * DELETE FROM tasks
 * WHERE taskid = id
 * RETURNING *
 * @param id id of the task we delete
 * @returns task value
 */
function deletetheory(id: number) : Promise<QueryResult<theory>> {
	return pool.query('DELETE FROM theory WHERE theoryid = $1 RETURNING *', [id]);
}

export {gettask, alltasks, inserttask, updatetask, deletetask, gettheory, alltheories, inserttheory, updatetheory, deletetheory};

// student interaction methods 
/**
 * SELECT id, names
 * FROM logins
 * WHERE role = 1
 * @returns arr of user values
 */
function students() : Promise<QueryResult<user>> {
	return pool.query('SELECT id, names FROM logins WHERE role = 1');
}

/**
 * there has to be a better way, i just don't know of it
 * 
 * INSERT INTO assignment(sid, theoryid, taskid)
 * VALUES 'split arr of taskids and studentids'
 * RETURNING *
 * @param theoryid theoryid assigned along tasks
 * @param taskids array of taskids assigned
 * @param studentids array of students to whom this all was assigned
 * @returns assignment value
 */
function giveassignment(theoryid: number, taskids: Array<number>, studentids: Array<number>) : Promise<QueryResult<assignment>> {
	return pool.query(`INSERT INTO assignments(sid, theoryid, taskid) VALUES ` + studentids.map(elem => taskids.map(e => "(" + elem + ", " + theoryid + ", " + e + ")")) + "RETURNING *");
}
/**
 * SELECT theoryid, array_agg(taskid) AS tasks, array_agg(tries) AS tries
 * FROM assignments 
 * WHERE complete = false AND sid = studentid 
 * GROUP BY theoryid
 * @param studentid student who gets the assignment 
 * @returns \{theoryid: number, taskid: [number]}
 */
function takeassignment(studentid: number) : Promise<QueryResult> {
	return pool.query('SELECT theoryid, array_agg(taskid) AS tasks, array_agg(tries) AS tries FROM assignments WHERE complete = false AND sid = $1 GROUP BY theoryid', [studentid]);
}

/**
 * UPDATE assignments 
 * WHERE sid = studentid AND taskid = taskid AND theoryid = theoryid
 * SET usrAnswer = answer, complete = true
 * RETURNING *
 * @param studentid student who's answering 
 * @param taskid task we're answering 
 * @param theoryid on the theory we're studying
 * @param answer user's input
 * @returns assignment value
 */
function answeropen(studentid: number, taskid: number, theoryid: number, answer: string) : Promise<QueryResult<assignment>> {
	return pool.query('UPDATE assignments WHERE sid = $1 AND taskid = $2 AND theoryid = $3 SET usrAnswer = $4, complete = true RETURNING *', [studentid, taskid, theoryid, answer]);
}

/**
 * SELECT tries
 * FROM appointments 
 * WHERE sid = studentid AND taskid = taskid AND theoryid = theoryid 
 * RETURNING *
 * @param studentid student who's trying to answer
 * @param taskid taskid they're answering
 * @param theoryid theoryid they're studying
 * @returns tries 
 */
function checktries(studentid: number, taskid: number, theoryid: number) : Promise<QueryResult<assignment>> {
	return pool.query('SELECT tries FROM appointments WHERE sid = $1 AND taskid = $2 AND theoryid = $3 RETURNING *', [studentid, taskid, theoryid]);
}
/**
 * UPDATE assignments 
 * WHERE sid = studentid AND taskid = taskid AND theoryid = theoryid 
 * SET usrAnswer = answer, complete = true, correct = true, tries = tries + 1 
 * RETURNING *
 * @param studentid student who's answering
 * @param taskid taskid they're answering
 * @param theoryid theoryid they're studying
 * @param answer user's answer
 * @returns assignment value
 */
function closedcorrect(studentid: number, taskid: number, theoryid: number, answer: string) : Promise<QueryResult<assignment>> {
	return pool.query('UPDATE assignments WHERE sid = $1 AND taskid = $2 AND theoryid = $3 SET usrAnswer = $4, complete = true, correct = true, tries = tries + 1 RETURNING *', [studentid, taskid, theoryid, answer]);
}

/**
 * UPDATE assignments 
 * WHERE sid = studentid AND taskid = taskid AND theoryid = theoryid 
 * SET usrAnswer = answer, complete = true, tries = tries + 1 
 * RETURNING *
 * @param studentid student who's answering
 * @param taskid task they're answering
 * @param theoryid theory they're studying
 * @param answer user's answer
 * @returns assignment value
 */
function closedincorrect(studentid: number, taskid: number, theoryid: number, answer: string) : Promise<QueryResult<assignment>> {
	return pool.query('UPDATE assignments WHERE sid = $1 AND taskid = $2 AND theoryid = $3 SET usrAnswer = $4, complete = true, tries = tries + 1 RETURNING *', [studentid, taskid, theoryid, answer]);
}

/**
 * SELECT theoryid, tasks.taskid, assignments.correct, tries, diff, tasks."isOpen" 
 * FROM assignments 
 * JOIN tasks ON tasks.taskid = assignments.taskid AND assignments.complete = true AND assignments.correct IS NOT NULL 
 * WHERE sid = studentid
 * @param studentid student who's stats we're checking
 * @returns statReq value
 */
function stats(studentid: number) : Promise<QueryResult<statReq>> {
	return pool.query('SELECT theoryid, tasks.taskid, assignments.correct, tries, diff, tasks."isOpen" FROM assignments JOIN tasks ON tasks.taskid = assignments.taskid AND assignments.complete = true AND assignments.correct IS NOT NULL WHERE sid = $1', [studentid]);
}

/**
 * SELECT theoryid, tasks.taskid, assignments.correct, tries, comment, "usrAnswer", tasks.question, tasks.diff ,tasks.correct as answer, tasks."isOpen" 
 * FROM assignments 
 * JOIN tasks ON tasks.taskid = assignments.taskid AND assignments.complete = true AND assignments.correct IS NOT NULL 
 * WHERE sid = studentid
 * @param studentid student who's tasks we're checking 
 * @returns 
 */
function done(studentid: number) : Promise <QueryResult<doneReq>> {
	return pool.query('SELECT theoryid, tasks.taskid, assignments.correct, tries, comment, "usrAnswer", tasks.question, tasks.diff ,tasks.correct as answer, tasks."isOpen" FROM assignments JOIN tasks ON tasks.taskid = assignments.taskid AND assignments.complete = true AND assignments.correct IS NOT NULL WHERE sid = $1', [studentid]);
}

export {students, giveassignment, takeassignment, answeropen, checktries, closedcorrect, closedincorrect, stats, done}