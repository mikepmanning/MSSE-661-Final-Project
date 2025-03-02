const BASE_API_URL = "http://localhost:3001/api";
const AUTH_API = `${BASE_API_URL}/auth`;
const USER_API = `${BASE_API_URL}/user`;

function register(formData) {
    return _post(`${AUTH_API}/register`, formData, true);
}

function login(formData) {
    return _post(`${AUTH_API}/login`, formData, true);
}

function getUserByToken() {
    return _get(`${USER_API}/me`, false);
}

function updateUser(formData) {
    return _put(`${USER_API}/${formData.id}`, formData);
}