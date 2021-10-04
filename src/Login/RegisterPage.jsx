import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios'

import { 
	Button, 
	Form,
	FormGroup, 
	FormFeedback,
	Label, 
	Input
} from 'reactstrap';

import CustomToast from '../shared/toast'
import { auth } from '../shared/auth.jsx'

export default function RegisterPage() {
	let query = new URLSearchParams(window.location.search);
	query = query.get('id');
	const history = useHistory();

	// get name of a register
	const [fullname, setFullname] = useState('')
	const [isStudent, setIsStudent] = useState(false);

	useEffect(() => {
		if (query === null || fullname.length !== 0)
			return

		console.log(query);
		auth.login(query, '')
			.then(res => {
				localStorage.setItem('account', query);
				axios.get('/st/name')
				.then(result => {
						console.log(result);
						setIsStudent(true);
						setFullname(result.data);
					})
			})
	})

	const [password, setpassword] = useState('')
	const [confirmPW, setconfirmPW] = useState('')


	const [validPW, setvalidPW] = useState(false);
	// 0 means all goood
	// 1 means the 2nd pw is empty
	// 2 means passwords differ
	const [validConfirm, setvalidConfirm] = useState(0);

	const [toastOpen, setToastOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState(false);


	const onSubmit = (e) => {
		e.preventDefault();

		if (password.length === 0) {
			setMessage("Введите пароль")
			setError(true);
			setToastOpen(true);
			return
		}
		
		if (confirmPW.length === 0) {
			setMessage("Введите подтверждение пароля")
			setError(true);
			setToastOpen(true);
			return
		}

		if (password !== confirmPW) {
			setMessage("Пароли не совпадают")
			setError(true);
			setToastOpen(true);
			return
		}

		axios.post('/auth/register', {password: password})
			.then(_ => history.push('/login'))
			.catch(err => console.log(err));
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
			<CustomToast message = {message} error = {error} isOpen = {toastOpen} setIsOpen = {setToastOpen}/>
		</div>
    )
}

