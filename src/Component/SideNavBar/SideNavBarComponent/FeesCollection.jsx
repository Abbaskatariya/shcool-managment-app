import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { feesCollectionFetchData } from '../../api/AllApi'

export default function FeesCollection() {
    const location = useLocation()
    const navigate = useNavigate()
    const [feesCollectionData, setFeesCollectionData] = useState([])
    const [loading, setLoading] = useState(true)
    
    const id = location.state.id
    const fees = location.state.classData.split('-')
    useEffect(() => {
        (async () => {
            const data = await localStorage.getItem('loginAuth')
            !data && navigate('/login')

            const res = await feesCollectionFetchData(id)
                setFeesCollectionData(res)
                setLoading(false)
        })()
    }, [])
    
    return (
        <div className='class'>
            <h2>Fees Collection</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>S/N</th>
                        <th>Date</th>
                        <th>Remaining Fees</th>
                        <th>paid Fees</th>
                        <th>Total Fees</th>
                    </tr>
                </thead>
                <tbody>
                    {feesCollectionData?.map((data, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.selectDate}</td>
                            <td>{data.fees}</td>
                            <td>{data.paidFees} </td>
                            <td>{fees[3]}</td>
                        </tr>
                    })}
                    {loading && <tr>
                        <td colSpan={'6'}>
                            <div style={{ marginLeft: '310px' }} className="spinner-border text-warning" role="status">
                                <span className="sr-only"></span>
                            </div>
                        </td>
                    </tr>}
                </tbody>
            </table>
        </div>
    )
}
