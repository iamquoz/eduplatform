import { useHistory } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function LoginPage() {
	const history = useHistory();
    return (
		<div className = "container">
			<Form style = {{width: "100%"}}>
				<h2>Вход</h2>
				<FormGroup>
					<Label for="exampleEmail">Логин</Label>
					<Input type="numbers" name="login" id="exampleEmail" placeholder="Введите логин"/>
				</FormGroup>
				<FormGroup style = {{marginTop: "2em"}}>
					<Label for="examplePassword">Пароль</Label>
					<Input type="password" name="password" id="examplePassword" placeholder="Введите пароль" />
				</FormGroup>
				<Button style = {{marginTop: "10%",  width: "100%"}}
				onClick = {() => history.push('/')}>Войти</Button>
			</Form>
		</div>
    )
}

