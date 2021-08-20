// up ahead is possibly the worse react/js code you've ever seen
// im sorry
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


export default function Tasks({showSidebar, windowWidth, setShowSidebar}) {

	const [theories, setTheories] = useState([])
	const [currIDTheory, setCurrIDTheory] = useState(0);
	const [arrOfTasks, setArrOfTasks] = useState([]);

	const [currentTaskID, setCurrentTaskID] = useState([]);

	const [answer, setAnswer] = useState('');

	const onSubmit = (e) => {
		e.preventDefault();

		var task = arrOfTasks.filter(elem => elem.TheoryID === currIDTheory)[currentTaskID.find(a => a.TheoryID === currIDTheory).index].Task;

		task.Correct = answer;

		axios.post('/api/StSendAnswers', {TaskID: task.ID, Task: task})
			.then(res => {
				setCurrentTaskID(currentTaskID.map(element => {
					return element.TheoryID === currIDTheory ? {...element, attempts: Object.values({...element.attempts, [element.index]: res.data.Int})} : element
				}))
				if (res.data.Int === 0) {
					if (task.IsOpen === false) {
						axios.post('/api/StGetAnswers', {TaskID: task.ID})
							.then(res => {
								setCurrentTaskID(currentTaskID.map(element => {
									return element.TheoryID === currIDTheory ? {...element, correct: res.data.Task.Answer} : element
								}))
							})
					}
				}
				else if (res.data.Int === -2) {
					
				}
			})
			.catch(err => console.log(err));
	}

	useEffect(() => {
		axios.post('/api/StSent', {})
			.then(res => {
				var arr = [];
				for(const prop in res.data.MapTheoryIDSentstructArray) {
					arr.push({TheoryID: parseInt(prop), TaskIDs: res.data.MapTheoryIDSentstructArray[prop].map(e => e.TaskID)});
					setCurrentTaskID(currentTaskID => [...currentTaskID, {TheoryID: parseInt(prop), index: 0, correct: '', attempts: res.data.MapTheoryIDSentstructArray[prop].map(e => 3 - e.Tries)}]);
				}

				arr.forEach(element => {
					axios.post('/api/StGetTheory', {TheoryID: element.TheoryID})
						.then(res => setTheories(theories => [...theories, res.data.Theory]))
						.catch(err => console.log(err));

					element.TaskIDs.forEach(elem => {
						axios.post('/api/StGetTask', {TaskID: elem})
							.then(res => {
								res.data.Task.ID = elem;
								setArrOfTasks(arrOfTasks => [...arrOfTasks, {TheoryID: element.TheoryID, Task: res.data.Task}]);
							})
							.catch(err => console.log(err));
					})

				});
			})
			.catch(err => console.log(err));
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
					<ReactMarkdown  parserOptions={{ commonmark: true }} children = {theories.find(theory => theory.ID === currIDTheory).Body} />
					<hr />
					<Form onSubmit = {onSubmit}>
						<FormGroup>
							<Label>{arrOfTasks.filter(elem => elem.TheoryID === currIDTheory)[currentTaskID.find(a => a.TheoryID === currIDTheory).index].Task.Question}</Label>
							<hr />
							<Input onChange = {(e) => setAnswer(e.target.value)}
							 placeholder = "Введите ответ"
							 type = "textarea" key = {currentTaskID}
							 style = {{height: "200px"}}>
							</Input>
						</FormGroup>
						<Row>
							<Col style = {{alignSelf: "center"}}>
								{
								!arrOfTasks.filter(elem => elem.TheoryID === currIDTheory)[currentTaskID.find(a => a.TheoryID === currIDTheory).index].Task.IsOpen 
								? <>
									{
										currentTaskID.find(a => a.TheoryID === currIDTheory).attempts[currentTaskID.find(a => a.TheoryID === currIDTheory).index] === -2 ?
										  <span style = {{color: 'green'}}>Правильный ответ!</span>
										: <span> Количество оставшихся попыток: {currentTaskID.find(a => a.TheoryID === currIDTheory).attempts[currentTaskID.find(a => a.TheoryID === currIDTheory).index]} </span>
									}
									<br />
									{currentTaskID.find(a => a.TheoryID === currIDTheory).attempts[currentTaskID.find(a => a.TheoryID === currIDTheory).index] === 0 && <span><b>Правильный ответ:</b> {currentTaskID.find(a => a.TheoryID === currIDTheory).correct}</span>}
								  </>
								: <span>Открытое задание: одна попытка</span>
								}
							</Col>
							<Col>
								<Button type = "submit" style = {{float: "right", padding: "10px 20px"}}>
									{currentTaskID.find(a => a.TheoryID === currIDTheory).attempts[currentTaskID.find(a => a.TheoryID === currIDTheory).index] === 0 || currentTaskID.find(a => a.TheoryID === currIDTheory).attempts[currentTaskID.find(a => a.TheoryID === currIDTheory).index] === -2 || arrOfTasks.filter(elem => elem.TheoryID === currIDTheory)[currentTaskID.find(a => a.TheoryID === currIDTheory).index].Task.IsOpen  ? "Следующий вопрос" : "Ответить"}
								</Button>
							</Col>
						</Row>
					</Form>
				</div> 
				} 
			</Col>
		</Row>
	)
}
