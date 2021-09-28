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
	TabContent,
	TabPane
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


export default function Stats({student, showSidebar, windowWidth, width, setShowSidebar}) {
	const [stat, setStat] = useState([]);
	const [theories, setTheories] = useState([])
	const [currIDTheory, setCurrIDTheory] = useState(0);

	const [tab, setTab] = useState(1);

	function statWrapper(res) {
		console.log(res);
		var arr = [];
		for (const prop in res.data.MapTheoryIDStats) {
			arr.push(
				{
				   	TheoryID: parseInt(prop), 
					Correct: res.data.MapTheoryIDStats[prop].Correct, 
					Total: res.data.MapTheoryIDStats[prop].Total, 
					TotalAttempts: res.data.MapTheoryIDStats[prop].TotalAttempts
				})
		}
		var displayedStat = {TheoryID: 0, Total: [0, 0, 0], Correct: [0, 0, 0], TotalAttempts: 0};
		console.log(arr);
		arr.forEach(element => {
			axios.post('/api/StGetTheory', {TheoryID: element.TheoryID})
				.then(res => setTheories(theories => [...theories, res.data.Theory]))
				.catch(err => console.log(err));
			displayedStat.TotalAttempts += element.TotalAttempts;
			for (let j = 0; j < 3; j++) {
				displayedStat.Total[j] += element.Total[j];
				displayedStat.Correct[j] += element.Correct[j];
			}
		})
		arr.unshift(displayedStat);
		console.log(arr);
		setStat(arr);
	}

	useEffect(() => {
		// setTheories([]);
		// if (student.ID === 0) {
		//  	axios.get('/st/self')
		//  	  	.then(res => statWrapper(res))
		//  	  	.catch(err => console.log(err));
		// 	axios.get('/st/self/done')
		//  	  	.then(res => console.log(res))
		//  	  	.catch(err => console.log(err));
		// }
		// else {
		// 	axios.get('/api/students/' + student.ID)
		// 		.then(res => statWrapper(res))
		//  	  	.catch(err => console.log(err));
		// }
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
					<Nav tabs className = "tabWrapper">
						<NavItem>
							<NavLink
								className={classnames({ active: tab === 1 })}
								onClick={() => { setTab(1); }} >
								Статистика
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className={classnames({ active: tab === 2 })} 
								onClick={() => { setTab(2); }}>
								Все задания
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent activeTab={tab}>
						<TabPane tabId = {1}>
							<PieWrapper datum = {stat.find(elem => elem.TheoryID === currIDTheory)} className = {classnames({dontShowMd: showSidebar})} width = {width}/>
						</TabPane>
						<TabPane tabId = {2}>
							{student.StName}
						</TabPane>
					</TabContent>
				</Col>
			</Row>
		</div>
	)
}
