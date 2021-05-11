import {useEffect, useState} from 'react'
import classnames from 'classnames'
/* eslint-disable */
import {
	TabPane, 
	TabContent,
	Nav, 
	NavItem,
	NavLink,
	Button,
	Form,
	Input,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Label,
	FormText,
	Row, Col, 
	UncontrolledTooltip
} from 'reactstrap'
/* eslint-enable */

import axios from 'axios'
import PlusIc from '../img/plus.svg'
import EditTheory from './editTheory'
import EditTask from './editTask'

export default function Base() {

	const [tasks, setTasks] = useState([])
	const [theories, setTheories] = useState([])
	const [currIDTask, setCurrIDTask] = useState(-1);
	const [currIDTheory, setCurrIDTheory] = useState(-1);
	const [activeTab, setActiveTab] = useState(1);

	const toggle = tab => {
		setCurrIDTask(-1);
		setCurrIDTheory(-1);
		if (activeTab !== tab) 
		setActiveTab(tab);
	}

	useEffect(() => {
		const getAll = async () => {
			const th = await fetchTheories();
			const tas = await fetchTasks();
			setTasks(tas);
			setTheories(th);
		}
		getAll()
	}, [])
	
	const fetchTheories = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/theories/')
		return responce.data;
	}

	const fetchTasks = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/tasks/')
		responce.data.forEach(task => {
			task.id++
		});
		return responce.data;
	}

	const DisplayListTasks = () => {
		return (
			<>
			{tasks.map(task => (
				<NavItem key = {task.id} 
				style = {currIDTask === task.id ? {color: "white", backgroundColor: 'black'} : {}}>	 
					<NavLink onClick = {() => setCurrIDTask(task.id)} id = {"tooltip" + task.id}>
							{task.text.length > 50 ? 
							`${task.text.substring(0, 50)}...` : task.text}
					</NavLink>
					{ // causes the transition and findDOMNode warnngs 
					}

					<UncontrolledTooltip placement = "bottom" target = {"tooltip"+ task.id}>
						{task.text}			
					</UncontrolledTooltip>
				</NavItem>
			))}
			</>
		)
	}
	const DisplayListTheories = () => {
		return (
			<>
			{theories.map(theory => (
				<NavItem key = {theory.id} 
				style = {currIDTheory === theory.id ? {color: "white", backgroundColor: 'black'} : {}}>	 
					<NavLink onClick = {() => setCurrIDTheory(theory.id)}>
							{theory.title}
					</NavLink>
				</NavItem>
			))}
			</>
		)
	}

	return (
		<div>
			<Nav tabs style = {{marginBottom: "25px"}}>
				<NavItem style = {{width: "50%", textAlign: "center"}}>
					<NavLink
						className={classnames({ active: activeTab === 1 })}
						style = {activeTab === 1 ? {color: "white", backgroundColor: 'black'} : {}}
						onClick={() => { toggle(1); }} >
						Задания
					</NavLink>
				</NavItem>
				<NavItem style = {{width: "50%", textAlign: "center"}}>
					<NavLink
						className={classnames({ active: activeTab === 2 })}
						style = {activeTab === 2 ? {color: "white", backgroundColor: 'black'} : {}}
						onClick={() => { toggle(2); }}>
						Теория
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={activeTab}>
				<TabPane tabId = {1}>
					<Row style = {{marginRight: "0"}}>
						<Col className = "sidebar">
							<Nav vertical>
								<NavItem style = {currIDTask === 0 ? {backgroundColor: "black", color: "white"} : {}}>
									<NavLink onClick = {() => setCurrIDTask(0)}>
										<img alt = " " src = {PlusIc} style = {currIDTask === 0 ? {width: "40px", marginRight: "20px"} : {filter: "invert(1)", width: "40px", marginRight: "20px"}}></img>
										<span>Добавить новое задание</span>
									</NavLink>
								</NavItem>
								<NavItem>
									<div className = "dropdown-divider"></div>
								</NavItem>
								<DisplayListTasks />
							</Nav>
						</Col>
						<EditTask task = {tasks[currIDTask - 1]}/>
					</Row>
				</TabPane>
				<TabPane tabId = {2}>
					<Row style = {{marginRight: "0"}}>
						<Col className = "sidebar">
							<Nav vertical>
								<NavItem style = {currIDTheory === 0 ? {backgroundColor: "black", color: "white"} : {}}>
									<NavLink onClick = {() => setCurrIDTheory(0)}>
										<img alt = " " src = {PlusIc} style = {currIDTheory === 0 ? {width: "40px", marginRight: "20px"} : {filter: "invert(1)", width: "40px", marginRight: "20px"}}></img>
										<span>Добавить новый теоретический материал</span>
									</NavLink>
								</NavItem>
								<NavItem>
									<div className = "dropdown-divider"></div>
								</NavItem>
								<DisplayListTheories />
							</Nav>
						</Col>
						<EditTheory theory = {theories[currIDTheory - 1]}/>
					</Row>
				</TabPane>
			</TabContent>
		</div>
	)
}
