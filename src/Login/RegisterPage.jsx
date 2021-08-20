import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'

import { auth } from '../shared/auth.jsx'

import { 
	Button, 
	Form,
	FormGroup, 
	FormFeedback,
	Label, 
	Input
} from 'reactstrap';

export default function RegisterPage() {
	let query = new URLSearchParams(window.location.search);
	query = query.get('id');
	const history = useHistory();

	if (auth.currUserValue)
		history.push(auth.currUserValue.id === '1' ? '/teacher' : '/student')

	// get name of a register
	const [fullname, setFullname] = useState('')
	const [isStudent, setIsStudent] = useState(false);

	useEffect(() => {
		const getName = async () => {
			if (query === null)
				return
			axios.get(`/Peek?id=${query}`)
				.then(res => {
					if (res.data !== '') {
						setFullname(res.data);
						setIsStudent(true);
					}
					else 
						setIsStudent(false);
				})
				.catch(err => {setIsStudent(false); console.log(err)});
		}
		// workaround for the 2nd useEffect i do later
		// i don't want to fucking hammer the server with a request for each keystoke lmao
		if (fullname.length === 0)
			getName();
	})

	const [password, setpassword] = useState('')
	const [confirmPW, setconfirmPW] = useState('')


	const [validPW, setvalidPW] = useState(false);
	// 0 means all goood
	// 1 means the 2nd pw is empty
	// 2 means passwords differ
	const [validConfirm, setvalidConfirm] = useState(0);

	const onSubmit = (e) => {
		e.preventDefault();

		if (password.length === 0) {
			alert("Введите пароль")
			return
		}
		
		if (confirmPW.length === 0) {
			alert("Введите подтверждение пароля")
			return
		}

		if (password !== confirmPW) {
			alert("Пароли не совпадают")
			return
		}

		auth.login(query, '')
			.then(res => {
				const cookies = new Cookies();
				cookies.set('token', res.data, {path: '/', maxAge: 86400});
				localStorage.setItem('currentUser', JSON.stringify({id: query, token: res.data, time: Date.now()}))
				axios.post('/api/StRegister', {String: password})
					.then(_ => history.push('/login'))
					.catch(err => console.log(err))})
			}

	useEffect(() => {
		if (password.length === 0)
			setvalidPW(false);
		else 
			setvalidPW(true);

		if (confirmPW !== password) {
			setvalidConfirm(2);
		}

		if (confirmPW.length === 0)
			setvalidConfirm(1);
		else if (confirmPW !== password)
			setvalidConfirm(2);
		else 
			setvalidConfirm(0);

	}, [password, confirmPW, validPW, setvalidPW])

    return (
		<div className = "container">
			{ // are we a student? 
			isStudent ? <Form style = {{width: "100%"}} onSubmit = {onSubmit}>
			<h2>Регистрация</h2>
				<Label>Здравствуй, {fullname}</Label>
				<br></br>
				<Label>Твой будущий логин - {query}</Label>
				<FormGroup style = {{marginTop: "2em"}}>
					<Label for="pwEnter">Пароль</Label>
					<Input invalid = {!validPW} type="password" 
					name="password" id="pwEnter" placeholder="Введите пароль" 
					onChange = {(e) => {setpassword(e.target.value)}}/>
					<FormFeedback>Пароль не может быть пустой</FormFeedback>
				</FormGroup>
				<FormGroup style = {{marginTop: "2em"}}>
					<Label for="pwConfirm">Подтвердите пароль</Label>
					<Input invalid = {validConfirm > 0} type="password"
					name="password" id="pwConfirm" placeholder="Введите пароль"
					onChange = {(e) => {
						setconfirmPW(e.target.value);
					}}/>
					{validConfirm === 1 && <FormFeedback>Пароль не может быть пустой</FormFeedback>}
					{validConfirm === 2 && <FormFeedback>Пароли отличаются</FormFeedback>}
				</FormGroup>
				<Button style = {{marginTop: "10%", width: "100%"}} type = "submit">Зарегистрироваться</Button>
				<Button style = {{marginTop: "10%", width: "100%"}}  onClick = {() => history.push('/')}>Назад</Button>
			</Form> :
			// alternate
			<Form>
				<h1 style = {{textAlign: "center"}}>Ошиблись ссылкой?</h1>
				<Button style = {{marginTop: "10%", width: "100%"}}  onClick = {() => history.push('/')}>Назад</Button>
			</Form>
			}
		</div>
    )
}

