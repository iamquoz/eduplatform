import { Route, Redirect } from 'react-router-dom'

export default function RestrictedRoute( {component: Component, requiredrole} ) {
	return (
		<Route render = {
			props => {
				const current = localStorage.getItem('account');
				if (!current)
					return <Redirect to = {{pathname: '/'}} />

				if (requiredrole && requiredrole !== current)
					return <Redirect to = {{pathname: '/'}} />

				return <Component />
			}
		}/>
	)
}
