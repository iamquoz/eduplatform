import { useState, useEffect} from 'react'
import {
	Col,
	Form,
	Input,
	FormGroup,
	Label,
	Button,
} from 'reactstrap'

import axios from 'axios'
import MdTooltip from '../shared/mdtooltip'
import Question from '../shared/question'

export default function EditTheory({theory}) {
	if (theory === undefined) {
		theory = {
		"title": "",
		"id": "0", 
		"text": ""
		}
	}

		
	// modal
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	const [title, setTitle] = useState('');
	const [text, setText] = useState('');

	
	const onSubmit = (e) => {
		e.preventDefault();

		console.log(theory.id, title, text);

		if (!title) {	
			alert("Введите название теории!")
			return;
		}
		if (!text) {
			alert("Введите текст теории!")
			return;
		}

		if (theory.id !== '0') {
			axios.put('https://6099651699011f0017140ca7.mockapi.io/theories/' + theory.id,
			{
				title: title,
				id: theory.id,
				text: text
			})
			.then(function(responce) {
				console.log(responce)
			})
			.catch(function(responce) {
				console.log(responce)
			})
		}
		else {
			axios.post('https://6099651699011f0017140ca7.mockapi.io/theories/',
			{
				title: title,
				id: theory.id,
				text: text
			})
			.then(function(responce) {
				console.log(responce)
			})
			.catch(function(responce) {
				console.log(responce)
			})
		}
	}

	const onDelete = () => {
		axios.delete('https://6099651699011f0017140ca7.mockapi.io/theories/' + theory.id)
		.then(function(responce) {
			console.log(responce);
		})
		.catch(function(responce) {
			console.log(responce);
		})
	}

	useEffect(() => {
		if (theory.id === '0')
			return;
		setTitle(theory.title)
		setText(theory.text);
	}, [theory])

	return (
		<Col>	
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px", marginLeft: "15px"}}>
				<FormGroup>
					<Label for = "title">Название темы</Label>
					<Input type = "textarea" key = {theory.id}
					defaultValue = {theory.id === '0' ? '' : theory.title} 
					placeholder = {theory.id === '0' ? 'Введите название темы' : ''}
					onChange = {(e) => setTitle(e.target.value)}></Input>
				</FormGroup>
				<FormGroup>
					<Label for = "title">Текст материала</Label><span onClick = {toggle}><Question /></span>
					<Input type = "textarea" key = {theory.id}
					defaultValue = {theory.id === '0' ? '' : theory.text}
					placeholder = {theory.id === '0' ? 'Введите текст материала' : ''}
					onChange = {(e) => setText(e.target.value)}
					style = {{height: "500px"}}></Input>
				</FormGroup>
				<br></br>
				{theory.id !== '0' && 
				<Button className = "redBtn" onClick = {onDelete}>Удалить теорию</Button>
				}
				<Button type='submit' style = {{float: "right"}}>Добавить теорию</Button>
			</Form>
			<MdTooltip isOpen = {modal} toggle = {toggle} />
		</Col>
	)
}
