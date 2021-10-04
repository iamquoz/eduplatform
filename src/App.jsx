import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "./Login/LoginPage.jsx";
import RegisterPage from "./Login/RegisterPage.jsx";
import RestrictedRoute from './shared/restricted.jsx'
import About from './shared/about.jsx'
import NotFound from "./shared/notfound.jsx";
import { lazy, Suspense } from "react";

import Loading from './img/loading.gif'

const Teach = lazy(() => import('./Teacher/teacher'))
const Student = lazy(() => import('./Students/student'))

function App() {
	
	return (
			<Router>
				<Suspense fallback = {<div className = "container"><img src = {Loading} style = {{maxWidth: "100%"}} alt = "Подождите"/></div>}>
					<Switch>
						<RestrictedRoute path = '/teacher' component = {Teach} requiredrole = '1'/>
						<RestrictedRoute path = '/student' component = {Student} />
						<Route path = "/register" component = {RegisterPage} />
						<Route path = "/about" component = {About} />
						<Route exact path = "/" component = {LoginPage} />
						<Route component = {NotFound} />
					</Switch>
				</Suspense>
			</Router>
	);
}

export default App;
