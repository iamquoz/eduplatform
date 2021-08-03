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

export default function EditTheory({theory, className, setTheories, theories}) {

	if (theory === undefined) {
		theory = {
		"ID": 0, 
		"Header": "",
		"Body": ""
		}
	}

	// modal
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	const [title, setTitle] = useState(theory.Header);
	const [text, setText] = useState(theory.Body);

	
	const onSubmit = (e) => {
		e.preventDefault();

		console.log(theory.ID, title, text);

		if (!title) {	
			alert("Введите название теории!")
			return;
		}
		if (!text) {
			alert("Введите текст теории!")
			return;
		}

		if (theory.ID !== 0) {
			var j = {TheoryID: (theory.ID), Theory: {Header: title, Body: text}};
			axios.post('/api/RenewTheory', j)
				.catch(err => console.log(err));
		}
		else {
			var jth = {Header: title, Body: text};
			axios.post('/api/NewTheory', {Theory: jth})
				.then(res => {jth.ID = res.data.TheoryID; setTheories([...theories, jth])})
				.catch(err => console.log(err));
		}
	}

	const onDelete = () => {
		axios.post('/api/ZapTheory', {TheoryID: theory.ID})
			.then(res => setTheories(theories.filter(item => item.ID !== theory.ID)))
			.catch(err => console.log(err));
	}

	useEffect(() => {
		setTitle(theory.Header)
		setText(theory.Body);
	}, [theory])

	return (
		<Col className = {className}>	
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px", marginLeft: "15px"}}>
				<FormGroup>
					<Label for = "title">Название темы</Label>
					<Input type = "textarea" key = {theory.ID}
					defaultValue = {theory.ID === 0 ? '' : theory.Header} 
					placeholder = {theory.ID === 0 ? 'Введите название темы' : ''}
					onChange = {(e) => setTitle(e.target.value)}></Input>
				</FormGroup>
				<FormGroup>
					<Label for = "title">Текст материала</Label>
					<span onClick = {toggle}><Question /></span>
					<Input type = "textarea" key = {theory.ID}
					defaultValue = {theory.ID === 0 ? '' : theory.Body}
					placeholder = {theory.ID === 0 ? 'Введите текст материала' : ''}
					onChange = {(e) => setText(e.target.value)}
					style = {{height: "500px"}}></Input>
				</FormGroup>
				<br></br>
				{theory.ID !== 0 && 
				<Button className = "redBtn" onClick = {onDelete}>Удалить теорию</Button>
				}
				<Button type='submit' style = {{float: "right"}}>Добавить теорию</Button>
			</Form>
			<MdTooltip isOpen = {modal} toggle = {toggle} />
		</Col>
	)
}
