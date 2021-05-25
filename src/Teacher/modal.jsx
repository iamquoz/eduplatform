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

export default function ModalAdd({isOpen, toggle}) {

	const [stName, setStName] = useState('');
	const [inviteLink, setInviteLink] = useState('')

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
		axios.post('https://6099651699011f0017140ca7.mockapi.io/students', 
			{stName: stName})
			.then(function (responce) {
				console.log(responce.data.id);
				setInviteLink(`${window.location.origin + '/register?id=' + responce.data.id}`);
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
					Добавление студента
				</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label for = "fullname">Имя студента</Label>
						<Input type = "textarea" id = "fullname"
						style = {{height: "80px"}}
						onChange = {(e) => setStName(e.target.value)}
						placeholder = "Введите ФИО студента"></Input>
						<br></br>
						{ 
						// https://stackoverflow.com/questions/39501289/in-reactjs-how-to-copy-text-to-clipboard
						// let's pray nobody uses IE11
						inviteLink.length !== 0 && 
							<Label onClick = {() => {navigator.clipboard.writeText(inviteLink)}}>
								Ссылка-приглашение (нажмите для копирования): {inviteLink}
							</Label>
						}
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button onClick = {toggle} className = "redBtn" style = {{float: "left"}}>Отмена</Button>
					<Button type='submit' style = {{float: "right"}}>Добавить студента</Button>
				</ModalFooter>
			</Form>
		</Modal>
	)
}
