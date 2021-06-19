import { Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'

export default function NotFound() {
	const history = useHistory(); 

	return (
		<div className = "container" style = {{flexDirection: "column"}}>
			<h1 style = {{textAlign: "center"}}>404</h1>
			<Button style = {{marginTop: "10%", width: "100%"}}  onClick = {() => history.push('/')}>Назад</Button>
		</div>
	)
}
