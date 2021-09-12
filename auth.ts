import bcrypt from 'bcrypt'
import { Request, Response } from "express";
import { QueryResult } from 'pg';
import { user } from './interfaces';
import { usercred, changepw, check, signup } from "./sql";

const saltRounds = 10;

function login(req: Request, res: Response) {
	const username: number = parseInt(req.body.login);
	const password: string = req.body.password;

	if (username)
		usercred(username)
			.then(result => {
				bcrypt.compare(password, result.rows[0].hash)
					.then(bool => bool 
						? res.status(200).cookie('user', username, { httpOnly: true, signed: true })
						  .json({ message: 'Success' })
						: res.status(401).json({ message: 'Wrong password' }))
					.catch(err => res.status(500).json(err));
			})
			.catch(_ => res.status(404).json({ message: 'Account doesn`t exist' }));
	
}

function register(req: Request, res: Response) {
	const username: number = parseInt(req.signedCookies.name);
	const password: string = req.body.password;

	if (username && password.length !== 0)
		check(username).then(result => {
			if (result.rows.length === 1)
				bcrypt.hash(password, saltRounds)
					.then(hash => {
						signup(username, hash);
							res.status(200).json({ message: 'Success'});
					})
					.catch(err => res.status(500).json(err))
							
			else 
				res.status(403).json({ message: 'User not invited' });
		})
}

function update(req: Request, res: Response) {
	const username: number = req.signedCookies.user;
	const password: string = req.body.password;

	if (username && password.length !== 0)
		bcrypt.hash(password, saltRounds)
			.then(hash => {
				changepw(username, hash)
				res.status(200).send('Success')
			})
			.catch(err => res.status(500).json(err));		
}

function role(req: Request, res: Response) : Promise<QueryResult<user>> {
	const username: number = req.signedCookies.user;
	return usercred(username);
}

export {login, register, update, role};