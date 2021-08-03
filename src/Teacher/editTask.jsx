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
import Question from '../shared/question'
import MdTooltip from '../shared/mdtooltip'

export default function EditTask({task, className, setTasks, tasks}) {
	if (task === undefined) {
		task = {
			"ID": 0,
			"IsOpen": false,
			"Question": "",
			"Correct": "",
			"Difficulty": 1
		}
	}
	
	// modal
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);
	
	const [text, setText] = useState(task.Question);
	const [isOpen, setIsOpen] = useState(task.IsOpen);
	const [diff, setDiff] = useState(task.Difficulty);
	const [answ, setAnsw] = useState(task.Correct);

	const onSubmit = (e) => {
		e.preventDefault();

		console.log(task.ID, text, isOpen, diff, answ);

		if (!text) {
			alert("Введите текст задания!") 
			return;
		}
		if (!answ && !isOpen) {
			alert("Введите ответ на задание!")
			return;
		}

		if (isOpen && answ) setAnsw('')

		if (task.ID !== 0) {
			axios.post('/api/RenewTask', 
			{
				TaskID: task.ID,
				Task: 
				{
					IsOpen: isOpen,
					Difficulty: diff,
					Question: text,
					Variants: [],
					Correct: answ
				},
				TheoryID: 0
			}
			).then(res => console.log(res))
			 .catch(err => console.log(err));
		}
		else {
			var tempTask = {
				IsOpen: isOpen,
				Difficulty: parseInt(diff),
				Question: text,
				Variants: [],
				Correct: answ
			};
			axios.post('/api/NewTask', 
			{
				Task: tempTask,
				TheoryID: 0
			}
			).then(res => {tempTask.ID = res.data.TaskID; setTasks([...tasks, tempTask])})
			 .catch(err => console.log(err));
		}
	}

	const onDelete = () => {
		axios.post('/api/ZapTask', {TaskID: task.ID})
			.then(res => setTasks(tasks.filter(item => item.ID !== task.ID)))
			.catch(err => console.log(err));
	}

	useEffect(() => {
		setText(task.Question);
		setIsOpen(task.IsOpen);
		setDiff(task.Difficulty);
		setAnsw(task.Correct);
	}, [task])


	// reason for `key` in text areas is so that they update their defaultValue prop 
	// same for editTheory.jsx
	return (
		<Col className = {className}>
			<Form onSubmit = {onSubmit} style = {{marginTop: "10px", marginLeft: "15px"}}>
				<FormGroup>
					<Label for = "diff">Сложность задания</Label>
					<select className = "form-control" id = "diff"
						onChange = {(e) => setDiff(e.target.value)}>
							<option value = {1} selected = {task.Difficulty === 1}>Базовый</option>
							<option value = {2} selected = {task.Difficulty === 2}>Продвинутый</option>
							<option value = {3} selected = {task.Difficulty === 3}>Высокий</option>
					</select>
				</FormGroup>
				<FormGroup>
					<Label for = "text">Текст задания</Label> <span onClick = {toggle}><Question /></span>
					<Input type = "textarea" id = "text" key = {task.ID}
					defaultValue = {task.ID === 0 ? '' : task.Question}
					placeholder  = {task.ID === 0 ? 'Введите текст задания' : ''}
					style = {{height: "250px"}}
					onChange = {(e) => setText(e.target.value)}></Input>
				</FormGroup>
				<FormGroup check inline 
				style = {{marginBottom: "25px"}}>
					<Label check>
						<Input type = "checkbox" checked = {isOpen} key = {task.ID}
						onChange = {(e) => setIsOpen(e.currentTarget.checked)}/>
						Открытый вопрос (ответ отправляется преподавателю)
					</Label>
				</FormGroup>
				{!isOpen && <FormGroup>
					<Label for = "answ">Ответ на задание</Label>
					<Input type = "textarea" id = "answ" key = {task.ID}
					defaultValue = {task.ID === 0 ? '' : task.Correct}
					placeholder  = {task.ID === 0 ? 'Введите ответ' : ''}
					style = {{height: "250px"}}
					onChange = {(e) => setAnsw(e.target.value)}></Input>
				</FormGroup> }
				<br></br>
				{task.ID !== 0 && 
				<Button className = "redBtn" onClick = {onDelete}>Удалить задание</Button>}
				<Button type='submit' style = {{float: "right"}}>Добавить задание</Button>
			</Form>
			<MdTooltip isOpen = {modal} toggle = {toggle} />
		</Col>
	)
}
