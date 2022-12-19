import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { FeesSchemas } from '../../../Schemas'
import { feesCollectionPostData, putStudentFeesData } from '../../api/AllApi'

export default function AddFees() {
    const location = useLocation()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState()
    const [remainingPayment, setRemainingPayment] = useState()
    const id = location.state.data.id

    useEffect(() => {
        (async () => {
            const data = await localStorage.getItem('loginAuth')
            !data && navigate('/login')
        })()
    }, [])

    const current = new Date();
    const formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const currentDateAndTime = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()} - ${formatAMPM(current)}`
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
    const classDataAndFees = location.state.data.classData.split('-')
    const initialValue = {
        studentName: location.state.data.firstName,
        selectDate: date,
        classData: `${classDataAndFees[0]}-${classDataAndFees[1]}-${classDataAndFees[2]}`,
        fees: location.state.data.fees?.fees ? location.state.data.fees?.fees : classDataAndFees[3],
        paidFees: ''
    }
    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: FeesSchemas,
        onSubmit: (value) => {
            let paidAllData;
            location.state.data.fees?.paidFees ?
                paidAllData = +value.paidFees + +location.state.data.fees?.paidFees :
                paidAllData = +value.paidFees

            putStudentFeesData(id, {
                studentName: value.studentName,
                selectDate: value.selectDate,
                fees: remainingPayment,
                classData: value.classData,
                paidFees: paidAllData
            }).then(res => {
                navigate('/fees', { state: res })
            })

            feesCollectionPostData(id, {
                studentName: value.studentName,
                selectDate: currentDateAndTime,
                fees: remainingPayment,
                classData: value.classData,
                paidFees: value.paidFees
            })
        },
    })

    const paidFeesHandleChange = (e) => {
        formik.setFieldValue('paidFees', e.target.value)
        let fees = +formik.values.fees
        const val = fees - +e.target.value
        setRemainingPayment(val)

        e.target.value <= fees ? setErrorMessage('') : setErrorMessage('Paid fees grater than fess');
    }
    return (
        <div className='class'>
            <h1> Add Fees </h1>

             <form onSubmit={formik.handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-6 my-2">
                        <label htmlFor="inputEmail4">Student Name</label>
                        <input type="text" disabled onChange={formik.handleChange} onBlur={formik.handleBlur}
                            value={formik.values.studentName} name='studentName' className="form-control" id="inputPassword4" placeholder="select date" />
                    </div>
                    <div className="form-group col-md-6 my-2">
                        <label htmlFor="inputPassword4">date</label>
                        <input type="text" disabled onChange={formik.handleChange} onBlur={formik.handleBlur}
                            value={formik.values.selectDate} name='selectDate' className="form-control" id="inputPassword4" placeholder="select date" />
                    </div>
                    <div className="form-group col-md-6 my-2">
                        <label htmlFor="inputPassword4">class</label>
                        <input type="text" disabled onChange={formik.handleChange} onBlur={formik.handleBlur}
                            value={formik.values.classData} name='classData' className="form-control" id="inputPassword4" />
                    </div>
                    <div className="form-group col-md-6 my-2">
                        <label htmlFor="inputEmail4">Fees</label>
                        <input disabled type="number" className="form-control" name='fees' onChange={formik.handleChange}
                            onBlur={formik.handleBlur} value={formik.values.fees} id="inputEmail4" placeholder="fees" />
                    </div>
                    <div className="form-group col-md-6 my-2">
                        <label htmlFor="inputPassword4">Amount Fees</label>
                        <input type="number" name='paidFees' onChange={paidFeesHandleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.paidFees} className="form-control" placeholder="Amount Fees" />
                        {formik.errors.paidFees && formik.touched.paidFees ? (<p className='text-danger my-2'>{formik.errors.paidFees}</p>) : null}
                        {errorMessage && <p className='alert alert-danger my-2'>{errorMessage}</p>}
                    </div>
                    <button disabled={!!errorMessage} type='submit' className='headingButton my-3'> Add Fees</button>
                </div>
            </form>
        </div>
    )
}
