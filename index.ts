import express, {Request, Response } from "express";
import cookieParser from "cookie-parser";

import {login, register, role, update} from "./auth"


const app = express();
const teacher = express.Router();
const student = express.Router();
const port = process.env.port || 5000;
const secret = process.env.secret || 'secret';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.listen(port, () => console.log('ready'));

// check if a cookie is present for protected routs
app.use(cookieParser(secret));

teacher.use((req: Request, res: Response, next: express.NextFunction) => {
	role(req, res)
		.then(result => {
			if (result.rows[0].role === 0 || result.rows[0].role === 1)
				next();
			else 
				res.status(401).send('Unauthorized')
		})
		.catch(_ => res.status(500).send('Server error'));
})


student.use((req: Request, res: Response, next: express.NextFunction) => {
	role(req, res)
		.then(result => {
			if (result.rows[0].role === 1)
				next();
			else 
				res.status(401).send('Unauthorized')
		})
		.catch(_ => res.status(500).send('Server error'));
})

// POST
// /login
// auth the user
app.post('/auth/login', (req: Request, res: Response) => {
	login(req, res);
})

// POST
// /register
// auth the user
app.post('/auth/register', (req: Request, res: Response) => {
	register(req, res);
})


app.use('/api', teacher);
app.use('/api', student);

export { teacher, student };