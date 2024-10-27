import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const authApi = {
    login(login: string, password: string) {
        return instance.post('/authenticate', { login: login, password: password })
            .then((response) => {
                return response.data;
            })
    },
    singup(userName: string, password: string) {
        return instance.post('/singup', {userName: userName, password: password })
            .then(responce => responce.data)
    },
}