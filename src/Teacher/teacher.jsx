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

	const [stList, setStList] = useState([]);
	const [currentStudent, setcurrentStudent] = useState({"ID": -1, "StName": ""});
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
		axios.post('/api/GetStudents', {})
			.then(res => {
				var arr = [];
				for(const prop in res.data.MapStudentIDString)
					arr.push({ID: parseInt(prop), StName: res.data.MapStudentIDString[prop]});
				setStList(arr);
			})
			.catch(err => console.log(err));
	}, [])
	

	const DisplayList = () => {
		return (
			<>
			{stList.map(student => (
				<NavItem key = {student.ID} 
				className = {classNames({chosenSidebar: currentStudent.ID === parseInt(student.ID )})}>	 
					<NavLink onClick = {() => {setcurrentStudent(student)}}>
							{student.StName}
						<span style = {{float: "right"}} onClick = {toggleEdit}>{currentStudent.ID === parseInt(student.ID) && <Pencil />}</span>
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
				<option value = {student.ID} key = {student.ID}
				selected = {student.ID === currentStudent.ID}>
					{student.StName}
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
								setcurrentStudent(stList.find(st => st.ID === parseInt(e.target.value)))
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
						currentStudent.ID !== -1
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
			<AddModal isOpen = {modalAdd} toggle = {toggleAdd}
			 stList = {stList} setStList = {setStList}/>
			<EditModal isOpen = {modalEdit} toggle = {toggleEdit}
			 student = {currentStudent} stList = {stList} setStList = {setStList}/> 
		</div>
    )
}
