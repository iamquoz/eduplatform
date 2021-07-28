import React from 'react'
import {NavItem, NavLink} from 'reactstrap'
import classnames from 'classnames'

export default function DisplayListTheories ({theories, currIDTheory, setCurrIDTheory, setShowSidebar}) {
	return (
		<>
		{theories.map(theory => (
			<NavItem key = {theory.id} 
			className = {classnames({chosenSidebar: currIDTheory === theory.id})}>	 
				<NavLink onClick = {() => {setCurrIDTheory(theory.id); setShowSidebar(false)}}>
						{theory.title}
				</NavLink>
			</NavItem>
		))}
		</>
	)
}
