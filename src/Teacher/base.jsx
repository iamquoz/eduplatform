import {useEffect, useState} from 'react'
import classnames from 'classnames'
/* eslint-disable */
import {
	TabPane, 
	TabContent,
	Nav, 
	NavItem,
	NavLink,
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
		return responce.data;
	}

	const DisplayListTasks = () => {
		return (
			<>
			{tasks.map(task => (
				<NavItem key = {task.id} 
				className = {currIDTask === task.id ? "chosenSidebar" : ""}>	 
					<NavLink onClick = {() => setCurrIDTask(task.id)} id = {"tooltip" + task.id}>
							{task.text.length > 50 ? 
							`${task.text.substring(0, 50)}...` : task.text}
					</NavLink>
					{ /* causes the transition and findDOMNode warnngs */}
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
				className = {currIDTheory === theory.id ? "chosenSidebar" : ""}>	 
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
			<Nav tabs className = "tabWrapper">
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 1 })}
						onClick={() => { toggle(1); }} >
						Задания
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 2 })} 
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
								<NavItem className = {currIDTask === 0 && "chosenSidebar"}>
									<NavLink onClick = {() => setCurrIDTask(0)}>
										<img alt = " " src = {PlusIc}></img>
										<span>Добавить новое задание</span>
									</NavLink>
								</NavItem>
								<NavItem>
									<div className = "dropdown-divider"></div>
								</NavItem>
								<DisplayListTasks />
							</Nav>
						</Col>
						{ 
						currIDTask !== -1 
						? <EditTask task = {tasks[currIDTask - 1]}/> 
						: <Col className = "notChosenPlaceholder">
							<p>Нажмите на элемент слева для начала работы</p>
						  </Col>
						}
					</Row>
				</TabPane>
				<TabPane tabId = {2}>
					<Row style = {{marginRight: "0"}}>
						<Col className = "sidebar">
							<Nav vertical>
								<NavItem className = {currIDTheory === 0 && "chosenSidebar"}>
									<NavLink onClick = {() => setCurrIDTheory(0)}>
										<img alt = " " src = {PlusIc}></img>
										<span>Добавить новый теоретический материал</span>
									</NavLink>
								</NavItem>
								<NavItem>
									<div className = "dropdown-divider"></div>
								</NavItem>
								<DisplayListTheories />
							</Nav>
						</Col>
						{ 
						currIDTheory !== -1
						? <EditTheory theory = {theories[currIDTheory - 1]}/>
						: <Col className = "notChosenPlaceholder">
							<p>Нажмите на элемент слева для начала работы</p></Col>
						}
					</Row>
				</TabPane>
			</TabContent>
		</div>
	)
}
