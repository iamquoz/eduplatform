/* eslint-disable */
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
	Navbar,
	NavbarBrand,
	UncontrolledTooltip,
	Row,
	Col,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';
/* eslint-enable */

//images 
import AddSt from "../img/addSt.svg"
import Edit from "../img/edit.svg"
import Exit from "../img/exit.svg"
import Give from "../img/give_task.svg"


//imports 
import ViewStudent from './viewstudent.jsx'

export default function Teach() {
	const [currID, setCurrID] = useState(-1)
	const [stList, setStList] = useState([]);

	useEffect(() => {
		const getStudents = async () => {
			const students = await fetchStudents();
			setStList(students)
		}
		getStudents()
	}, [])
	
	const fetchStudents = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/students/')
		return responce.data;
	}

	const DisplayList = () => {
		return (
			<>
			{stList.map(student => (
				<NavItem key = {student.id} 
				className = {currID === student.id && "chosenSidebar"}>	 
					<NavLink onClick = {() => setCurrID(student.id)}>
							{student.stName}
					</NavLink>
				</NavItem>
			))}
			</>
		)
	}
	
    return (
		<div>
			<Navbar color = "dark" dark>
				<NavbarBrand href = "/">Личный кабинет</NavbarBrand>
				<div className = "iconRow">
					<img src = {Give} alt = "Выдать задания" id = "giveic"/>
					<img src = {Edit} alt = "Редактировать базу заданий" id = "editic"/>
					<img src = {AddSt} alt = "Добавить студента" id = "addst"/>
					<img src = {Exit} alt = "Выйти" id = "exitic"/>

					{// causes the transition and findDOMNode warnngs 
					}
					<UncontrolledTooltip placement= "bottom" target = "addst">
						Добавить студента
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "editic">
						Редактировать базу заданий
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "giveic">
						Выдать задания
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "exitic">
						Выйти
					</UncontrolledTooltip>
				</div>
			</Navbar>
			<Row style = {{marginRight: "0"}}>
				<Col className = "sidebar">
					<Nav vertical>
						<NavItem><NavLink>Список студентов</NavLink></NavItem>
						<NavItem>
							<div className = "dropdown-divider"></div>
						</NavItem>
						<DisplayList />
					</Nav>
				</Col>
				{ 
				currID !== -1
				? <ViewStudent student = {stList[currID]} />
				: <Col className = "notChosenPlaceholder">
					<p>Нажмите на элемент слева для начала работы</p>
				  </Col>
				}
			</Row>
		</div>
		
    )
}
