import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import LoginPage from "./Login/LoginPage.jsx";
import RegisterPage from "./Login/RegisterPage.jsx";
import Teach from "./Teacher/teacher.jsx";
import Student from "./Students/student.jsx"
import Base from "./Teacher/base.jsx"
import GiveTask from "./Teacher/giveTask.jsx"

function App() {
	
	return (
			<Router>
				<div style = {{height: "100%"}}>
					<ul>
						<li><Link to = "/teacher">teacher</Link></li>
						<li><Link to = "/student">student</Link></li>
						<li><Link to = "/give">give</Link></li>
						<li><Link to = "/base">base</Link></li>
						<li><Link to = "/register">reg</Link></li>
						<li><Link to = "/">login </Link></li>
					</ul>
					<Switch>
						<Route path = "/teacher">
							<Teach></Teach>
						</Route>
						<Route path = "/student">
							<Student></Student>
						</Route>
						<Route path = "/give">
							<GiveTask></GiveTask>							
						</Route>
						<Route path = "/base">
							<Base></Base>
						</Route>
						<Route path = '/register'>
							<RegisterPage></RegisterPage>
						</Route>
						<Route path = '/'>
							<LoginPage></LoginPage>
						</Route>
					</Switch>
				</div>
			</Router>
	);
}

export default App;
