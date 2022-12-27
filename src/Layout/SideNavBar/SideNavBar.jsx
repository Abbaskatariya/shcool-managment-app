import { NavLink } from 'react-router-dom';
import React from 'react';
import { SidebarItem } from 'react-responsive-sidebar';

import './SideNavBar.css'
import logo from '../../Assets/logo.png'
import wallet from '../../Assets/wallet.png'
import student from '../../Assets/student.png'
import training from '../../Assets/training.png'
import teacher from '../../Assets/teach.png'
import home from '../../Assets/home.png'
import book from '../../Assets/open-book.png'

export default function SideNavBar() {
    const link = [
        { path: '/', img: home, name: 'Dashboard' },
        { path: '/class', img: training, name: 'Class' },
        { path: '/student', img: student, name: 'Student' },
        { path: '/subject', img: book, name: 'Subject' },
        { path: '/teacher', img: teacher, name: 'Teacher' },
        { path: '/fees', img: wallet, name: 'Fess' }
    ]
    return [
        <div>
            <h3 className='sideNavBarH3 fw-bold'>
                <img className='sideNavBarImg' src={logo} alt='' />Appsile</h3>
            {link.map(val => {
                return <NavLink to={val.path}>
                    <SidebarItem hoverHighlight='rgb(173,221,245)'>
                        <img src={val.img} className="sideNavBarIcon mx-2" alt='' />
                        {val.name}
                        <i className="bi bi-chevron-right sm-2 sideNavBarRightIcon"></i>
                    </SidebarItem>
                </NavLink>
            })}
        </div>
    ]
}