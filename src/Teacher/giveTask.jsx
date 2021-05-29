import { useState, useEffect } from 'react'
import classnames from 'classnames'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

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

	const history = useHistory();

	const onSubmit = (e) => {
		e.preventDefault();
		
		if (activeTab !== 4)
			return
		
		console.log("students: ", chosenStudents, "theory:", chosenTheory, "tasks:", chosenTasks);
		
		setChosenTasks([]);
		setChosenStudents([]);
		setChosenTheory(0);

		setActiveTab(1);
	}

	const [stlist, setstlist] = useState([])
	const [tasklist, settasklist] = useState([])
	const [theorylist, settheorylist] = useState([])

	const [chosenTheory, setChosenTheory] = useState(0);
	const [chosenTasks, setChosenTasks] = useState([]);
	const [chosenStudents, setChosenStudents] = useState([])


	const fetchStudents = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/students/')
		return responce.data;
	}

	const fetchTheory = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/theories/')
		return responce.data;
	}

	const fetchTasks = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/tasks/')
		return responce.data;
	}

	useEffect(() => {
		const getAll = async () => {
			const stl = await fetchStudents();
			const tl = await fetchTasks();
			const thl = await fetchTheory();
			
			setstlist(stl);
			settasklist(tl);
			settheorylist(thl);
		}
		getAll();
	}, [])

	const [activeTab, setActiveTab] = useState(1);

	const toggle = tab => {
		if (activeTab !== tab) 
			setActiveTab(tab);
	}

	const onChangeTasks = (e) => {
		let newArray = [...chosenTasks, e.target.id]
		if (chosenTasks.includes(e.target.id)) {
			newArray = newArray.filter(task => task !== e.target.id)
		}
		setChosenTasks(newArray)
	} 
	
	const onChangeStudents = (e) => {
		let newArray = [...chosenStudents, e.target.id];
		if (chosenStudents.includes(e.target.id)) {
			newArray = newArray.filter(student => student !== e.target.id)	
		}
		setChosenStudents(newArray)
	}

	const DisplayStudents = () => {
		return 	<FormGroup check style = {{marginLeft: "25px"}}>
					{
						stlist.map(student => (
							<Label check key = {student.id}
							className = "taskSelection">
								<Input type = "checkbox" id = {student.id}
								checked = {chosenStudents.includes(student.id)}
								onChange = {onChangeStudents}/>
								{student.stName}
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
							return task.difficulty === '1'
						}).map(task => {
							return <Label check key = {task.id}
							className = "taskSelection">
								<Input type = "checkbox" id = {task.id}
								checked = {chosenTasks.includes(task.id)}
								onChange = {onChangeTasks}/>
								{task.text}
							</Label>
						})
					}
					<h4 className = "taskDifficultyLine">Задания продвинутого уровня сложности</h4>
					{
						tasklist.filter(task => {
							return task.difficulty === '2'
						}).map(task => {
							return <Label check key = {task.id}
							className = "taskSelection">
								<Input type = "checkbox" id = {task.id}
								checked = {chosenTasks.includes(task.id)}
								onChange = {onChangeTasks}/>
								{task.text}
							</Label>
						})
					}
					<h4 className = "taskDifficultyLine">Задания высокого уровня сложности</h4>
					{
						tasklist.filter(task => {
							return task.difficulty === '3'
						}).map(task => {
							return <Label check key = {task.id}
							className = "taskSelection">
								<Input type = "checkbox" id = {task.id}
								checked = {chosenTasks.includes(task.id)}
								onChange = {onChangeTasks}/>
								{task.text}
							</Label>
						})
					}
				</FormGroup>
	}

	const DisplayTheory = () => {
		return 	<FormGroup tag = "fieldset" style = {{marginLeft: "50px"}}>
					{theorylist.map(theory => (
						<FormGroup key = {theory.id}>
							<Label check
							className = "taskSelection">
								<Input type = "radio" name = "radiotheory" 
								checked = {chosenTheory === theory.id}
								value = {theory.id}
								onChange = {(e) => {setChosenTheory(e.target.value)}}/>
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
						onClick={() => { toggle(1); }} >
						Выбор темы
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 2 })} 
						onClick={() => { toggle(2); }}>
						Выбор заданий
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 3 })} 
						onClick={() => { toggle(3); }}>
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
					<Button style = {{float: "right", marginTop: "15px", marginRight: "40px"}}
					type = "submit"
					onClick = {() => {
							setActiveTab(activeTab + 1);
						}}>
							Продолжить
					</Button>
					<Button style = {{marginTop: "15px", marginLeft: "40px"}}
					className = "redBtn" 
					onClick = {() => history.push('/teacher')}>
							Вернуться в ЛК
					</Button>
				</div>
			</Form>
		</div>
	)
}
