import axios from 'axios'
import { BehaviorSubject } from 'rxjs'

const currUser = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')))


export const auth = {
	login, 
	logout,
	current: currUser.asObservable(),
	get currUserValue() { return currUser.value}
};

function login(u, p) {
	return axios.get('/Authorize', {
		params: {
			id: u,
			passw: p
		}})
}

function logout() {
	localStorage.removeItem('currentUser');
	currUser.next(null);
	window.location.reload();
}