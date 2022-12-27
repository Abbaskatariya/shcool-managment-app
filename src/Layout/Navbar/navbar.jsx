import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './navbar.css'
import img from '../../Assets/download.png'
import dropDown from '../../Assets/down.png'
import rightArrow from '../../Assets/right-arrow.png'

export default function Navbar({ data }) {
    const [toggle, setToggle] = useState(false)
    const navigate = useNavigate()

    const redirectLogin = () => {
        localStorage.removeItem('loginAuth');
        data(false)
        navigate('/login')
        setToggle(false)
    }

    return (
        <div>
            <nav className="navbarMargin navbar navbar-light justify-content-around">
                <div className="navbarContent navbar navbar-light justify-content-between">
                    <div>
                    </div>
                    <div className='justify-content-between mx-2'>
                        <i className="bi bi-bell"></i>
                        <img className='navbarImg mx-2' src={img} alt='' />
                        <img onClick={() => setToggle((val => !val))} className='navbarImgArrow mx-1' src={dropDown} alt='' />
                        {toggle &&
                            <p onClick={redirectLogin} className='cursor navbarLoginLogoutImg mx-2'>
                                <img className='navbarToggleImg mx-1' src={rightArrow} alt='rightArrow' />
                                logout</p>}
                    </div>
                </div>
            </nav>
        </div>
    )
}
