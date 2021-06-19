import { Button } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

export default function About() {
	const history = useHistory();

	const source = `##### Создатели  
[@iamquoz](https:/github.com/iamquoz) - веб-интерфейс  
[@neputevshina](https://github.com/neputevshina) - веб-сервер  
[@ofu-hub](https://github.com/ofu-hub) - веб-сервер  
[@Dima-Neor](https://github.com/Dima-Neor) - дизайн  
[@seljmov](https://github.com/seljmov) - тимлид  
`
	return (
		<div className = "container" style = {{flexDirection: "column"}}>
			<h3 style = {{textAlign: "center"}}>Образовательная платформа</h3>

			<p style = {{paddingTop: "10px"}}>Проект был разработан в ходе подготовки выступления на 
				71 Международной студентческой научно-технической конференции 
				в Астраханском Государственном Техническом Университете</p>
			<hr></hr>
			<p>Руководитель: Булычева Юлия Валерьевна</p>
			<hr></hr>
			<ReactMarkdown parserOptions={{ commonmark: true }} children = {source}/>
			<div style = {{textAlign: "center"}} onClick = { event => window.location.href = "https://github.com/iamquoz/eduplatform"}>
				<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"  viewBox="0 0 16 16">
  					<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
				</svg>
			</div>
			<Button style = {{marginTop: "10%", width: "100%"}}  onClick = {() => history.push('/')}>Назад</Button>
		</div>
	)
}
