import { 
	Modal, 
	ModalHeader,
	ModalBody, 
	ModalFooter,
	Button,
	Row, Col
} from 'reactstrap'


export default function MdTooltip({isOpen, toggle}) {
	console.log(isOpen, toggle);

	return (
		<Modal isOpen = {isOpen} toggle = {toggle}>
			<ModalHeader>Форматирование</ModalHeader>
			<ModalBody>
				<Row>
					<Col>
						_Текст_ или *Текст* <br/>
					</Col>
					<Col className = "rightal">
						<i>Курсивный текст</i>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col>
						__Текст__ или **Текст**

					</Col>
					<Col className = "rightal">
						<b>Жирный текст</b>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col>
						Упорядоченный список: <br />
						0. Элемент 1 <br/>
						0. Элемент 2 <br/>
						0. Элемент 3
					</Col>
					<Col className = "rightal">
						Упорядоченный список:
						<ol>
							<li>Элемент 1</li>
							<li>Элемент 2</li>
							<li>Элемент 3</li>
						</ol>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col>
						Обычный список: <br />
						- Элемент 1 <br/>
						- Элемент 2 <br/>
						- Элемент 3
					</Col>
					<Col className = "rightal">
						Обычный список:
						<ul>
							<li>Элемент 1</li>
							<li>Элемент 2</li>
							<li>Элемент 3</li>
						</ul>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col> [Ссылка](https://astu.org)</Col>
					<Col className = "rightal"><a href = "https://astu.org">Ссылка</a></Col>
				</Row>
				<Row>
					Два пробела в конце строки - переход на новую строку
				</Row>
			</ModalBody>
			<ModalFooter>
				<Button onClick = {toggle} style = {{padding: "10px 20px"}}>
					Закрыть
				</Button>
			</ModalFooter>
		</Modal>
	)
}