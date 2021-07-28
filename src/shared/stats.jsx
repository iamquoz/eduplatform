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
	Col
} from 'reactstrap'

export default function Stats({student, showSidebar, windowWidth, width, setShowSidebar}) {
	
	const [stat, setStat] = useState([]);
	const [theories, setTheories] = useState([])
	const [currIDTheory, setCurrIDTheory] = useState(0);
	const [currIDstudent, setCurrIDstudent] = useState(0);

	
	const fetchTheories = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/theories/')
		return responce.data;
	}


	const fetchStats = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/stats/' + student.id);
		return responce.data.stat;
	}
	
	useEffect(() => {
		setCurrIDstudent(parseInt(student.id));
		if (currIDstudent !== parseInt(student.id)){
			const getAll = async () => {
				const fetchedStats = await fetchStats();
				const tempTheories = await fetchTheories();
				setTheories(tempTheories);
				
				var displayedStat = {id: "0", Total: [0, 0, 0], Correct: [0, 0, 0], TotalAttempts: 0}

				for (let i = 0; i < fetchedStats.length; i++) {
					displayedStat.TotalAttempts += fetchedStats[i].TotalAttempts;
					for (let j = 0; j < 3; j++) {
						displayedStat.Total[j] += fetchedStats[i].Total[j];
						displayedStat.Correct[j] += fetchedStats[i].Correct[j];
					}
					
				}

				fetchedStats.unshift(displayedStat);
				setStat(fetchedStats);
			}
			getAll();
		}
	}, [student])

	const PieWrapper = ({datum, className}) => {
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
					datum.Correct.reduce((a, b) => a + b, 0), 
					datum.Total.reduce((a, b) => a + b, 0) - datum.Correct.reduce((a, b) => a + b, 0)
				],
				backgroundColor: bgColor
			}]
		}

		var formattedEasy = {
			labels: myLabels,
			datasets: [{
				data: [datum.Correct[0], datum.Total[0] - datum.Correct[0]],
				backgroundColor: bgColor
			}]
		}

		var formattedMedium = {
			labels: myLabels,
			datasets: [{
				data: [datum.Correct[1], datum.Total[1] - datum.Correct[1]],
				backgroundColor: bgColor
			}]
		}

		var formattedHard = {
			labels: myLabels,
			datasets: [{
				data: [datum.Correct[2], datum.Total[2] - datum.Correct[2]],
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
						<b>Количество неудачных попыток: {datum.TotalAttempts}</b>
					</div>
			</div>
	}

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
					<PieWrapper datum = {stat[currIDTheory]} className = {classnames({dontShowMd: showSidebar})}/>
				</Col>
			</Row>
		</div>
	)
}
