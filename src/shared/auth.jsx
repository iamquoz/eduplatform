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
	const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

	return fetch('https://60bb9c2e42e1d00017620e1d.mockapi.io/logins/' + u, requestOptions)
		.then(function (responce) {
			console.log(responce, u, p);
			return responce.text().then(text => {
				const data = text && JSON.parse(text);
				console.log(data, u, p);
				if (!responce.ok || data.pass !== p) {
					if ([401, 403].indexOf(responce.status) !== -1) {
						auth.logout();
					}
					const error = "Неправильный логин или пароль";
					return Promise.reject(error);
				}
				return data;
			})
		})
		.then(user => {
			localStorage.setItem('currentUser', JSON.stringify(user));
			currUser.next(user);
			return user;
		})
}

function logout() {
	localStorage.removeItem('currentUser');
	currUser.next(null);
	window.location.reload();
}