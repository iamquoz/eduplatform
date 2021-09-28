import { useState, useEffect } from 'react'
import classnames from 'classnames'
import axios from 'axios'

import {
	Nav,
	NavItem,
	NavLink,
	TabPane, 
	TabContent,
	Button,
	FormGroup,
	Form,
	Input,
	Label
} from 'reactstrap'

export default function GiveTask() {

	const [stList, setStList] = useState([])
	const [tasklist, settasklist] = useState([])
	const [theorylist, settheorylist] = useState([])

	const [chosenTheory, setChosenTheory] = useState(-1);
	const [chosenTasks, setChosenTasks] = useState([]);
	const [chosenStudents, setChosenStudents] = useState([])


	const onSubmit = (e) => {
		e.preventDefault();

		if (activeTab === 4) {
			if (chosenTheory === -1) {
				alert('Ни одна теория не была выбрана!');
				setActiveTab(1);
				return;
			}

			if (chosenStudents.length === 0) {
				alert('Не один студент не выбран!');
				setActiveTab(2);
				return;
			}

			if (chosenTasks.length === 0) {
				alert('Ни одна задача не была выбрана!');
				setActiveTab(3);
				return;
			}
		}

		if (activeTab !== 4)
			return;
			
		axios.post('/api/Appoint', {
			StudentIDArray: chosenStudents,
			TaskIDArray: chosenTasks,
			TheoryID: chosenTheory
		})
			.then(_ => alert("Успешно!"))
			.catch(err => console.log(err));
		
		setChosenTasks([]);
		setChosenStudents([]);
		setChosenTheory(-1);

		setActiveTab(1);
	}

	useEffect(() => {
		axios.get('/st/theories')
			.then(res => settheorylist(res.data))
			.catch(err => console.log(err));
		axios.get('/api/tasks')
			.then(res => settasklist(res.data))
			.catch(err => console.log(err));
		axios.get('/api/students')
			.then(res => setStList(res.data))
			.catch(err => console.log(err));
	}, [])

	const [activeTab, setActiveTab] = useState(1);

	const toggle = tab => {
		if (activeTab !== tab) 
			setActiveTab(tab);
	}

	const onChangeTasks = (e) => {
		var id = parseInt(e.target.id.substring(1));
		let newArray = [...chosenTasks, id]
		if (chosenTasks.includes(id))
			newArray = newArray.filter(task => task !== id);

		setChosenTasks(newArray)
	} 
	
	const onChangeStudents = (e) => {
		var id = parseInt(e.target.id);
		let newArray = [...chosenStudents, id];
		if (chosenStudents.includes(id))
			newArray = newArray.filter(student => student !== id);	
			
		setChosenStudents(newArray)
	}

	const DisplayStudents = () => {
		return 	<FormGroup check style = {{marginLeft: "25px"}}>
					{
						stList.map(student => (
							<Label check key = {student.studentID}
							className = "taskSelection">
								<Input type = "checkbox" id = {student.studentID}
								checked = {chosenStudents.includes(student.studentID)}
								onChange = {onChangeStudents}/>
								{student.studentName}
							</Label>
						))
					}
				</FormGroup>
	}

	const DisplayTasks = () => {
		return 	<FormGroup check style = {{marginLeft: "25px"}}>
					<h4 className = "taskDifficultyLine">Задания базового уровня сложности</h4>
					{
						tasklist.filter(task => {
							return task.diff === 1
						}).map(task => {
							return <Label check key = {task.taskid}
							className = "taskSelection">
								<Input type = "checkbox" id = {'t' + task.taskid}
								checked = {chosenTasks.includes(task.taskid)}
								onChange = {onChangeTasks}/>
								{task.question}
							</Label>
						})
					}
					<h4 className = "taskDifficultyLine">Задания продвинутого уровня сложности</h4>
					{
						tasklist.filter(task => {
							return task.Difficulty === 2
						}).map(task => {
							return <Label check key = {task.taskid}
							className = "taskSelection">
								<Input type = "checkbox" id = {'t' + task.taskid}
								checked = {chosenTasks.includes(task.taskid)}
								onChange = {onChangeTasks}/>
								{task.question}
							</Label>
						})
					}
					<h4 className = "taskDifficultyLine">Задания высокого уровня сложности</h4>
					{
						tasklist.filter(task => {
							return task.Difficulty === 3
						}).map(task => {
							return <Label check key = {task.taskid}
							className = "taskSelection">
								<Input type = "checkbox" id = {'t' + task.taskid}
								checked = {chosenTasks.includes(task.taskid)}
								onChange = {onChangeTasks}/>
								{task.question}
							</Label>
						})
					}
				</FormGroup>
	}

	const DisplayTheory = () => {
		return 	<FormGroup tag = "fieldset" style = {{marginLeft: "50px"}}>
					{theorylist.map(theory => (
						<FormGroup key = {theory.theoryid}>
							<Label check
							className = "taskSelection">
								<Input type = "radio" name = "radiotheory" 
								checked = {chosenTheory === theory.theoryid}
								value = {theory.theoryid}
								onChange = {(e) => {setChosenTheory(parseInt(e.target.value))}}/>
								{theory.title}
							</Label>
						</FormGroup>
					))}
				</FormGroup>
	}

	return (
		<div>
			<Nav tabs style = {{marginBottom: "25px"}} className = "tabWrapper tabs3">
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 1 })}
						onClick={() => toggle(1)} >
						Выбор темы
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 2 })} 
						onClick={() => toggle(2)}>
						Выбор заданий
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 3 })} 
						onClick={() => toggle(3)}>
						Выбор студентов
					</NavLink>
				</NavItem>
			</Nav>
			<Form onSubmit = {onSubmit}>
				<TabContent activeTab = {activeTab} style = {{ paddingBottom: "80px", paddingRight: "10px"}}>
					<TabPane tabId = {1}>
						<DisplayTheory />
					</TabPane>
					<TabPane tabId = {2}>
						<DisplayTasks />
					</TabPane>
					<TabPane tabId = {3}>
						<DisplayStudents />
					</TabPane>
				</TabContent>
				<div className = "customFooter">
					<Button style = {{float: "right", marginTop: "15px", marginRight: "20px", width: "170px"}}
					type = "submit"
					onClick = {() => setActiveTab(activeTab + 1)}>
							Продолжить
					</Button>
				</div>
			</Form>
		</div>
	)
}
