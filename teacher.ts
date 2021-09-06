import { Request, Response } from "express";
import { student, teacher } from './index'
import { adduser, changename, prune, pruneappt, students } from "./sql";

teacher.post('/rename/:id', (req: Request, res: Response) => {
	const name: string = req.body.name;
	const id: number = parseInt(req.params.id);

	if (name && id)
		changename(name, id)	
			.then(result => res.status(200).send(result))
			.catch(err => res.status(500).send(err));
	else 
		res.status(400).send('Bad request');
})

teacher.post('/addstudent', (req: Request, res: Response) => {
	const name: string = req.body.name;
	
	if (name)
		adduser(name)	
			.then(result => res.status(200).send(result))
			.catch(err => res.status(500).send(err));
	else 
		res.status(400).send('Bad request');
})

teacher.post('/deletestudent/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);

	if (id)
		prune(id)
			.then(_ => pruneappt(id)
				.then(result => res.status(200).json({id: id}))
				.catch(err => res.send(500).send(console.log(err))))
			.catch(err => res.send(500).send(console.log(err)));
		
})

teacher.get('/students', (req: Request, res: Response) => {
	students()
		.then(result => res.status(200).json(result.rows.map(elem => ({
			StudentID: elem.id,
			StName: elem.name
		}))))
})