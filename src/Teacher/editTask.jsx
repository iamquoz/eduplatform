import { useState, useEffect } from 'react'
import {
	Col,
	Form,
	Input,
	FormGroup,
	Label,
	Button
} from 'reactstrap'

import axios from 'axios'

export default function EditTask({task}) {
	if (task === undefined) {
		task = {
			"id": "0",
			"text": "",
			"answer": "",
			"isOpen": false,
			"difficulty": 1
		}
	}
	
	const [text, setText] = useState(task.text);
	const [isOpen, setIsOpen] = useState(task.isOpen);
	const [diff, setDiff] = useState('1');
	const [answ, setAnsw] = useState(task.answer);

	const onSubmit = (e) => {
		e.preventDefault();

		console.log(task.id, text, isOpen, diff, answ);

		if (!text) {
			alert("Введите текст задания!") 
			return;
		}
		if (!answ && !isOpen) {
			alert("Введите ответ на задание!")
			return;
		}

		if (isOpen && answ) setAnsw('')

		if (task.id !== '0') {
			axios.put('https://6099651699011f0017140ca7.mockapi.io/tasks/' + task.id,
			{
				id: task.id,
				text: text,
				answer: answ,
				isOpen: isOpen,
				difficulty: diff
			})
			.then(function(responce) {
				console.log(responce)
			})
			.catch(function(responce) {
				console.log(responce)
			})
		}
		else {
			axios.post('https://6099651699011f0017140ca7.mockapi.io/tasks',
			{
				id: task.id,
				text: text,
				answer: answ,
				isOpen: isOpen,
				difficulty: diff
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
		axios.delete('https://6099651699011f0017140ca7.mockapi.io/tasks/' + task.id)
		.then(function(responce) {
			console.log(responce);
		})
		.catch(function(responce) {
			console.log(responce);
		})
	}

	useEffect(() => {
		if (task.id === '0')
			return;
		setText(task.text);
		setIsOpen(task.isOpen);
		setDiff(task.difficulty);
		setAnsw(task.answer);
	}, [task])


	// reason for `key` in text areas is so that they update their defaultValue prop 
	// same for editTheory.jsx
	return (
		<Col>
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px", marginLeft: "15px"}}>
				<FormGroup>
					<Label for = "diff">Сложность задания</Label>
					<select className = "form-control" id = "diff"
						onChange = {(e) => setDiff(e.target.value)}>
							<option value = '1' selected = {task.difficulty === '1'}>Базовый</option>
							<option value = '2' selected = {task.difficulty === '2'}>Продвинутый</option>
							<option value = '3' selected = {task.difficulty === '3'}>Высокий</option>
					</select>
				</FormGroup>
				<FormGroup>
					<Label for = "text">Текст задания</Label>
					<Input type = "textarea" id = "text" key = {task.id}
					defaultValue = {task.id === '0' ? '' : task.text}
					placeholder  = {task.id === '0' ? 'Введите текст задания' : ''}
					style = {{height: "250px"}}
					onChange = {(e) => setText(e.target.value)}></Input>
				</FormGroup>
				<FormGroup check inline 
				style = {{marginBottom: "25px"}}>
					<Label check>
						<Input type = "checkbox" checked = {task.isOpen} key = {task.id}
						onChange = {(e) => setIsOpen(e.currentTarget.checked)}/>
						Открытый вопрос (ответ отправляется преподавателю)
					</Label>
				</FormGroup>
				{!task.isOpen && <FormGroup>
					<Label for = "answ">Ответ на задание</Label>
					<Input type = "textarea" id = "answ" key = {task.id}
					defaultValue = {task.id === '0' ? '' : task.answer}
					placeholder  = {task.id === '0' ? 'Введите ответ' : ''}
					style = {{height: "250px"}}
					onChange = {(e) => setAnsw(e.target.value)}></Input>
				</FormGroup> }
				<br></br>
				{task.id !== '0' && 
				<Button type='submit' className = "redBtn" onClick = {onDelete}>Удалить задание</Button>}
				<Button type='submit' style = {{float: "right"}}>Добавить задание</Button>
			</Form>
		</Col>
	)
}
