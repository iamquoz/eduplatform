import React, { useEffect, useState } from 'react'
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


	const [tasks, setTasks] = useState([])
	const [theories, setTheories] = useState([])
	const [currIDTask, setCurrIDTask] = useState(-1);
	const [currIDTheory, setCurrIDTheory] = useState(-1);
	const [activeTab, setActiveTab] = useState(1);

	const [showSidebar, setShowSidebar] = useState(true);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const onWindowResize = useGlobalEvent('resize');

	// this is fine, don't worry about it
	onWindowResize((event) => {
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
		axios.post('/api/StDigest', {})
			.then(res => {
				var arr = [];
				for(const prop in res.data.MapTheoryIDTheory)
					arr.push(res.data.MapTheoryIDTheory[prop]);
				
				setTheories(arr);
			})
			.catch(err => console.log(err));
		axios.post('/api/EveryTask', {})
			.then(res => {
				var arr = [];
				for(const prop in res.data.MapTaskIDTask)
					arr.push(res.data.MapTaskIDTask[prop]);
				
				setTasks(arr);
			})
			.catch(err => console.log(err));
	}, [])

	const DisplayListTasks = () => {
		return (
			<>
			{tasks.map(task => (
				<NavItem key = {task.ID} 
				className = {classnames({chosenSidebar: currIDTask === task.ID})}>	 
					<NavLink onClick = {() => {setCurrIDTask(task.ID); setShowSidebar(false)}} id = {"tooltipT" + task.ID}>
							{task.Question.length > 50 ? 
							`${task.Question.substring(0, 50)}...` : task.Question}
					</NavLink>
					{ /* causes the transition and findDOMNode warnngs */}
					<UncontrolledTooltip placement = "bottom" target = {"tooltipT"+ task.ID}>
						{task.Question}			
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
				<NavItem key = {theory.ID}
				className = {classnames({chosenSidebar: currIDTheory === theory.ID})}>	 
					<NavLink onClick = {() => {setCurrIDTheory(theory.ID); setShowSidebar(false)}}>
							{theory.Header}
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
						? <EditTask task = {tasks.find(task => task.ID === currIDTask)}
						   className = {classnames({dontShowMd: showSidebar})}
						   setTasks = {setTasks} tasks = {tasks}/> 
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
						? <EditTheory theory = {theories.find(theory => theory.ID === currIDTheory)}
						   className = {classnames({dontShowMd: showSidebar})}
						   setTheory = {setTheories} theories = {theories}/>
						: <Col className = {classnames({dontShowMd: showSidebar}) + " notChosenPlaceholder"} >
							<p>Выберите элемент для начала работы</p></Col>
						}
					</Row>
				</TabPane>
			</TabContent>
			<div className = "customFooter possiblyHidden">
					<Button style = {{marginTop: "15px", marginLeft: "20px", width: "170px"}}
					className = "possiblyHidden"
					onClick = {() => setShowSidebar(!showSidebar)}>
						{!showSidebar ? "Открыть" : "Скрыть"} задания
					</Button>
				</div>
		</div>
	)
}
