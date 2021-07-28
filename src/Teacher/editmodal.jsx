import {useState} from 'react'
import {
	Modal, 
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Form,
	Input,
	FormGroup,
	Label
} from 'reactstrap'

import axios from 'axios'

export default function ModalAdd({isOpen, toggle, student}) {
	const [stName, setStName] = useState(student.stName);

	const onDelete = () => {
		axios.delete(`https://6099651699011f0017140ca7.mockapi.io/students/${student.id}`)
		.then(function (responce) {
			console.log(responce);
		})
		.catch(function (responce) {
			console.log(responce);
		})

		toggle();

	}

	const onSubmit = (e) => {
		e.preventDefault();
		
		if (stName === '') {
			alert("Введите имя");
			return;
		}
		request();
	}

	function request() {
		if (stName === '')
			return;
		
		// change for the real api
		axios.put(`https://6099651699011f0017140ca7.mockapi.io/students/${student.id}`, 
			{stName: stName, id: student.id})
			.then(function (responce) {
				console.log(responce);
				toggle();
			})
			.catch(function (responce) {
				console.log(responce)
			})
	}

	return (
		<Modal isOpen = {isOpen} toggle = {toggle}>
			{/* form is declared right here and not in ModalBody so that the onSubmit event works*/}
			<Form onSubmit = {onSubmit}>
				<ModalHeader>
					Редактирование студента
				</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label for = "fullname">Имя студента</Label>
						<Input type = "textarea" id = "fullname"
						style = {{height: "80px"}}
						onChange = {(e) => setStName(e.target.value)}
						defaultValue = {student.stName}></Input>
					</FormGroup>
				</ModalBody>
				<ModalFooter style = {{justifyContent: "space-between"}}>
					<Button onClick = {onDelete} className = "redBtn" style = {{padding: "10px 20px"}}>Удалить студента</Button>
					<Button onClick = {toggle} className = "redBtn" style = {{padding: "10px 20px"}}>Закрыть</Button>
					<Button type='submit' style = {{padding: "10px 20px"}}>Изменить</Button>
				</ModalFooter>
			</Form>
		</Modal>
	)
}
