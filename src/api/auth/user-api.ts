import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const userApi = {
    getUserInfo(authToken: string) {
        return instance.get('/user/info', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    changeAccountData(authToken: string, lastname: string, name: string, surname: string){
        return instance.post('/user/update-user-info',{
            lastname: lastname,
            name: name,
            surname: surname
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    changeLogin(authToken: string, newLogin: string){
        return instance.post('/user/update-login',{
            newLogin: newLogin
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    changePassword(authToken: string, currentPassword: string, newPassword: string){
        return instance.post('/user/update-password',{
            currentPassword: currentPassword,
            newPassword: newPassword
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}