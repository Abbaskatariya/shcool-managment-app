import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Spinner } from 'reactstrap'
import { feesCollectionFetchData } from '../../api/AllApi'
import ReusableSpinner from '../../Component/ReusableSpinner'

export default function FeesCollection() {
    const location = useLocation()
    const [feesCollectionData, setFeesCollectionData] = useState([])
    const [loading, setLoading] = useState(true)

    const id = location.state.id
    const fees = location.state.classData.split('-')
    useEffect(() => {
        (async () => {
            const res = await feesCollectionFetchData(id)
            setFeesCollectionData(res)
            setLoading(false)
        })()
    }, [])

    return (
        <div className='class table-responsive'>
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
                    <ReusableSpinner loading={loading} col={'6'} />
                </tbody>
            </table>
        </div>
    )
}
