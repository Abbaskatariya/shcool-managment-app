import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import Class from './pages/Class/Class'
import Dashboard from './pages/Dashboard/Dashboard'
import Student from './pages/Student/Student'
import Subject from './pages/Subject/Subject'
import Teacher from './pages/Teacher/Teacher'
import AddClass from './pages/Class/AddClass';
import AddStudent from './pages/Student/addStudent';
import AddSubject from './pages/Subject/AddSubject';
import AddTeacher from './pages/Teacher/AddTeacher';
import LoginForm from './pages/login/LoginForm';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Fees from './pages/Fees/Fees';
import AddFees from './pages/Fees/AddFees';
import FeesCollection from './pages/Fees/FeesCollection';
import './App.css';
import { useEffect, useState } from 'react';
import Layout from './pages/Layout';

function App() {
  const [isLogging, setIsLogging] = useState(false)
  useEffect(() => {
    const login = localStorage.getItem('loginAuth')
    setIsLogging(login ? true : false)
  }, [isLogging])

  const isLoggingFn = (data) => {
    setIsLogging(data ? true : false)
  }
  
  return (
    <div className='d-flex justify-content-around'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isLogging ? <Layout data={isLoggingFn} /> : <Navigate to='/login' />} >
            <Route index element={<Dashboard />} />
            <Route path='student' element={<Student />} />
            <Route path='student/addStudent' element={<AddStudent />} />
            <Route path='teacher' element={<Teacher />} />
            <Route path='teacher/addTeacher' element={<AddTeacher />} />
            <Route path='subject' element={<Subject />} />
            <Route path='subject/addSubject' element={<AddSubject />} />
            <Route path='class' element={<Class />} />
            <Route path='class/addClass' element={<AddClass />} />
            <Route path='fees' element={<Fees />} />
            <Route path='fees/addFees' element={<AddFees />} />
            <Route path='fees/feesCollection' element={<FeesCollection />} />
          </Route>
          <Route path='login' element={!isLogging ? <LoginForm login={isLoggingFn} /> : <Navigate to='/' />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
