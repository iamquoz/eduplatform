import { useHistory } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function RegisterPage() {
	let query = new URLSearchParams(window.location.search);
	query = query.get('id');
	const history = useHistory();

	// get name of a register
	let fullname = "Коколов Андрей Валерьевич";

    return (
		<div className = "container">
			<Form style = {{width: "100%"}}>
			<h2>Регистрация</h2>
				<Label>Здравствуйте, {fullname}</Label>
				<br></br>
				<Label>Ваш будущий логин - {query}</Label>
				<FormGroup style = {{marginTop: "2em"}}>
					<Label for="pwEnter">Пароль</Label>
					<Input type="password" name="password" id="pwEnter" placeholder="Введите пароль" />
				</FormGroup>
				<FormGroup style = {{marginTop: "2em"}}>
					<Label for="pwConfirm">Подтвердите пароль</Label>
					<Input type="password" name="password" id="pwConfirm" placeholder="Введите пароль" />
				</FormGroup>
				<Button style = {{marginTop: "10%", width: "100%"}}  onClick = {() => history.push('/login')}>Зарегистрироваться</Button>
				<Button style = {{marginTop: "10%", width: "100%"}}  onClick = {() => history.push('/login')}>Назад</Button>
			</Form>
	</div>
    )
}

