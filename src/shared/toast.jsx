import { Toast, ToastHeader, ToastBody } from "reactstrap";

import React from 'react'

export default function CustomToast({message, error, isOpen, setIsOpen}) {
	return (
		<Toast isOpen = {isOpen} style = {{position: "absolute", "bottom": "100px", "right": "0"}} onClick = {() => setIsOpen(false)}>
			<ToastHeader style = {error && {color: "red"}}>
				{error ? "Ошибка" : "Успех"}
			</ToastHeader>
			<ToastBody>
				{message}
			</ToastBody>
		</Toast>
	)
}
