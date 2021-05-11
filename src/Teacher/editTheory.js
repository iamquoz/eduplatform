import {useState} from 'react'
import {
	Col,
	Form,
	Input,
	FormGroup,
	Label,
	Button,
} from 'reactstrap'

export default function EditTheory({theory}) {
	if (theory === undefined) {
		theory = {
		"title": "Введите название темы",
		"id": "0", 
		"text": "Введите текст материала"
		}
	}

	const [title, setTitle] = useState('');
	const [text, setText] = useState('');

	
	const onSubmit = (e) => {
		e.preventDefault();

		console.log(theory.id, title, text);

		if (!title)	alert("Введите название теории!")
		if (!text)	alert("Введите текст теории!")
	}

	return (
		<Col>	
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px"}}>
				<FormGroup>
					<Label for = "title">Название темы</Label>
					<Input type = "textarea" placeholder = {theory.title}
					onChange = {(e) => setTitle(e.target.value)}></Input>
				</FormGroup>
				<FormGroup>
					<Label for = "title">Текст материала</Label>
					<Input type = "textarea" placeholder = {theory.text}
					onChange = {(e) => setText(e.target.value)}
					style = {{height: "500px"}}></Input>
				</FormGroup>
				<br></br>
				{theory.id !== '0' && <Button type='submit' style = {{backgroundColor: "red"}}>Удалить теорию</Button>}
				<Button type='submit' style = {{float: "right"}}>Добавить теорию</Button>
			</Form>
		</Col>
	)
}
