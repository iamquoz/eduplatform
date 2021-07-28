import { useEffect, useState } from 'react'
import axios from 'axios' 
import { 
	Nav, 
	Row, Col,
	Label,
	Input,
	Form,
	FormGroup,
	Button
} from 'reactstrap'
import TheoryList from '../shared/theorylist'
import ReactMarkdown from 'react-markdown'


export default function Tasks({student, showSidebar, windowWidth, setShowSidebar}) {

	const [theories, setTheories] = useState([])
	const [currIDTheory, setCurrIDTheory] = useState(0);
	const [arrOfTasks, setArrOfTasks] = useState([]);

	const [currentTaskID, setCurrentTaskID] = useState(0);
	const [countWrong, setCountWrong] = useState(0);

	const [answer, setAnswer] = useState('');

	const onSubmit = (e) => {
		e.preventDefault();

		if (answer !== arrOfTasks[currentTaskID]) {
			setCountWrong(countWrong + 1);
		}

		if (countWrong === 3) {
			setCurrentTaskID(currentTaskID + 1);
			setCountWrong(0);
		}

		alert(answer);
	}
	
	var arrOfTaskIDs = [1, 3, 5, 6, 10, 13, 15, 20];

	const fetchIndivTask = async (id) => {
		const responce = await axios.get(`https://6099651699011f0017140ca7.mockapi.io/tasks/${id}`)
		return responce.data;
	}

	const fetchTheories = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/theories/')
		return responce.data;
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	useEffect(() => {
		console.log("eff");
		const getAll = async () => {
			const tempTheories = await fetchTheories();
			setTheories(tempTheories);

			for (let i = 0; i < arrOfTaskIDs.length; i++) {
				var task = await fetchIndivTask(arrOfTaskIDs[i]);
				setArrOfTasks(arrOfTasks => [...arrOfTasks, task]);
				await sleep(2000);
			}
		}
			getAll();
	}, [])

	return (
		<Row style = {{marginRight: "0px"}}>
			{(showSidebar || windowWidth > 768) && 
				<Col className = "sidebar">
				<Nav vertical>
					<TheoryList theories = {theories} currIDTheory = {currIDTheory} setCurrIDTheory = {setCurrIDTheory} setShowSidebar = {setShowSidebar}/>
				</Nav>
			</Col>
			}
			<Col>
				{ currIDTheory !== 0 &&
				<div style = {{paddingTop: "20px", paddingLeft: "15px"}}>
					<ReactMarkdown  parserOptions={{ commonmark: true }} children = {theories.find(theory => theory.id === currIDTheory).text} />
					<hr />
					<Form onSubmit = {onSubmit}>
						<FormGroup>
							<Label>{arrOfTasks[currentTaskID].text}</Label>
							<hr />
							<Input onChange = {(e) => setAnswer(e.target.value)}
							placeholder = "Введите ответ"
							type = "textarea" key = {currentTaskID}
							style = {{height: "200px"}}>
							</Input>
						</FormGroup>
						<Row>
							<Col style = {{alignSelf: "center"}}>
								<span> Количество оставшихся попыток: {3 - countWrong} </span>
								<br />
								{countWrong === 3 && <span><b>Правильный ответ:</b> {arrOfTasks[currentTaskID].answer}</span>}
							</Col>
							<Col>
								<Button type = "submit" style = {{float: "right", padding: "10px 20px"}}>{countWrong === 3 ? "Следующий вопрос" : "Ответить"}</Button>
							</Col>
						</Row>
					</Form>
				</div> 
				} 
			</Col>
		</Row>
	)
}
