import express, { Request, Response } from "express";
import { gettask, gettheory, alltheories } from './sql';
import { role } from "./auth"

const student = express.Router();

student.use((req: Request, res: Response, next: express.NextFunction) => {
	console.log("student");
	role(req, res)
		.then(result => {
			if (result.rows[0].role === 0 || result.rows[0].role === 1)
				next();
			else 
				res.status(401).send('Unauthorized')
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

export default student;