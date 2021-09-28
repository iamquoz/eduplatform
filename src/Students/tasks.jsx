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

		var task = arrOfTasks.filter(elem => elem.theoryid === currIDTheory)[currentTaskID.find(a => a.theoryid === currIDTheory).index].task;

		task.Correct = answer;

		axios.post('/st/assignment', {theoryid: currIDTheory, task: task})
			.then(res => {
				setCurrentTaskID(currentTaskID.map(element => {
					return element.theoryid === currIDTheory ? {...element, tries: Object.values({...element.tries, [element.index]: res.data.tries})} : element
				}))
				if (res.data.Int === 0) {
					if (task.isOpen === false) {
						axios.post('/api/StGetAnswers', {TaskID: task.ID})
							.then(res => {
								setCurrentTaskID(currentTaskID.map(element => {
									return element.theoryid === currIDTheory ? {...element, correct: res.data.Task.Answer} : element
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
		setTheories([]);
		axios.get('/st/assignment')
			.then(res => {
				console.log(res);
				var arr = res.data;
			
				arr.forEach(element => {
					setCurrentTaskID(currentTaskID => [...currentTaskID, {theoryid: element.theoryid, index: 0, correct: '', tries: element.tries.map(e => 3 - e)}])
					axios.get('/st/theories/' + element.theoryid)
						.then(res => setTheories(theories => [...theories, res.data]))
						.catch(err => console.log(err));

					element.tasks.forEach(elem => {
						axios.get('/st/tasks/' + elem)
							.then(res => {
								console.log(res);
								setArrOfTasks(arrOfTasks => [...arrOfTasks, {theoryid: element.theoryid, task: res.data}]);
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
					<ReactMarkdown  parserOptions ={{ commonmark: true }} children = {theories.find(theory => theory.theoryid === currIDTheory).body} />
					<hr />
					<Form onSubmit = {onSubmit}>
						<FormGroup>
							<Label>{arrOfTasks.filter(elem => elem.theoryid === currIDTheory)[currentTaskID.find(a => a.theoryid === currIDTheory).index].task.question}</Label>
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
								!arrOfTasks.filter(elem => elem.theoryid === currIDTheory)[currentTaskID.find(a => a.theoryid === currIDTheory).index].task.isOpen 
								? <>
									{
										currentTaskID.find(a => a.theoryid === currIDTheory).tries[currentTaskID.find(a => a.theoryid === currIDTheory).index] === -2 ?
										  <span style = {{color: 'green'}}>Правильный ответ!</span>
										: <span> Количество оставшихся попыток: {currentTaskID.find(a => a.theoryid === currIDTheory).tries[currentTaskID.find(a => a.theoryid === currIDTheory).index]} </span>
									}
									<br />
									{currentTaskID.find(a => a.theoryid === currIDTheory).tries[currentTaskID.find(a => a.theoryid === currIDTheory).index] === 0 && <span><b>Правильный ответ:</b> {currentTaskID.find(a => a.theoryid === currIDTheory).correct}</span>}
								  </>
								: <span>Открытое задание: одна попытка</span>
								}
							</Col>
							<Col>
								<Button type = "submit" style = {{float: "right", padding: "10px 20px"}}>
									{currentTaskID.find(a => a.theoryid === currIDTheory).tries[currentTaskID.find(a => a.theoryid === currIDTheory).index] === 0 || currentTaskID.find(a => a.theoryid === currIDTheory).tries[currentTaskID.find(a => a.theoryid === currIDTheory).index] === -2 || arrOfTasks.filter(elem => elem.theoryid === currIDTheory)[currentTaskID.find(a => a.theoryid === currIDTheory).index].task.isOpen  ? "Следующий вопрос" : "Ответить"}
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
