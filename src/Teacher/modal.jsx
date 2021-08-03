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

export default function ModalAdd({isOpen, toggle, stList, setStList}) {

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

		axios.post('/api/AddStudent', {String: stName})	
			.then(res => {
				setStList([...stList, {ID: parseInt(res.data.StudentID), StName: stName}]);
				setInviteLink(`${window.location.origin + '/register?id=' + res.data.StudentID}`);
			})
			.catch(err => console.log(err));
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
					<Button onClick = {toggle} className = "redBtn" style = {{float: "left", padding: "10px 20px"}}>Отмена</Button>
					<Button type='submit' style = {{float: "right", padding: "10px 20px"}}>Добавить студента</Button>
				</ModalFooter>
			</Form>
		</Modal>
	)
}
