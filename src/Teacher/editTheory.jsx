import { useState, useEffect} from 'react'
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

	useEffect(() => {
		
	}, [theory])

	return (
		<Col>	
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px"}}>
				<FormGroup>
					<Label for = "title">Название темы</Label>
					<Input type = "textarea" key = {theory.id}
					defaultValue = {theory.id === '0' ? '' : theory.title} 
					placeholder = {theory.id === '0' ? theory.title : ''}
					onChange = {(e) => setTitle(e.target.value)}></Input>
				</FormGroup>
				<FormGroup>
					<Label for = "title">Текст материала</Label>
					<Input type = "textarea" key = {theory.id}
					defaultValue = {theory.id === '0' ? '' : theory.text}
					placeholder = {theory.id === '0' ? theory.text : ''}
					onChange = {(e) => setText(e.target.value)}
					style = {{height: "500px"}}></Input>
				</FormGroup>
				<br></br>
				{theory.id !== '0' && <Button type='submit' className = "redBtn">Удалить теорию</Button>}
				<Button type='submit' style = {{float: "right"}}>Добавить теорию</Button>
			</Form>
		</Col>
	)
}
