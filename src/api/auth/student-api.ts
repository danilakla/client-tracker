import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const studentApi = {
    getSubjects(authToken: string) {
        return instance.get('/student/get/class-groups', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getTableOfSubgroup(authToken: string, idHold: number) {
        return instance.get(`/common/show/table/${idHold}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getKeyForQr(authToken: string, id: number) {
        return instance.get(`/qr/student/key`, { 
            params: {
                id: id
            },
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    askReview(authToken: string, classId: number, studentGradeId: number) {
        return instance.post(`/qr/student/ask/review`, {
            classId: classId,
            studentGradeId: studentGradeId
        },{ 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    acceptAttendance(authToken: string, studentGrateId: number, attendanceCode: number) {
        return instance.post(`/teacher/accept/attendance`, {
            studentGrateId: studentGrateId,
            attendanceCode: attendanceCode
        },{ 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}

