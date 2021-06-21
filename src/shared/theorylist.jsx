import React from 'react'
import {NavItem, NavLink} from 'reactstrap'

export default function DisplayListTheories ({theories, currIDTheory, setCurrIDTheory}) {
	return (
		<>
		{theories.map(theory => (
			<NavItem key = {theory.id} 
			className = {currIDTheory === theory.id ? "chosenSidebar" : ""}
			style = {{maxWidth: "300px"}}>	 
				<NavLink onClick = {() => setCurrIDTheory(theory.id)}>
						{theory.title}
				</NavLink>
			</NavItem>
		))}
		</>
	)
}
