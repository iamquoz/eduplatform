// warningless commit duh
// eslint-disable-next-line
import { useState, useEffect } from 'react'
import {Pie} from 'react-chartjs-2'
import axios from 'axios'

import {
	NavItem,
	NavLink,
	Nav,
	Row, 
	Col
} from 'reactstrap'

export default function Stats({student}) {

	const [stat, setStat] = useState([]);
	const [theories, setTheories] = useState([])
	const [currIDTheory, setCurrIDTheory] = useState(0);

	const fetchTheories = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/theories/')
		return responce.data;
	}


	const fetchStats = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/stats/' + (parseInt(student.id) + 1))
		return responce.data.stat;
	}

	useEffect(() => {
		if (theories.length === 0){
			const getAll = async () => {
				const fetchedStats = await fetchStats();
				const tempTheories = await fetchTheories();
				setTheories(tempTheories);
				
				var displayedStat = {id: "0", Total: [], Correct: [], TotalAttempts: 0}

				// holy fuck this is terrible someone fix this
				displayedStat.TotalAttempts = fetchedStats.map(item => item.TotalAttempts)
					.reduce((prev, curr) => prev + curr, 0)

				for (let index = 0; index < 3; index++) {
					displayedStat.Total[index] = fetchedStats.map(item => item.Total[index])
						.reduce((prev, curr) => prev + curr)

					displayedStat.Correct[index] = fetchedStats.map(item => item.Correct[index])
						.reduce((prev, curr) => prev + curr)
				}

				fetchedStats.unshift(displayedStat);
				setStat(fetchedStats);
			}
			getAll();
		}
	})

	const PieWrapper = ({datum, myLabel}) => {
		if (datum === undefined) 
			return <></>

		const myLabels = ["Правильно", "Неправильно"];
		const bgColor = [
			'rgba(75, 192, 192, 0.5)',
			'rgba(255, 99, 132, 0.5)'
		]
		const options = {maintainAspectRatio: true, 
			responsive: true,
			title: {display: true, 
				text: "aaa", fontSize: 14}};
		var formattedTotal = {
			labels: myLabels,
			datasets: [{
				data: [
					datum.Correct.reduce((a, b) => a + b, 0), 
					datum.Total.reduce((a, b) => a + b, 0) - datum.Correct.reduce((a, b) => a + b, 0)
				],
				backgroundColor: [
					'rgba(75, 192, 192, 0.5)',
					'rgba(255, 99, 132, 0.5)'
				]
			}
			]
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



		return <div>
				<Pie data = {formattedTotal} options = {options}/> 
				<Pie data = {formattedEasy}/>
				<Pie data = {formattedMedium}/>
				<Pie data = {formattedHard}/>
			</div>
	}

	const DisplayListTheories = () => {
		return (
			<>
			{theories.map(theory => (
				<NavItem key = {theory.id} 
				className = {currIDTheory === theory.id ? "chosenSidebar" : ""}
				style = {{maxWidth: "300px"}}>	 
					<NavLink onClick = {() => setCurrIDTheory(theory.id)}>
							{theory.title}
					</NavLink>
				</NavItem>
			))}
			</>
		)
	}

	return (
		<div>
			<Row>
				<Col>
					<Nav vertical>
						<NavItem
						className = {currIDTheory === 0 && "chosenSidebar"}>
							<NavLink onClick = {() => setCurrIDTheory(0)}>
								Общее
							</NavLink>
						</NavItem>
						<DisplayListTheories/>
					</Nav>
				</Col>
				<Col>
					<PieWrapper datum = {stat[currIDTheory]}/>
				</Col>
			</Row>
		</div>
	)
}
