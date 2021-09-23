import express, { Request, Response } from "express";
import bcrypt from 'bcrypt';

import { adduser, alltasks, changename, deletetask, deletetheory, giveassignment, inserttask, inserttheory, prune, pruneappt, students, updatetask, updatetheory } from "./sql";
import { role } from "./auth";
import { doneWrapper, statsWrapper } from "./util";

const teacher = express.Router();

teacher.use((req: Request, res: Response, next: express.NextFunction) => {
	console.log("teacher");
	role(req, res)
		.then(result => {
			if (result.rows.length === 0) {
				if (result.rows[0].role === 0)
					next();
				else 
					res.status(401).send('Unauthorized');
			}
			else {
				res.status(401).send('Unauthorized');
			}
		})
		.catch(err => res.status(500).send(console.log(err)));
})


// student methods
teacher.patch('/students/:id', (req: Request, res: Response) => {
	const name: string = req.body.name;
	const id: number = parseInt(req.params.id);

	if (name && id)
		changename(name, id)	
			.then(result => res.status(200).send({ id: result.rows[0].id }))
			.catch(err => res.status(500).send(err));
	else 
		res.status(400).send('Bad request');
})

teacher.post('/students', (req: Request, res: Response) => {
	const name: string = req.body.name;
	
	if (name)
		bcrypt.hash('', 10)
			.then(hash => 
				adduser(name, hash)
					.then(result => res.status(200).json( {id: result.rows[0].id} ))
					.catch(err => res.status(500).send(err)))
	else 
		res.status(400).send('Bad request');
})

teacher.delete('/students/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	if (id)
		prune(id)
			.then(_ => pruneappt(id)
				.then(result => res.status(200).json({id: console.log(result)}))
				.catch(err => res.status(500).send(console.log(err))))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
		
})

teacher.get('/students', (req: Request, res: Response) => {
	students()
		.then(result => res.status(200).json(result.rows.map(elem => ({
			studentID: elem.id,
			studentName: elem.names
		}))))
})

teacher.get('/students/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	if (id)
		statsWrapper(id)
			.then(result => res.status(200).json(result))
			.catch(err => console.log(err));
	else
		res.status(400).send('Bad request');
})

teacher.get('/students/:id/done', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	if (id)
		doneWrapper(id)
			.then(result => res.status(200).json(result))
			.catch(err => console.log(err));
	else
		res.status(400).send('Bad request');
})

// theories

teacher.post('/theories', (req: Request, res: Response) => {
	const title: string = req.body.title;
	const body: string = req.body.body;

	if (body && title)
		inserttheory(title, body)
			.then(result => res.status(200).json( {theoryid: result.rows[0].theoryid}))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
})

teacher.patch('/theories/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	const title: string = req.body.title;
	const body: string = req.body.body;

	if (body && title)
		updatetheory(title, body, id)
			.then(result => res.status(200).json( {theoryid: result.rows[0].theoryid}))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
})

teacher.delete('/theories/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	if (id)
		deletetheory(id)
			.then(result => res.status(200).json( {theoryid: result.rows[0].theoryid}))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
})

// tasks

teacher.get('/tasks', (req: Request, res: Response) => {
	alltasks()
		.then(result => res.status(200).json(result.rows))
		.catch(err => res.send(500).send(console.log(err)));
})

teacher.post('/tasks', (req: Request, res: Response) => {
	const isOpen: boolean = req.body.isOpen;
	const diff: number = parseInt(req.body.diff);
	const question: string = req.body.title;
	const correct: string = req.body.body;

	if (isOpen && diff && question && correct)
		inserttask(isOpen, diff, question, correct)
			.then(result => res.status(200).json( {theoryid: result.rows[0].taskid}))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
})

teacher.patch('/theories/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	const isOpen: boolean = req.body.isOpen;
	const diff: number = parseInt(req.body.diff);
	const question: string = req.body.title;
	const correct: string = req.body.body;

	if (isOpen && diff && question && correct)
		updatetask(isOpen, diff, question, correct, id)
			.then(result => res.status(200).json( {theoryid: result.rows[0].taskid}))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
})

teacher.delete('/theories/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	if (id)
		deletetask(id)
			.then(result => res.status(200).json( {theoryid: result.rows[0].taskid}))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
})

// assignments

teacher.post('/assignment', (req: Request, res: Response) => {
	const theoryid: number = parseInt(req.body.theoryid);
	const taskids: Array<number> = req.body.taskids.map((elem: string) => parseInt(elem));
	const studentids: Array<number> = req.body.studentids.map((elem: string) => parseInt(elem));

	if (theoryid && Array.isArray(taskids) && Array.isArray(studentids))
		giveassignment(theoryid, taskids, studentids)
			.then(result => res.status(200).json({ test: result.rows}))
			.catch(err => res.status(500).send(console.log(err)));
	else 
		res.status(400).send('Bad request');
})

export default teacher;