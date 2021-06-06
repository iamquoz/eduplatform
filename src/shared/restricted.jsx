import { Route, Redirect } from 'react-router-dom'
import { auth } from './auth.jsx'


export default function RestrictedRoute( {component: Component, requiredrole} ) {
	return (
		<Route render = {
			props => {
				const current = auth.currUserValue;
				console.log(Component, current, requiredrole);
				if (!current)
					return <Redirect to = {{pathname: '/'}} />

				if (requiredrole && requiredrole !== current.id)
					return <Redirect to = {{pathname: '/'}} />

				return <Component />
			}
		}/>
	)
}
