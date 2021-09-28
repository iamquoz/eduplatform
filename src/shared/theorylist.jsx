import React from 'react'
import {NavItem, NavLink} from 'reactstrap'
import classnames from 'classnames'

export default function DisplayListTheories ({theories, currIDTheory, setCurrIDTheory, setShowSidebar}) {
	return (
		<>
		{theories.map(theory => ( 
			<NavItem key = {theory.theoryid} 
			className = {classnames({chosenSidebar: currIDTheory === theory.theoryid})}>	 
				<NavLink onClick = {() => {setCurrIDTheory(theory.theoryid); setShowSidebar(false)}}>
						{theory.title}
				</NavLink>
			</NavItem>
		))}
		</>
	)
}
