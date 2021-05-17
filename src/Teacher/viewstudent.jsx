import {useState} from 'react'
import classnames from 'classnames'

import {
	TabPane, 
	TabContent,
	Nav, 
	NavItem,
	NavLink,
	Col
} from 'reactstrap'

import Stats from '../shared/stats.jsx'

export default function ViewStudent({student}) {

	const [activeTab, setActiveTab] = useState(1);

	const toggle = tab => {
		if (activeTab !== tab) 
			setActiveTab(tab);
	}

	return (
		<Col>
			<Nav tabs style = {{marginBottom: "25px", flexDirection: "column"}}>
				<NavItem style = {{width: "100%", textAlign: "center"}}>
					<NavLink
						className={classnames({ active: activeTab === 1 })}
						style = {activeTab === 1 ? {color: "#fff", backgroundColor: '#343a40'} : {}}
						onClick={() => { toggle(1); }} >
						Статистика
					</NavLink>
				</NavItem>
				<NavItem style = {{width: "100%", textAlign: "center"}}>
					<NavLink
						className={classnames({ active: activeTab === 2 })} 
						style = {activeTab === 2 ? {color: "#fff", backgroundColor: '#343a40'} : {}}
						onClick={() => { toggle(2); }}>
						Задания
					</NavLink>
				</NavItem>
			</Nav>
			<TabContent activeTab={activeTab}>
				<TabPane tabId = {1}>
					<Stats student = {student}/>
				</TabPane>
				<TabPane tabId = {2}>
					{student.stName}
				</TabPane>
			</TabContent>
		</Col>
	)
}
