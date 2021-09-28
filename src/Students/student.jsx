import { Link } from 'react-router-dom';
import { auth } from '../shared/auth.jsx'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
	Navbar,
	NavbarBrand,
	TabContent,
	TabPane,
	UncontrolledTooltip,
	Button
} from 'reactstrap';
import { useGlobalEvent } from 'beautiful-react-hooks'

import Stats from '../shared/stats.jsx'
import Tasks from "./tasks.jsx";
//images 
// import bgstats from "../img/bgstats.svg"
// import bgtasks from "../img/bgtasks.svg"
import Exit from "../img/exit.svg"

export default function Student() {
	
		
	const history = useHistory();

	const [showSidebar, setShowSidebar] = useState(true);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const onWindowResize = useGlobalEvent('resize');
	const [width, setWidth] = useState(200);

	// this is fine, don't worry about it
	onWindowResize((event) => {
		setWindowWidth(window.innerWidth);
		if (width !== 150)
			setWidth(150);
	})
	
	
	const [activeTab, setActiveTab] = useState(1);
    return (
		<div>
			<Navbar color = "dark" dark>
				<NavbarBrand onClick = {() => history.push("/")} style = {{color: "white"}}>Личный кабинет</NavbarBrand>
				<div className = "iconRow">
					<Link id = "txt" onClick = {() => setActiveTab( activeTab === 2 ? 1 : 2)} 
						style={{color: 'white', paddingTop: "5px"}}>
							{activeTab === 1 ? "Задания" : "Статистика"}
					</Link>
					<UncontrolledTooltip placement= "bottom" target = "txt">
						{activeTab === 1 ? "Решайте задания, выданные преподавателем" : "Просматривайте свою статистику"}
					</UncontrolledTooltip>
					<img src = {Exit} alt = "Выйти" id = "exitic" 
					onClick = {() => auth.logout()}/>
					<UncontrolledTooltip placement= "bottom" target = "exitic">
						Выйти
					</UncontrolledTooltip>
				</div>
			</Navbar>
			<TabContent activeTab = {activeTab}>
				<TabPane tabId = {1}>
					<Stats student = {{ID: 0}} showSidebar = {showSidebar} windowWidth = {windowWidth} width = {width} setShowSidebar = {setShowSidebar}/>
				</TabPane>
				<TabPane tabId = {2}>
					<Tasks showSidebar = {showSidebar} windowWidth = {windowWidth} setShowSidebar = {setShowSidebar}/>
				</TabPane>
			</TabContent>
			<div className = "customFooter possiblyHidden">
				<Button style = {{marginTop: "15px", marginLeft: "20px", width: "170px"}}
				className = "possiblyHidden"
				onClick = {() => setShowSidebar(!showSidebar)}>
					{!showSidebar ? "Открыть" : "Скрыть"} теорию
				</Button>
			</div>
		</div>
    )
}
