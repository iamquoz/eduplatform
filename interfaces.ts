interface user {
	id: number;
    name: string;
	role: number;
    hash: string;
}

interface task {
	ID: number;
	IsOpen: boolean;
	Difficulty: number;
	Question: string;
	Correct: string;
}

interface theory {
	ID: number;
	Header: string;
	Body: string;
}

interface stat {
	Total: Array<number>;
	Correct: Array<number>;
	TotalAttempts: number;
}

export {user, task, theory, stat}