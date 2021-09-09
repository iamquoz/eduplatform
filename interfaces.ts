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

export {user, task, theory, stat}