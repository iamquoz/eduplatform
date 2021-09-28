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
		"theoryid": 0, 
		"title": "",
		"body": ""
		}
	}

	// modal
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

	const [title, setTitle] = useState(theory.title);
	const [text, setText] = useState(theory.body);

	
	const onSubmit = (e) => {
		e.preventDefault();

		console.log(theory.theoryid, title, text);

		if (!title) {	
			alert("Введите название теории!")
			return;
		}
		if (!text) {
			alert("Введите текст теории!")
			return;
		}
		
		var temp;

		if (theory.ID !== 0) {
			temp = {title: title, body: text};
			axios.patch('/api/theories/' + theory.theoryid, temp)
				.then(_ => setTheories(theories.map(e => theory.theoryid === e.theoryid ? {theoryid: theory.theoryid, title: title, body: text} : e)))
				.catch(err => console.log(err));
		}
		else {
			temp = {title: title, body: text};
			axios.post('/api/theories', temp)
				.then(res => {temp.theoryid = res.data.theoryid; setTheories([...theories, temp])})
				.catch(err => console.log(err));
		}
	}

	const onDelete = () => {
		axios.delete('/api/theories' + theory.theoryid)
			.then(res => setTheories(theories.filter(item => item.theoryid !== theory.theoryid)))
			.catch(err => console.log(err));
	}

	useEffect(() => {
		setTitle(theory.title)
		setText(theory.body);
	}, [theory])

	return (
		<Col className = {className}>	
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px", marginLeft: "15px"}}>
				<FormGroup>
					<Label for = "title">Название темы</Label>
					<Input type = "textarea" key = {theory.theoryid}
					defaultValue = {theory.theoryid === 0 ? '' : theory.title} 
					placeholder = {theory.theoryid === 0 ? 'Введите название темы' : ''}
					onChange = {(e) => setTitle(e.target.value)}></Input>
				</FormGroup>
				<FormGroup>
					<Label for = "title">Текст материала</Label>
					<span onClick = {toggle}><Question /></span>
					<Input type = "textarea" key = {theory.theoryid}
					defaultValue = {theory.theoryid === 0 ? '' : theory.body}
					placeholder = {theory.theoryid === 0 ? 'Введите текст материала' : ''}
					onChange = {(e) => setText(e.target.value)}
					style = {{height: "500px"}}></Input>
				</FormGroup>
				<br></br>
				{theory.ID !== 0 && 
				<Button className = "redBtn" onClick = {onDelete}>Удалить теорию</Button>
				}
				<Button type='submit' style = {{float: "right"}}>{theory.theoryid === 0 ? "Добавить теорию" : "Изменить теорию"}</Button>
			</Form>
			<MdTooltip isOpen = {modal} toggle = {toggle} />
		</Col>
	)
}
