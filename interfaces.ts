interface user {
	id: number;
    names: string;
	role: number;
    hash: string;
}

interface task {
	taskid: number;
	isOpen: boolean;
	diff: number;
	question: string;
	correct: string;
}

interface theory {
	theoryid: number;
	header: string;
	body: string;
}

interface stat {
	total: Array<number>;
	correct: Array<number>;
	totalAttempts: number;
}

interface assignment {
	sid: number;
	taskid: number;
	complete: boolean;
	correct: boolean;
	comment: string;
	theoryid: number;
	tries: number;
	usrAnswer: string;
	id: number;
}
export {user, task, theory, stat, assignment}