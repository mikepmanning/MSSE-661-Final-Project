class UserService {
    constructor(BASE_API_URL) {
        this.USER_API = `${BASE_API_URL}/user`;
      }

    getAllUsers() {
        return _get(`${this.USER_API}`, false);
    }
}

const userService = new UserService(BASE_API_URL);