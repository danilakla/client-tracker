import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { deanApi } from "../../../../api/auth/dean-api";

export type SubgroupDTO = {
    idSubgroup: number,
    subgroupNumber: string,
    subjects: SubjectDTO[]
}

export type SubjectDTO = {
    subjectName: string,
    classGroups: ClassGroupDTO[]
}

export type ClassGroupDTO = {
    idClassGroup: number,
    idClassHold: number,
    description: string,
    formatName: string,
    teacherName: string
}

export type ClassGroupsBySubgroupState = {
    loading: "idle" | "loading" | "success" | "error";
    searchSubgroup: string,
    searchSubject: string,
    searchClassGroup: string,

    subgroups: SubgroupDTO[];
    
    selectedSubgroup: SubgroupDTO;
    selectedSubject: SubjectDTO;

    isCheckTable: boolean;
}

const initialState : ClassGroupsBySubgroupState = {
    loading: 'idle',
    searchSubgroup: '',
    searchSubject: '',
    searchClassGroup: '',

    subgroups: [],

    selectedSubgroup: {
        idSubgroup: -1,
        subgroupNumber: '',
        subjects: []
    },
    selectedSubject: {
        subjectName: '',
        classGroups: []
    },

    isCheckTable: false,
}

export const classGroupsBySubgroupSlice = createSlice({
    name: 'class-groups-by-subgroup-slice',
    initialState,
    reducers: {
        setSubgroupsActionCreator(state, action: PayloadAction<SubgroupDTO[]>) {
            state.subgroups = action.payload;
        },

        setIsCheckTableActionCreator(state, action: PayloadAction<boolean>) {
            state.isCheckTable = action.payload;
        },
        
        setSelectedSubgroupActionCreator(state, action: PayloadAction<{value: SubgroupDTO, onSuccess: () => void}>) {
            state.selectedSubgroup = action.payload.value;
            action.payload.onSuccess();
        },
        setSelectedSubjectActionCreator(state, action: PayloadAction<{value: SubjectDTO, onSuccess: () => void}>) {
            state.selectedSubject = action.payload.value;
            action.payload.onSuccess();
        },

        setSearchSubjectActionCreator(state, action: PayloadAction<string>) {
            state.searchSubject = action.payload;
        },
        setSearchSubgroupActionCreator(state, action: PayloadAction<string>) {
            state.searchSubgroup = action.payload;
        },
        setSearchClassGroupActionCreator(state, action: PayloadAction<string>) {
            state.searchClassGroup = action.payload;
        },

        reset(state) {
            Object.assign(state, initialState);
        },
        resetWithSuccess(state, action: PayloadAction<() => void>) {
            Object.assign(state, initialState);
            action.payload();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initClassGroupsBySubgroupnActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initClassGroupsBySubgroupnActionCreator.pending, (state) => {
                state.loading = "loading";
            })
            .addCase(initClassGroupsBySubgroupnActionCreator.rejected, (state) => {
                state.loading = 'error';
            });
    },
});


export const initClassGroupsBySubgroupnActionCreator = createAsyncThunk('class-groups-by-subgroup-slice/init',
    async (data: { authToken: string }, thunkApi) => {
        const { authToken } = data;
        try {
            const response = await deanApi.getClassGroupsBySubgroups(authToken);
            
            thunkApi.dispatch(
                classGroupsBySubgroupSlice.actions.setSubgroupsActionCreator(transformResponse(response))
            )
            
            //  const currentYear = new Date().getFullYear();

            //  const processedData = response.map((item: any) => {
            //     const admissionYear = new Date(item.subgroup.admissionDate).getFullYear();
            //     const course = currentYear - admissionYear + 1;

            //     const groupInfo = item.subgroup.subgroupNumber?.split('.') || ['0', '0'];
            //     const formattedGroup = `${course} курс - ${groupInfo[0]} гр. - ${groupInfo[1]} п.`;

            //     const students = item.students.map((student: any) => ({
            //         ...student,
            //         name: student.name.replace(/_/g, ' '),
            //     })).sort((a: any, b: any) => b.unattestedCount - a.unattestedCount); // 🔥 Sorting here
            
            //     return {
            //         ...item,
            //         subgroup: {
            //             ...item.subgroup,
            //             subgroupNumber: formattedGroup,
            //         },
            //         students,
            //     };
            
            // });

            // thunkApi.dispatch(attestationStudentsSlice.actions.setSubgroupsActionCreator(processedData))

        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default classGroupsBySubgroupSlice.reducer;


export const transformResponse = (response: any[]): SubgroupDTO[] => {
    return response.map(subgroup => {
        const subjectMap: Record<string, SubjectDTO> = {};

        subgroup.classGroups.forEach((classGroup: any) => {
            if (!subjectMap[classGroup.subjectName]) {
                subjectMap[classGroup.subjectName] = {
                    subjectName: classGroup.subjectName,
                    classGroups: []
                };
            }
            subjectMap[classGroup.subjectName].classGroups.push({
                idClassGroup: classGroup.idClassGroup,
                idClassHold: classGroup.idClassHold,
                description: classGroup.description,
                formatName: classGroup.formatName,
                teacherName: classGroup.teacherName
            });
        });

        return {
            idSubgroup: subgroup.idSubgroup,
            subgroupNumber: subgroup.subgroupNumber,
            subjects: Object.values(subjectMap)
        };
    });
};
