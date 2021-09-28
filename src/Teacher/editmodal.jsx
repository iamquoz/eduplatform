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

export default function ModalAdd({isOpen, toggle, student, stList, setStList}) {
	const [stName, setStName] = useState(student.studentName);

	const onDelete = () => {
		axios.delete('/api/students/' + student.studentID)
			.then(_ => {
				setStList(stList.filter(st => st.ID !== student.studentID));
				toggle();
			})
			.catch(err => console.log(err));
		
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

		axios.patch('/api/students/' + student.studentID, {name: stName})
			.then(res => setStList(stList.map(e => e.studentID === student.studentID ? {studentID: student.studentID, studentName: stName} : e)))
			.catch(err => console.log(err));
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
						defaultValue = {student.studentName}></Input>
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
