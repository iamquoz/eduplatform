import { Link } from 'react-router-dom';
import { auth } from '../shared/auth.jsx'

import {
	Navbar,
	NavbarBrand,
	UncontrolledTooltip
} from 'reactstrap';
import Stats from '../shared/stats.jsx'

//images 
// import bgstats from "../img/bgstats.svg"
// import bgtasks from "../img/bgtasks.svg"
import Exit from "../img/exit.svg"

export default function Student() {

    return (
		<div>
			<Navbar color = "dark" dark>
				<NavbarBrand href = "/">Личный кабинет</NavbarBrand>
				<div className = "iconRow">
					<Link id = "tasktxt" to = "/student" style={{color: 'white', paddingTop: "5px"}}>Задания</Link>
					<UncontrolledTooltip placement= "bottom" target = "tasktxt">
						Решайте задания, выданные преподавателем
					</UncontrolledTooltip>
					<img src = {Exit} alt = "Выйти" id = "exitic" onClick = {() => auth.logout()}/>
					<UncontrolledTooltip placement= "bottom" target = "exitic">
						Выйти
					</UncontrolledTooltip>
				</div>
			</Navbar>
			<Stats student = {{"id": auth.currUserValue.id}}/>
		</div>
    )
}
