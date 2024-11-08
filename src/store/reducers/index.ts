import { combineReducers } from "redux";
import loginReducer from "./auth/login-slice";
import singupReducer from "./auth/singup-slice";
import userReducer from "./user-slice"
import appStatusReducer from "./app-status-slice"

import changeAccountReducer from "./profile/change-account-data-slice"
import changeLoginReducer from "./profile/change-login-slice"
import changePasswordReducer from "./profile/change-password-slice"
import universityInfoReducer from "./profile/university-info-slice"

import adminGeneratorKeysReducer from "./roles/admin/generator-keys-slice"
import adminUniversityEditorReducer from "./roles/admin/university-editor-slice"
import adminMembersReducer from "./roles/admin/members-slice"

import deanClassFormatsReducer from "./roles/dean/class-formats-slice"
import deanControlSubjectsReducer from "./roles/dean/control-subjects-slice"
import deanSpecialtiesReducer from "./roles/dean/specialties-slice"
// import Reducer from "./roles/dean"

export const rootReducers = combineReducers({
      singup: singupReducer,
      login: loginReducer,
      user: userReducer,
      appStatus: appStatusReducer,
      changeAccountData: changeAccountReducer,
      changeLogin: changeLoginReducer,
      changePassword: changePasswordReducer,
      universityInfo: universityInfoReducer,
      adminGeneratorKeys: adminGeneratorKeysReducer,
      adminUniversityEditor: adminUniversityEditorReducer,
      adminMembers: adminMembersReducer,
      deanClassFormats: deanClassFormatsReducer,
      deanControlSubjects: deanControlSubjectsReducer,
      deanSpecialties: deanSpecialtiesReducer
});

export type RootState = ReturnType<typeof rootReducers>;