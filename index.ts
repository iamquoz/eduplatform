import express, {Request, Response } from "express";
import cookieParser from "cookie-parser";

import {login, register } from "./auth"
import student from "./student";
import teacher from "./teacher";

const app = express();

const port = process.env.port || 8080;
const secret = process.env.secret || 'secret';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.listen(port, () => console.log('ready'));

// check if a cookie is present for protected routs
app.use(cookieParser(secret));

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
app.use('/st', student);