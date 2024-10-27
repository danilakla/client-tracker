import { Navigate, Route, Routes } from "react-router";
import './App.css';
import { FC } from "react";
import { Login } from './screens/auth/login';
import { Signup } from './screens/auth/signup';
import { PrivateRoute } from "./private-route";
import { useTypedSelector } from "./hooks/use-typed-selector";

export const urls = {
  logInUser: '/log-in/user',
  logInParent: '/log-in/parent',
  signUpUser: '/sign-up/user',
  signUpAdmin: '/sign-up/admin'
};

type RootProps = {};

export const Root: FC<RootProps> = () => {
  const { user } = useTypedSelector(state => state.user);

  return (
    <Routes>
      <Route path={urls.logInUser} element={<Login typeOfLogin='other' />} />
      <Route path={urls.logInParent} element={<Login typeOfLogin='parent' />} />
      <Route path={urls.signUpUser} element={<Signup typeOfSignup="user" />} />
      <Route path={urls.signUpAdmin} element={<Signup typeOfSignup="admin" />} />
      <Route path="/" element={<PrivateRoute />} >
        <Route index element={<>{user.role}</>} />
      </Route>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};