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
			"taskid": 0,
			"isOpen": false,
			"question": "",
			"correct": "",
			"diff": 1
		}
	}

	// modal
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);
	
	const [text, setText] = useState(task.question);
	const [isOpen, setIsOpen] = useState(task.isOpen);
	const [diff, setDiff] = useState(task.diff);
	const [answ, setAnsw] = useState(task.correct);

	const onSubmit = (e) => {
		e.preventDefault();

		console.log(task.taskid, text, isOpen, diff, answ);

		if (!text) {
			alert("Введите текст задания!") 
			return;
		}
		if (!answ && !isOpen) {
			alert("Введите ответ на задание!")
			return;
		}

		if (isOpen && answ) setAnsw('')
		var temp; 

		if (task.taskid !== 0) {
			temp = {
				isOpen: isOpen,
				question: text,
				correct: answ,
				diff: diff
			}
			temp.isOpen = isOpen;
			temp.question = text;
			temp.correct = answ;
			temp.diff = diff;

			axios.patch('/api/tasks/' + task.taskid, temp)
			 .then(res => setTasks(tasks.map(e => e.taskid === task.taskid ? temp : e)))
			 .catch(err => console.log(err));
		}
		else {
			temp = {
				isOpen: isOpen,
				question: text,
				correct: answ,
				diff: diff
			}
			axios.post('/api/tasks', task)
			 .then(res => {task.taskid = res.data.taskid; setTasks([...tasks, task])})
			 .catch(err => console.log(err));
		}
	}

	const onDelete = () => {
		axios.delete('/api/tasks' + task.taskid)
			.then(res => setTasks(tasks.filter(item => item.taskid !== task.taskid)))
			.catch(err => console.log(err));
	}

	useEffect(() => {
		setText(task.question);
		setIsOpen(task.isOpen);
		setDiff(task.diff);
		setAnsw(task.correct);
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
							<option value = {1} selected = {task.diff === 1}>Базовый</option>
							<option value = {2} selected = {task.diff === 2}>Продвинутый</option>
							<option value = {3} selected = {task.diff === 3}>Высокий</option>
					</select>
				</FormGroup>
				<FormGroup>
					<Label for = "text">Текст задания</Label> <span onClick = {toggle}><Question/></span>
					<Input type = "textarea" id = "text" key = {task.taskid}
					defaultValue = {task.taskid === 0 ? '' : task.question}
					placeholder  = {task.taskid === 0 ? 'Введите текст задания' : ''}
					style = {{height: "250px"}}
					onChange = {(e) => setText(e.target.value)}></Input>
				</FormGroup>
				<FormGroup check inline 
				style = {{marginBottom: "25px"}}>
					<Label check>
						<Input type = "checkbox" checked = {isOpen} key = {task.taskid}
						onChange = {(e) => setIsOpen(e.currentTarget.checked)}/>
						Открытый вопрос (ответ отправляется преподавателю)
					</Label>
				</FormGroup>
				{!isOpen && <FormGroup>
					<Label for = "answ">Ответ на задание</Label>
					<Input type = "textarea" id = "answ" key = {task.taskid}
					defaultValue = {task.taskid === 0 ? '' : task.correct}
					placeholder  = {task.taskid === 0 ? 'Введите ответ' : ''}
					style = {{height: "250px"}}
					onChange = {(e) => setAnsw(e.target.value)}></Input>
				</FormGroup> }
				<br></br>
				{task.taskid !== 0 && 
				<Button className = "redBtn" onClick = {onDelete}>Удалить задание</Button>}
				<Button type='submit' style = {{float: "right"}}>{task.taskid === 0 ? "Добавить задание" : "Изменить задание"}</Button>
			</Form>
			<MdTooltip isOpen = {modal} toggle = {toggle} />
		</Col>
	)
}
