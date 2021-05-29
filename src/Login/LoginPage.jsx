import { useState, useEffect } from 'react' 
import { useHistory } from 'react-router-dom';
import { 
	Button, 
	Form, 
	FormFeedback,
	FormGroup, 
	Label, 
	Input 
} from 'reactstrap';

import axios from 'axios'

export default function LoginPage() {
	const history = useHistory();
	
	const [login, setlogin] = useState('');
	const [password, setpassword] = useState('');

	const [validPW, setvalidPW] = useState(false);
	// 0 means all good
	// 1 means login is empty
	// 2 means login has non-digits
	const [validLogin, setvalidLogin] = useState(0);
	
	const onSubmit = (e) => {
		e.preventDefault();

		if (login.length === 0) {
			alert("Введите логин");
			return;
		}

		// check for a number
		// https://stackoverflow.com/a/1779019/16029300
		if (!/^\d+$/.test(login)) {
			alert("Логин может содержать лишь цифры")
			return;
		}

		if (password.length === 0) {
			alert("Введите пароль")
			return
		}

		console.log(login, password);
	}

	useEffect(() => {
		if (login.length === 0) 
			setvalidLogin(1);
		else if (!/^\d+$/.test(login))
			setvalidLogin(2)
		else 
			setvalidLogin(0);
		
		if (password.length === 0) 
			setvalidPW(false);
		else 
			setvalidPW(true);
		
	}, [login, password, validLogin, validPW])


    return (
		<div className = "container">
			<Form style = {{width: "100%"}} onSubmit = {onSubmit}>
				<h2>Вход</h2>
				<FormGroup>
					<Label for="exampleEmail">Логин</Label>
					<Input type="numbers" name="login" invalid = {validLogin > 0}
					onChange = {(e) => setlogin(e.target.value)}
					placeholder="Введите логин"/>
					{validLogin === 1 && <FormFeedback>Логин не может быть пустым</FormFeedback>}
					{validLogin === 2 && <FormFeedback>Логин можешь содержать лишь цифры</FormFeedback>}
				</FormGroup>
				<FormGroup style = {{marginTop: "2em"}}>
					<Label for="examplePassword">Пароль</Label>
					<Input type="password" name="password" invalid = {!validPW}
					onChange = {(e) => setpassword(e.target.value)}
					placeholder="Введите пароль" />
					<FormFeedback>Пароль не может быть пустым</FormFeedback>
				</FormGroup>
				<Button style = {{marginTop: "10%",  width: "100%"}} type = "submit">
					Войти
				</Button>
			</Form>
		</div>
    )
}

