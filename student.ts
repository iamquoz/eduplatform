import { Request, Response } from "express";
import { student } from './index'

import { gettask, gettheory, alltheories } from './sql';

student.get('/theory', (req: Request, res: Response) => {
	alltheories()
		.then(result => res.status(200).json(result.rows))
		.catch(err => res.status(500).send(console.log(err)));
})

student.get('/theory/:id', (req: Request, res: Response) => {
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

student.get('/task/:id', (req: Request, res: Response) => {
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