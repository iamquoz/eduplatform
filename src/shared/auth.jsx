import axios from 'axios'

export const auth = {
	login, 
	logout,
};

function login(u, p) {
	return axios.post('/auth/login', {login: u, password: p})
}

function logout() {
	localStorage.removeItem('account');
	window.location.reload();
}