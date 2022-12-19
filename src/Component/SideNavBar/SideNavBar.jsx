import React, { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink, useLocation } from 'react-router-dom';

import '../SideNavBar/SideNavBarCss/SideNavBar.css'
import logo from '../../Assets/logo.png'
import wallet from '../../Assets/wallet.png'
import student from '../../Assets/student.png'
import training from '../../Assets/training.png'
import teacher from '../../Assets/teach.png'


const options = [
    {
        name: 'Enable body scrolling',
        scroll: true,
        backdrop: false,
    }
];

function OffCanvasExample({ name, ...props }) {
    const [login, setLogin] = useState(true)

    const location = useLocation()

    useEffect(() => {
        if (location.pathname === '/login') {
            setLogin(false)
        } else {
            setLogin(true)
        }
    }, [location.pathname])


    return (
        <div>
            {login && <Offcanvas show={true} {...props} style={{ width: 'auto', background: '#f7f7fa' }}>
                <Offcanvas.Header>
                    <Offcanvas.Title> <h2 className='fw-bold'><img src={logo} style={{ width: '40px', height: '40px' }} alt='' />Appsile</h2></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='sideBarLink'>
                        <NavLink style={({ isActive }) => ({ color: isActive ? '#19adf8' : '' })}
                            to='/dashboard'>
                            <i className="bi bi-house-fill mx-2"></i>
                            Dashboard <i className="bi bi-chevron-right sm-2" style={{ float: 'right' }}></i>
                        </NavLink>
                        <NavLink
                            style={({ isActive }) => ({ color: isActive ? '#19adf8' : '' })}
                            to='/class'><img src={training} style={{ width: '18px', height: '18px' }}
                                className="mx-2"
                                alt=''
                            />
                            Class
                            <i className="bi bi-chevron-right sm-2" style={{ float: 'right' }}></i>
                        </NavLink>
                        <NavLink
                            style={({ isActive }) => ({ color: isActive ? '#19adf8' : '' })}
                            to='/student'>
                            <img src={student} style={{ width: '18px', height: '18px' }} className="mx-2" alt='' />
                            Student
                            <i className="bi bi-chevron-right sm-2" style={{ float: 'right' }}></i>
                        </NavLink>
                        <NavLink
                            style={({ isActive }) => ({ color: isActive ? '#19adf8' : '' })}
                            to='/subject'>
                            <i className="bi bi-book-fill mx-2"></i>
                            Subject
                            <i className="bi bi-chevron-right sm-2" style={{ float: 'right' }}></i>
                        </NavLink>
                        <NavLink
                            style={({ isActive }) => ({ color: isActive ? '#19adf8' : '' })}
                            to='/teacher'>
                            <img src={teacher} style={{ width: '18px', height: '18px' }} className="mx-2" alt='' />
                            Teacher
                            <i className="bi bi-chevron-right sm-2" style={{ float: 'right' }}></i>
                        </NavLink>
                        <NavLink
                            style={({ isActive }) => ({ color: isActive ? '#19adf8' : '' })}
                            to='/fees'><img src={wallet} style={{ width: '18px', height: '18px' }}
                                className="mx-2"
                                alt=''
                            />
                            Fess
                            <i className="bi bi-chevron-right sm-2" style={{ float: 'right' }}></i>
                        </NavLink>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>}
        </div>
    );
}

export default function SideNavBar() {
    return (
        <>
            {options.map((props, idx) => (
                <OffCanvasExample key={idx} {...props} />
            ))}
        </>
    );
}
