import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import LoginPage from "./Login/LoginPage.jsx";
import RegisterPage from "./Login/RegisterPage.jsx";
import Teach from "./Teacher/teacher.jsx";
import Student from "./Students/student.jsx"
import Base from "./Teacher/base.jsx"

function App() {
	
	return (
			<Router>
					<ul>
						<li><Link to = "/">teacher</Link></li>
						<li><Link to = "/login">login </Link></li>
						<li><Link to = "/register">reg</Link></li>
						<li><Link to = "/student">student</Link></li>
						<li><Link to  = "/base">base</Link></li>
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
						<Route path = "/base">
							<Base></Base>
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
