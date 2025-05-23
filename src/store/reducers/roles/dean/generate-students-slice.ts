import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deanApi } from "../../../../api/auth/dean-api";
import { appStatusSlice } from "../../app-status-slice";
import axios from "axios";

type ErrorType = string | null;

export type Student = {
    name: string;
    lastname: string;
    surname: string;
    numberOfGroup: string;
    specialty: string;
    course: string;
  }

export type GenerateStudentsState = {
    students: Student[];
    searchText: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: GenerateStudentsState = {
    students: [],
    searchText: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: GenerateStudentsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const generateStudentsSlice = createSlice({
    name: "dean-generate-students",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setStudentsActionCreator(state, action: PayloadAction<Student[]>) {
            state.students = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateStudentsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(generateStudentsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(generateStudentsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

// export const initializeMembersDataActionCreator = createAsyncThunk('admin-members/initialize',
//     async (data: { authToken: string}, thunkApi ) => {
//         const { authToken } = data;
//         try {
//             const responce = await adminApi.getMembers(authToken);
//             thunkApi.dispatch(membersSlice.actions.setListDeansActionCreater(responce.deanList));
//             thunkApi.dispatch(membersSlice.actions.setListTeachersActionCreater(responce.teacherList));
//         }
//         catch (e) {
//             if (axios.isAxiosError(e)) {
//                 if(e.response?.status === 401){
//                     thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
//                 }
//             }
//         }
//     }
// )

export const generateStudentsActionCreator = createAsyncThunk('dean-generate-students/generate-students',
    async (data: { authToken: string, students: Student[], onSuccess?: () => void, onError?: () => void}, thunkApi ) => {
        const { authToken, students, onSuccess, onError } = data;
        try {
            const today = new Date();

            const currentYear = today.getFullYear();

            const septemberFirstThisYear = new Date(currentYear, 7, 1);

            const academicYear = today >= septemberFirstThisYear ? currentYear : currentYear - 1;

            const studentsWithYear = students.map(student => {
                const courseNumber = parseInt(student.course, 10);

                if (isNaN(courseNumber) || courseNumber < 1) {
                    onError?.();
                }

                const admissionYear = academicYear - (courseNumber - 1); 
                const admissionDate = new Date(admissionYear, 7, 1);

                return {
                    name: student.name,
                    lastname: student.lastname,
                    surname: student.surname,
                    numberOfGroup: student.numberOfGroup,
                    specialty: student.specialty,
                    date: admissionDate
                };
            });

            if(students.length === 0){
                thunkApi.dispatch(generateStudentsSlice.actions.setError({
                    key: "createError",
                    error: 'Выберите файл с корректной таблицей',
                }))
                onError?.();

                return;
            }

            const response = await deanApi.generateStudents(authToken, studentsWithYear);

            const fileURL = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'information.xlsx'); 

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link); 

            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                    return;
                } 
                thunkApi.dispatch(generateStudentsSlice.actions.setError({
                    key: "createError",
                    error: e.response?.data.message,
                }))
                onError?.();
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default generateStudentsSlice.reducer;
