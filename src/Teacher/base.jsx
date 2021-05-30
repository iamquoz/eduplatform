import React, { useEffect, useState, SyntheticEvent } from 'react'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'
import { useGlobalEvent } from 'beautiful-react-hooks'

import {
	TabPane, 
	TabContent,
	Nav, 
	NavItem,
	NavLink,
	Row, Col, 
	UncontrolledTooltip,
	Button
} from 'reactstrap'

import axios from 'axios'
import PlusIc from '../img/plus.svg'
import EditTheory from './editTheory'
import EditTask from './editTask'

export default function Base() {
	const history = useHistory();

	const [tasks, setTasks] = useState([])
	const [theories, setTheories] = useState([])
	const [currIDTask, setCurrIDTask] = useState(-1);
	const [currIDTheory, setCurrIDTheory] = useState(-1);
	const [activeTab, setActiveTab] = useState(1);

	const [showSidebar, setShowSidebar] = useState(true);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const onWindowResize = useGlobalEvent('resize');

	// this is fine, don't worry about it
	onWindowResize((event: SyntheticEvent) => {
		setWindowWidth(window.innerWidth);
	})

	const toggle = tab => {
		setCurrIDTask(-1);
		setCurrIDTheory(-1);
		setShowSidebar(true);
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
				className = {classnames({chosenSidebar: currIDTask === task.id})}>	 
					<NavLink onClick = {() => {setCurrIDTask(task.id); setShowSidebar(false)}} id = {"tooltip" + task.id}>
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
				className = {classnames({chosenSidebar: currIDTheory === theory.id})}>	 
					<NavLink onClick = {() => {setCurrIDTheory(theory.id); setShowSidebar(false)}}>
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
					<Row style = {{marginRight: "0", paddingBottom: "80px"}}>
						{(showSidebar || windowWidth > 768) && 
						<Col className = "sidebar">
							<Nav vertical>
								<NavItem className = {classnames({chosenSidebar: currIDTask === 0})}>
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
						}
						{ 
						currIDTask !== -1 
						? <EditTask task = {tasks.find(task => task.id === currIDTask)}/> 
						: <Col className = {classnames({dontShowMd: showSidebar}) + " notChosenPlaceholder"} >
							<p>Выберите элемент для начала работы</p></Col>
						}
					</Row>
				</TabPane>
				<TabPane tabId = {2}>
					<Row style = {{marginRight: "0", paddingBottom: "80px"}}>
						{(showSidebar || windowWidth > 768) && 
						<Col className = "sidebar">
							<Nav vertical>
								<NavItem className = {classnames({chosenSidebar: currIDTheory === 0})}>
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
						}
						{ 
						currIDTheory !== -1 
						? <EditTheory theory = {theories.find(theory => theory.id === currIDTheory)}/>
						: <Col className = {classnames({dontShowMd: showSidebar}) + " notChosenPlaceholder"} >
							<p>Выберите элемент для начала работы</p></Col>
						}
					</Row>
				</TabPane>
			</TabContent>
			<div className = "customFooter">
					<Button style = {{marginTop: "15px", marginLeft: "20px", width: "200px"}}
					className = "possiblyHidden"
					onClick = {() => setShowSidebar(!showSidebar)}>
						Показать задания
					</Button>
					<Button 
					style = {{float: "right", marginTop: "15px", marginRight: "40px", width: "200px"}}
					className = "redBtn" 
					onClick = {() => history.push('/teacher')}>
							Вернуться в ЛК
					</Button>
				</div>
		</div>
	)
}
