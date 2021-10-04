import axios from 'axios'

export const auth = {
	login, 
	logout,
	check
};

function login(u, p) {
	return axios.post('/auth/login', {login: u, password: p})
}

function check() {
	return axios.get('/auth/check');
}

function logout() {
	axios.post('/auth/logout')
		.then(_ => {
			localStorage.removeItem('account');
			window.location.reload();
		})
}