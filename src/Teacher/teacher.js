/* eslint-disable */
import { Link } from 'react-router-dom';
import {
	Navbar,
	NavbarBrand,
	UncontrolledTooltip
} from 'reactstrap';
/* eslint-enable */

//images 
import AddT from "../img/addT.svg";
import AddTh from "../img/addTh.svg"
import AddSt from "../img/addSt.svg"
import Edit from "../img/edit.svg"
import Exit from "../img/exit.svg"
import Give from "../img/give_task.svg"

export default function Teach() {
    return (
		<div>
			<Navbar color = "dark" dark>
				<NavbarBrand href = "/">Личный кабинет</NavbarBrand>
				<div className = "iconRow">
					<img src = {Give} alt = "Выдать задания" id = "giveic"/>
					<img src = {Edit} alt = "Редактировать базу" id = "editic"/>
					<img src = {AddSt} alt = "Добавить студента" id = "addst"/>
					<img src = {AddT} alt = "Добавить задание" id = "addt"/>
					<img src = {AddTh} alt = "Добавить теорию" id = "addth"/>
					<img src = {Exit} alt = "Выйти" id = "exitic"/>

					<UncontrolledTooltip placement= "bottom" target = "addt">
						Добавить задание
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "addth">
						Добавить теорию
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "addst">
						Добавить студента
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "editic">
						Редактировать базу
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "giveic">
						Выдать задания
					</UncontrolledTooltip>
					<UncontrolledTooltip placement= "bottom" target = "exitic">
						Выйти
					</UncontrolledTooltip>
				</div>
			</Navbar>
			<div className = "teacherList">
				<h2>Список студентов:</h2>
			</div>
		</div>
    )
}