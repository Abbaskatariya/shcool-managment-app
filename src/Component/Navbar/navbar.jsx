import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import img from '../../Assets/download.png'
import dropDown from '../../Assets/down.png'
import rightArrow from '../../Assets/right-arrow.png'
import SideNavBar from '../SideNavBar/SideNavBar'
import './navbar.css'

export default function Navbar() {
    const [toggle, setToggle] = useState(false)
    const [login, setLogin] = useState(true)
    const data = localStorage.getItem('loginAuth')

    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (location.pathname === '/login') {
            setLogin(false)
        } else {
            setLogin(true)
        }

    }, [location])

    const redirectLogin = () => {
        if (data) {
            localStorage.removeItem('loginAuth')
        }
        navigate('/login')
        setToggle(false)
    }

    return (
        <div>
            {login && <nav className="navbarMargin navbar navbar-light justify-content-around">
                <div className="navbarContent navbar navbar-light justify-content-between">
                    <form className="form-inline" >
                    </form>
                    <div className='justify-content-between mx-2'>
                        <i className="bi bi-bell"></i>
                        <img className='navbarImg mx-2' src={img}  alt='' />
                        <img onClick={() => setToggle((val => !val))} className='navbarImgArrow mx-1' src={dropDown} alt='' />
                        {toggle && 
                        <p onClick={redirectLogin} className='cursor navbarLoginLogoutImg mx-2'>
                            <img className='navbarToggleImg mx-1' src={rightArrow} alt='' />
                            {data ? 'logout' : 'login'}</p>}
                    </div>                    
                </div>
            </nav>}
            
        <SideNavBar />
        </div>

    )
}
