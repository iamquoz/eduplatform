import { useEffect, useState } from 'react'
import axios from 'axios' 
import { Nav, Row, Col } from 'reactstrap'
import TheoryList from '../shared/theorylist'
import ReactMarkdown from 'react-markdown'


export default function Tasks({student, showSidebar, windowWidth}) {

	const [theories, setTheories] = useState([])
	const [currIDTheory, setCurrIDTheory] = useState(0);

	const fetchTheories = async () => {
		const responce = await axios.get('https://6099651699011f0017140ca7.mockapi.io/theories/')
		return responce.data;
	}

	useEffect(() => {
		const getAll = async () => {
			const tempTheories = await fetchTheories();
			setTheories(tempTheories);
		}
			getAll();
	}, [])

	return (
		<Row style = {{marginRight: "0px"}}>
			{(showSidebar || windowWidth > 768) && 
				<Col className = "sidebar">
				<Nav vertical>
					<TheoryList theories = {theories} currIDTheory = {currIDTheory} setCurrIDTheory = {setCurrIDTheory}/>
				</Nav>
			</Col>
			}
			<Col>
				{ currIDTheory !== 0 && 
				<ReactMarkdown  parserOptions={{ commonmark: true }} children = {theories.find(theory => theory.id === currIDTheory).text} />}
			</Col>
		</Row>
	)
}
