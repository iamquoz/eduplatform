import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
	Navbar,
	NavbarBrand,
	UncontrolledTooltip,
	Row, Col, Nav,
	NavItem,
	NavLink,
	NavbarToggler,
	Collapse,
	TabPane,
	TabContent
} from 'reactstrap';

// images 
import AddSt from "../img/addSt.svg"
import Edit from "../img/edit.svg"
import Exit from "../img/exit.svg"
import Give from "../img/give_task.svg"
import Pencil from "../shared/Pencil"

// imports 
import ViewStudent from './viewstudent'
import AddModal from './modal'
import EditModal from './editmodal'
import classNames from 'classnames';
import { auth } from '../shared/auth';
import Handout from './giveTask'
import Base from './base'

export default function Teach() {
	const history = useHistory();

	const [currID, setCurrID] = useState(-1);
	const [stList, setStList] = useState([]);
	const [currentStudent, setcurrentStudent] = useState({"id": "0", "stName": ""});
	const [barOpen, setBarOpen] = useState(false);

	// modal adding
	const [modalAdd, setModalAdd] = useState(false);
	const toggleAdd = () => setModalAdd(!modalAdd);

	// modal edit
	const [modalEdit, setModalEdit] = useState(false);
	const toggleEdit = () => setModalEdit(!modalEdit);

	// tabs
	const [activeTab, setActiveTab] = useState(1);

	useEffect(() => {
		const getStudents = async () => {
			const students = await fetchStudents();
			setStList(students)
		}
		getStudents()
	}, [])
	
	const fetchStudents = async () => {
		axios.post('/api/Flop', {})
			.then(res => console.log(res))
			.catch(err => console.log(err));
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/students/')
		return responce.data;
	}

	const DisplayList = () => {
		return (
			<>
			{stList.map(student => (
				<NavItem key = {student.id} 
				className = {classNames({chosenSidebar: currID === parseInt(student.id - 2)})}>	 
					<NavLink onClick = {() => {
						setCurrID(student.id - 2)
						setcurrentStudent(stList.find(st => st.id === student.id)) 
						}}>
							{student.stName}
						<span style = {{float: "right"}} onClick = {toggleEdit}>{currID === parseInt(student.id - 2) && <Pencil />}</span>
					</NavLink>
				</NavItem>
			))}
			</>
		)
	}

	const DisplayMobileList = () => {
		return (
			<>
			{stList.map(student => (
				<option value = {student.id} key = {student.id}
				selected = {student.id - 2 === parseInt(currID)}>
					{student.stName}
				</option>
			))}
			</>
		)
	}
	
    return (
		<div>
			<Navbar color = "dark" dark expand = "md">
				<NavbarBrand style = {{color: "white"}} onClick = {() => history.push("/")}>Личный кабинет</NavbarBrand>
				<NavbarToggler onClick = {() => setBarOpen(!barOpen)}></NavbarToggler>
				<Collapse isOpen = {barOpen} navbar>
					{ activeTab === 1 &&
						<select className = "form-control possiblyHidden" style = {{margin: "10px 0"}}
							onChange = {(e) => {
								setCurrID(e.target.value - 2)
								setcurrentStudent(stList.find(st => st.id === e.target.value))
							}}>
							<option value = "" disabled selected>Выберите студента</option>
							<DisplayMobileList />
						</select>
					}	
						<Nav navbar>
							<li className = "iconRow" style = {{color: "#fff"}} onClick = {() => setActiveTab(2)}>
								<img src = {Give} alt = "Выдать задания" id = "giveic"/>
								{barOpen && <span>Выдать задание</span>}
							</li>
							<li className = "iconRow" style = {{color: "#fff"}} onClick = {() => setActiveTab(3)}>
								<img src = {Edit} alt = "Редактировать базу заданий" id = "editic"/>
								{barOpen && <span>Редактировать базу заданий</span>}
							</li>
							<li className = "iconRow" style = {{color: "#fff"}} onClick = {toggleAdd}>
								<img src = {AddSt} alt = "Добавить студента" id = "addst"/>
								{barOpen && <span>Добавить студента</span>}
							</li>
							<li className = "iconRow" style = {{color: "#fff"}} onClick = {() => auth.logout()}>
								<img src = {Exit} alt = "Выйти" id = "exitic"/>
								{barOpen && <span>Выйти</span>}
							</li>

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
					</Nav>
				</Collapse>
			</Navbar>
			<TabContent activeTab = {activeTab}>
				<TabPane tabId = {1}>
					<Row style = {{marginRight: "0"}}>
						<Col className = "sidebar dontShowMd">
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
						? <ViewStudent student = {currentStudent} />
						: <Col className = "notChosenPlaceholder">
							<p className = "dontShowMd">Нажмите на элемент слева для начала работы</p>
							<p className = "possiblyHidden" style = {{textAlign: "center"}}>Список студентов доступен в выпадающем меню</p>
						</Col>
						}
					</Row>
				</TabPane>
				<TabPane tabId = {2}>
					<Handout />
				</TabPane>
				<TabPane tabId = {3}>
					<Base />
				</TabPane>
			</TabContent>
			<AddModal isOpen = {modalAdd} toggle = {toggleAdd}/>
			<EditModal isOpen = {modalEdit} toggle = {toggleEdit} student = {currentStudent}/> 
		</div>
    )
}
