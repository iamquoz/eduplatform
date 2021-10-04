import { donetype, stat } from "./interfaces";
import { done, stats } from "./sql"


async function statsWrapper(id: number) {
	const result = (await stats(id)).rows;

	var retVal: Array<stat> = [];

	result.forEach(elem => {
		var i = retVal.findIndex(e => e.theoryid === elem.theoryid);

		if (i === -1) {
			i = retVal.length;
			retVal.push({ theoryid: 0, total: [0, 0, 0], correct: [0, 0, 0], totalAttempts: 0 })
		}
		retVal[i].total[elem.diff - 1]++;
		retVal[i].theoryid = elem.theoryid;

		if (elem.correct)
			retVal[i].correct[elem.diff - 1]++;

		if (!elem.isOpen)
			retVal[i].totalAttempts += elem.tries;
	})

	return retVal;
}

async function doneWrapper(id: number) {
	const result = (await done(id)).rows;

	var retVal: Array<donetype> = [];

	result.forEach(elem => {
		var i = retVal.findIndex(e => e.theoryid === elem.theoryid)

		if (i === -1) {
			i = retVal.length;
			retVal.push({ 
				theoryid: 0, 
				taskid: [], 
				correct: [], 
				tries: [], 
				diff: [], 
				comment: [], 
				usrAnswer: [],
				question: [], 
				answer: [], 
				isOpen: [] 
			})
		}
		retVal[i].theoryid = elem.theoryid;

		var j = retVal[i].taskid.findIndex(e => e === elem.taskid);

		if (j === -1)
			j = retVal[i].taskid.length;

		retVal[i].taskid[j] = elem.taskid;
		retVal[i].correct[j] = elem.correct;
		retVal[i].tries[j] = elem.isOpen ? 0 : elem.tries;
		retVal[i].comment[j] = elem.comment;
		retVal[i].usrAnswer[j] = elem.usrAnswer;
		retVal[i].question[j] = elem.question;
		retVal[i].diff[j] = elem.diff;
		retVal[i].answer[j] = elem.answer;
		retVal[i].isOpen[j] = elem.isOpen;
	})

	return retVal;
}

export { statsWrapper, doneWrapper }