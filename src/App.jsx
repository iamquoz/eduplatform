import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./Login/LoginPage.jsx";
import RegisterPage from "./Login/RegisterPage.jsx";
import Teach from "./Teacher/teacher.jsx";
import Student from "./Students/student.jsx"
import Base from "./Teacher/base.jsx"
import GiveTask from "./Teacher/giveTask.jsx"
import RestrictedRoute from './shared/restricted.jsx'
import About from './shared/about.jsx'

function App() {
	
	return (
			<Router>
				<Switch>
					<RestrictedRoute path = '/teacher' component = {Teach} requiredrole = '1'/>
					<RestrictedRoute path = '/handout' component = {GiveTask} requiredrole = '1'/>
					<RestrictedRoute path = '/base' component = {Base} requiredrole = '1'/>
					<RestrictedRoute path = '/student' component = {Student} />
					<Route path = "/register" component = {RegisterPage} />
					<Route path = "/about" component = {About} />
					<Route exact path = "/" component = {LoginPage} />
				</Switch>
			</Router>
	);
}

export default App;
