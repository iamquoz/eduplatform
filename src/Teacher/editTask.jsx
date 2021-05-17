import { useState } from 'react'

import {
	Col,
	Form,
	Input,
	FormGroup,
	Label,
	Button
} from 'reactstrap'

export default function EditTask({task}) {
	if (task === undefined) {
		task = {
			"id": "0",
			"text": "Введите текст задания",
			"answer": "Введите ответ",
			"isOpen": false,
			"difficulty": 2
		}
	}

	// because react for some fucking reason uses
	// literals and not indexes for options in select 

	var retardedArray = ['Базовый', 'Продвинутый', 'Высокий']

	const [text, setText] = useState('');
	const [isOpen, setIsOpen] = useState(task.isOpen);
	const [diff, setDiff] = useState(retardedArray[task.difficulty]);
	const [answ, setAnsw] = useState('');

	const onSubmit = (e) => {
		e.preventDefault();

		console.log(task.id, text, isOpen, diff, answ);

		if (!text)	alert("Введите текст задания!")
		if (!answ && !isOpen) alert("Введите ответ на задание!")
		if (isOpen && answ) setAnsw('')
	}

	return (
		<Col>
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px"}}>
				<FormGroup>
					<Label for = "diff">Сложность задания</Label>
					<Input type = "select" id = "diff"
					onChange = {(e) => setDiff(e.target.value)}>
						<option>Базовый</option>
						<option>Продвинутый</option>
						<option>Высокий</option>
					</Input>
				</FormGroup>
				<FormGroup>
					<Label for = "text">Текст задания</Label>
					<Input type = "textarea" placeholder = {task.text} id = "text"
					style = {{height: "250px"}}
					onChange = {(e) => setText(e.target.value)}></Input>
				</FormGroup>
				<FormGroup check inline 
				style = {{marginBottom: "25px"}}>
					<Label check>
						<Input type = "checkbox" value = {isOpen} 
						onChange = {(e) => setIsOpen(e.currentTarget.checked)}/>
						Открытый вопрос (ответ отправляется преподавателю)
					</Label>
				</FormGroup>
				{!isOpen && <FormGroup>
					<Label for = "answ">Ответ на задание</Label>
					<Input type = "textarea" placeholder = {task.answer} id = "answ"
					style = {{height: "250px"}}></Input>
				</FormGroup> }
				<br></br>
				{task.id !== '0' && <Button type='submit' className = "redBtn">Удалить задание</Button>}
				<Button type='submit' style = {{float: "right"}}>Добавить задание</Button>
			</Form>
		</Col>
	)
}
