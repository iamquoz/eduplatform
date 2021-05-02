import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import LoginPage from "./Login/LoginPage.js";
import RegisterPage from "./Login/RegisterPage.js";
import Teach from "./Teacher/teacher.js";
import Student from "./Students/student.js"


function App() {
	
	return (
			<Router>
					<ul>
						<li><Link to = "/">teacher</Link></li>
						<li><Link to = "/login">login </Link></li>
						<li><Link to = "/register">reg</Link></li>
						<li><Link to = "/student">student</Link></li>
					</ul>
				<div style = {{height: "90%"}}>
					<Switch>
						<Route path = '/login'>
							<LoginPage></LoginPage>
						</Route>
						<Route path = '/register'>
							<RegisterPage></RegisterPage>
						</Route>
						<Route path = "/student">
							<Student></Student>
						</Route>
						<Route path = "/">
							<Teach></Teach>
						</Route>
					</Switch>
				</div>
			</Router>
	);
}

export default App;
