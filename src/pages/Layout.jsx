import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Layout/Navbar/navbar'
import SideNavBar from '../Layout/SideNavBar/SideNavBar'
import { Sidebar } from 'react-responsive-sidebar';


export default function Layout({ data }) {
    const items = SideNavBar()
    return (
        <div className='d-flex'>
            <Sidebar content={items} background={'#f8f9fa'} width={250} toggleIconColor='black'>
                <Navbar data={data} />
                <Outlet />
            </Sidebar>
        </div>
    )
}
