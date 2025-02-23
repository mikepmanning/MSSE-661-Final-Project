const BASE_API_URL = "http://localhost:3001/api";
const AUTH_API = `${BASE_API_URL}/auth`;
const USER_API = `${BASE_API_URL}/user`;

function register(formData) {
    return _post(`${AUTH_API}/register`, formData);
}

function login(formData) {
    return _post(`${AUTH_API}/login`, formData);
}

function getUserByToken(header) {
    return _get(`${USER_API}/me`, header);
}

function updateUser(formData) {
    _put(`${USER_API}/${formData.id}`, formData);
}