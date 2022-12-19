import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import Navbar from './Component/Navbar/navbar';
import Class from './Component/SideNavBar/SideNavBarComponent/Class'
import Dashboard from './Component/SideNavBar/SideNavBarComponent/Dashboard'
import Student from './Component/SideNavBar/SideNavBarComponent/Student'
import Subject from './Component/SideNavBar/SideNavBarComponent/Subject'
import Teacher from './Component/SideNavBar/SideNavBarComponent/Teacher'
import AddClass from './Component/SideNavBar/SideNavBarComponent/AddClass';
import AddStudent from './Component/SideNavBar/SideNavBarComponent/addStudent';
import AddSubject from './Component/SideNavBar/SideNavBarComponent/AddSubject';
import AddTeacher from './Component/SideNavBar/SideNavBarComponent/AddTeacher';
import LoginForm from './Component/login/LoginForm';
import ErrorPage from './Component/SideNavBar/SideNavBarComponent/ErrorPage';
import Fees from './Component/SideNavBar/SideNavBarComponent/Fees';
import AddFees from './Component/SideNavBar/SideNavBarComponent/AddFees';
import FeesCollection from './Component/SideNavBar/SideNavBarComponent/FeesCollection';
import './App.css';

function App() {
  return (
    <div className='d-flex justify-content-around'>
      <BrowserRouter>
        <Navbar />
        <div></div>
        <Routes>
          <Route path='/' element={<Navigate to={'dashboard'} />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='student' element={<Student />} />
          <Route path='student/addStudent' element={<AddStudent />} />
          <Route path='teacher' element={<Teacher />} />
          <Route path='teacher/addTeacher' element={<AddTeacher />} />
          <Route path='subject' element={<Subject />} />
          <Route path='subject/addStudent' element={<AddSubject />} />
          <Route path='class' element={<Class />} />
          <Route path='class/addClass' element={<AddClass />} />
          <Route path='login' element={<LoginForm />} />
          <Route path='fees' element={<Fees />} />
          <Route path='fees/addFees' element={<AddFees />} />
          <Route path='fees/feesCollection' element={<FeesCollection />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
