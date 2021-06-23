import {useState} from 'react'
import classnames from 'classnames'

import {
	TabPane, 
	TabContent,
	Nav, 
	NavItem,
	NavLink,
	Col, 
	Button
} from 'reactstrap'
import { useGlobalEvent } from 'beautiful-react-hooks'

import Stats from '../shared/stats.jsx'

export default function ViewStudent({student}) {
	const [activeTab, setActiveTab] = useState(1);


	const [showSidebar, setShowSidebar] = useState(true);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [width, setWidth] = useState(0);
	const onWindowResize = useGlobalEvent('resize');

	// this is fine, don't worry about it
	onWindowResize((event) => {
		setWindowWidth(window.innerWidth);
		if (width !== 150)
			setWidth(150);
	})


	const toggle = tab => {
		if (activeTab !== tab) 
			setActiveTab(tab);
	}

	return (
		<Col style = {{paddingRight: "0", marginBottom: "30px"}} >
			<Nav tabs className = "tabWrapper">
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 1 })}
						onClick={() => { toggle(1); }} >
						Статистика
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						className={classnames({ active: activeTab === 2 })} 
						onClick={() => { toggle(2); }}>
						Задания
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={activeTab}>
				<TabPane tabId = {1}>
					<Stats student = {student} showSidebar = {showSidebar} windowWidth = {windowWidth} width = {width}/>
				</TabPane>
				<TabPane tabId = {2}>
					{student.stName}
				</TabPane>
			</TabContent>
			<div className = "customFooter possiblyHidden">
				<Button style = {{marginTop: "15px", marginLeft: "20px", width: "170px"}}
				className = "possiblyHidden"
				onClick = {() => setShowSidebar(!showSidebar)}>
					{!showSidebar ? "Открыть" : "Скрыть"} теорию
				</Button>
			</div>
		</Col>
	)
}
