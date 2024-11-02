import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const authApi = {
    loginUser(login: string, password: string) {
        return instance.post('/authenticate', { login: login, password: password })
            .then((response) => {
                return response.data;
            })
    },
    loginParent(token: string) {
        return instance.post('/authenticate/parent', { token: token, role: 'ROLE_PARENTS' })
            .then((response) => {
                return response.data;
            })
    },
    singUpAdmin(login: string, role: string, password: string, name: string, lastname: string, surname: string) {
        return instance.post('/register', {
                login: login, 
                password: password,
                name: name,
                role: role,
                lastname: lastname,
                surname: surname
            })
            .then(responce => responce.data)
    },
    singUp(key: string, login: string, role: string, password: string, name: string, lastname: string, surname: string) {
        return instance.post('/register', {
                key:key,
                login: login, 
                password: password,
                name: name,
                role: role,
                lastname: lastname,
                surname: surname
            })
            .then(responce => responce.data)
    },
    createUniversity(name: string, authToken: string) {
        return instance.post('/admin/university/create', {name: name, description: '' }, {
            headers: {'Authorization' : `Bearer ${authToken}`}
        })
            .then(responce => responce.data)
    },
}