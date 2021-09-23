import { donetype, stat } from "./interfaces";
import { done, stats } from "./sql"


async function statsWrapper(id: number) {
	const result = (await stats(id)).rows;

	var retVal: Array<stat>;

	result.forEach(elem => {
		var i = retVal.findIndex(e => e.theoryid === elem.theoryid);

		if (i === -1)
			i = retVal.length;

		retVal[i].total[elem.diff]++;
		retVal[i].theoryid = elem.theoryid;

		if (elem.correct) 
			retVal[i].correct[elem.diff]++;

		if (!elem.isOpen)
			retVal[i].totalAttempts += elem.tries;
	})

	return retVal;
}

async function doneWrapper(id: number) {
	const result = (await done(id)).rows;

	var retVal: Array<donetype>;

	result.forEach(elem => {
		var i = retVal.findIndex(e => e.theoryid === elem.theoryid)

		if (i === -1)
			i = retVal.length;

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