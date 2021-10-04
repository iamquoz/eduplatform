import { useState, useEffect }from 'react'
import axios from 'axios'

import {Button} from 'reactstrap'

export default function StudentTasks({studentid}) {

	const [done, setDone] = useState(true);
	const [pendingTasks, setpendingTasks] = useState([]);
	const [doneTasks, setDoneTasks] = useState([]);
	const [theory, setTheory] = useState([]);

	useEffect(() => {
		axios.get('/api/students/' + studentid + '/done')
			.then(res => setDoneTasks(res.data))
			.catch(err => console.log(err));

		axios.get('/api/assignment/' + studentid)
			.then(res => setpendingTasks(res.data))
			.catch(err => console.log(err));
	}, [studentid])

	return (
		<div>
			<Button onClick = {() => setDone(!done)}>
				{done ? "Просмотреть выполненные задания" : "Просмотреть задания, ожидающие проверки"}
			</Button>
			{done 
				? <div>

				</div>
				: <div>

				</div>
			}
		</div>
	)
}
