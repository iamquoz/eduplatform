// warningless commit duh
// eslint-disable-next-line
import { useState, useEffect } from 'react'
import {Pie} from 'react-chartjs-2'
import axios from 'axios'
import classnames from 'classnames'

import DisplayListTheories from './theorylist'
import {
	NavItem,
	NavLink,
	Nav,
	Row, 
	Col,
} from 'reactstrap'


const PieWrapper = ({datum, className, width}) => {
	
	if (datum === undefined) 
		return <></>

	const myLabels = ["Правильно", "Неправильно"];
	const bgColor = [
		'rgba(75, 192, 192, 0.5)',
		'rgba(255, 99, 132, 0.5)'
	]
	const options = {
		maintainAspectRatio: false
	};

	var formattedTotal = {
		labels: myLabels,
		datasets: [{
			data: [
				datum.correct.reduce((a, b) => a + b, 0), 
				datum.total.reduce((a, b) => a + b, 0) - datum.correct.reduce((a, b) => a + b, 0)
			],
			backgroundColor: bgColor
		}]
	}

	var formattedEasy = {
		labels: myLabels,
		datasets: [{
			data: [datum.correct[0], datum.total[0] - datum.correct[0]],
			backgroundColor: bgColor
		}]
	}

	var formattedMedium = {
		labels: myLabels,
		datasets: [{
			data: [datum.correct[1], datum.total[1] - datum.correct[1]],
			backgroundColor: bgColor
		}]
	}

	var formattedHard = {
		labels: myLabels,
		datasets: [{
			data: [datum.correct[2], datum.total[2] - datum.correct[2]],
			backgroundColor: bgColor
		}]
	}



	return <div className = {className} style = {{textAlign: 'center'}}>
				<div className = "statsMrgn">
					<Col>
						<div style = {{textAlign: "center"}}>
							Сумма
						</div>
						<div style = {{textAlign: "center"}}>
							<Pie data = {formattedTotal} width={width} height={width} options={options}/>
						</div>
					</Col>
				</div>
					
				<div className = "statsMrgn">
					<Col>
						<div style = {{textAlign: "center"}}>
							Базовый
						</div>
						<div style = {{textAlign: "center"}}>
							<Pie data = {formattedEasy} width={width} height={width} options={options}/>
						</div>
					</Col>
				</div>
				<div className = "statsMrgn">
					<Col>
						<div style = {{textAlign: "center"}}>
							Продвинутый
						</div>
						<div style = {{textAlign: "center"}}>
							<Pie data = {formattedMedium} width={width} height={width} options={options}/>
						</div>
					</Col>
				</div>
				<div className = "statsMrgn">
					<Col>
						<div style = {{textAlign: "center"}}>
							Высокий
						</div>
						<div style = {{textAlign: "center"}}>
							<Pie data = {formattedHard} width={width} height={width} options={options}/>
						</div>
					</Col>
				</div>
				<div style = {{paddingTop: "40px", paddingLeft: "10px", paddingBottom: "80px"}}>
					Сумма всех уровней (всего / прав. / неправ.): {formattedTotal.datasets[0].data[0] + formattedTotal.datasets[0].data[1]} / {formattedTotal.datasets[0].data[0]} / {formattedTotal.datasets[0].data[1]}
					<br></br>
					Базовый уровень: {formattedEasy.datasets[0].data[0] + formattedEasy.datasets[0].data[1]} / {formattedEasy.datasets[0].data[0]} / {formattedEasy.datasets[0].data[1]}
					<br></br>
					Продвинутый уровень: {formattedMedium.datasets[0].data[0] + formattedMedium.datasets[0].data[1]} / {formattedMedium.datasets[0].data[0]} / {formattedMedium.datasets[0].data[1]}
					<br></br>
					Высокий уровень: {formattedHard.datasets[0].data[0] + formattedHard.datasets[0].data[1]} / {formattedHard.datasets[0].data[0]} / {formattedHard.datasets[0].data[1]}
					<br></br>
					<b>Количество неудачных попыток: {datum.totalAttempts}</b>
				</div>
		</div>
}


export default function Stats({student, showSidebar, windowWidth, width, setShowSidebar}) {
	const [stat, setStat] = useState([]);
	const [theories, setTheories] = useState([])
	const [currIDTheory, setCurrIDTheory] = useState(0);

	function statWrapper(res) {

		var displayedStat = {theoryid: 0, total: [0, 0, 0], correct: [0, 0, 0], totalAttempts: 0};

		res.data.forEach(element => {
			axios.get('/st/theories/' + element.theoryid)
				.then(res => setTheories(theories => [...theories, res.data]))
				.catch(err => console.log(err));
			displayedStat.totalAttempts += element.totalAttempts;
			for (let j = 0; j < 3; j++) {
				displayedStat.total[j] += element.total[j];
				displayedStat.correct[j] += element.correct[j];
			}
		})
		// res.data.unshift(displayedStat);
		// console.log(arr);
		// setStat(arr);
		setStat([displayedStat, ...res.data]);
	}

	useEffect(() => {
		setTheories([]);
		console.log(student);
		if (student.studentID === 0) {
		 	axios.get('/st/self')
		 	  	.then(res => statWrapper(res))
		 	  	.catch(err => console.log(err));
			axios.get('/st/self/done')
		 	  	.then(res => console.log(res))
		 	  	.catch(err => console.log(err));
		}
		else {
			axios.get('/api/students/' + student.studentID)
				.then(res => statWrapper(res))
		 	  	.catch(err => console.log(err));
		}
	}, [student])

	return (
		<div>
			<Row style = {{marginRight: "0px"}}>
				{(showSidebar || windowWidth > 768) && 
				<Col className = "sidebar">
					<Nav vertical>
						<NavItem className = {classnames({chosenSidebar: currIDTheory === 0})}>
							<NavLink onClick = {() => {setCurrIDTheory(0); setShowSidebar(false)}}>
								Общее
							</NavLink>
						</NavItem>
						<DisplayListTheories theories = {theories} currIDTheory = {currIDTheory} setCurrIDTheory = {setCurrIDTheory} setShowSidebar = {setShowSidebar}/>
					</Nav>
				</Col>
				}
				<Col>
					<PieWrapper datum = {stat.find(elem => elem.theoryid === currIDTheory)} className = {classnames({dontShowMd: showSidebar})} width = {width}/>
				</Col>
			</Row>
		</div>
	)
}
