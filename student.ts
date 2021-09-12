import express, { Request, Response } from "express";
import { gettask, gettheory, alltheories, takeassignment, answeropen, checktries, closedcorrect, closedincorrect } from './sql';
import { role } from "./auth"
import { task } from "./interfaces";

const student = express.Router();

student.use((req: Request, res: Response, next: express.NextFunction) => {
	console.log("student");
	role(req, res)
		.then(result => {
			if (result.rows.length === 0) {
				if (result.rows[0].role === 0 || result.rows[0].role === 1)
					next();
				else 
					res.status(401).send('Unauthorized');
			}
			else {
				res.status(401).send('Unauthorized');
			}
		})
		.catch(_ => res.status(401).send('Unauthorized'));
})

student.get('/theories', (req: Request, res: Response) => {
	alltheories()
		.then(result => res.status(200).json(result.rows))
		.catch(err => res.status(500).send(console.log(err)));
})

student.get('/theories/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	gettheory(id)
		.then(result =>  {
			if (result.rows.length === 0)
				res.status(404).json({ message: 'Not Found'});
			else 
				res.status(200).json(result.rows[0]);
		})
		.catch(err => res.status(500).send(console.log(err)));
})

student.get('/tasks/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	gettask(id)
		.then(result => {
			if (result.rows.length === 0)
				res.status(404).json({ message: 'Not found' });
			else {
				res.status(200).json({...result.rows[0], correct: ''});
			}
		})
})

student.get('/assignment', (req: Request, res: Response) => {
	const id: number = parseInt(req.signedCookies.name);

	takeassignment(id)
		.then(result => res.status(200).send(result.rows))
		.catch(err => res.status(500).send(console.log(err)));
})

student.post('/assignment', (req: Request, res: Response) => {
	const id: number = parseInt(req.signedCookies.name);
	const task: task = req.body.task;
	const theoryid: number = parseInt(req.body.theoryid);

	if (task && theoryid) {
		if (task.isOpen)
			answeropen(id, task.taskid, theoryid, task.correct)
				.then(result => res.status(200).json({ message: 'Success' }))
				.catch(err => res.status(500).send(console.log(err)));
		else 
			checktries(id, task.taskid, theoryid)
				.then(result => {
					if (result.rows[0].tries !== 3)
						gettask(task.taskid)
							.then(result => {
								if (result.rows[0].correct === task.correct)
									closedcorrect(id, task.taskid, theoryid, task.correct)
										.then(_ => res.status(200).json({ tries: -2}))
								else
									closedincorrect(id, task.taskid, theoryid, task.correct)
										.then(r => res.status(200).json({ tries: r.rows[0].tries} ))
							})
			})
	}
	else 
		res.status(400).send('Bad request');
	
})

export default student;