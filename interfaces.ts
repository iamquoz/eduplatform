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
	theoryid: number;
	total: Array<number>;
	correct: Array<number>;
	totalAttempts: number;
}

interface donetype {
	theoryid: number;
	taskid: Array<number>;
	correct: Array<boolean>;
	tries: Array<number>;
	comment: Array<string>;
	usrAnswer: Array<string>;
	question: Array<string>;
	diff: Array<number>;
	answer: Array<string>;
	isOpen: Array<boolean>;
}

interface statReq {
	theoryid: number;
	taskid: number;
	correct: boolean;
	tries: number;
	diff: number;
	isOpen: boolean;
}

interface doneReq {
	theoryid: number;
	taskid: number;
	correct: boolean;
	tries: number;
	comment: string;
	usrAnswer: string;
	question: string;
	diff: number;
	answer: string;
	isOpen: boolean;
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
export {user, task, theory, stat, assignment, statReq, doneReq, donetype}