import React from 'react'
import {NavItem, NavLink} from 'reactstrap'
import classnames from 'classnames'

export default function DisplayListTheories ({theories, currIDTheory, setCurrIDTheory, setShowSidebar}) {
	return (
		<>
		{theories.map(theory => (
			<NavItem key = {theory.ID} 
			className = {classnames({chosenSidebar: currIDTheory === theory.ID})}>	 
				<NavLink onClick = {() => {setCurrIDTheory(theory.ID); setShowSidebar(false)}}>
						{theory.Header}
				</NavLink>
			</NavItem>
		))}
		</>
	)
}
