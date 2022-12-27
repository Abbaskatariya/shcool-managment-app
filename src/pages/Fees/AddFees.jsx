import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { FeesSchemas } from '../../Utils/validationSchema'
import { feesCollectionPostData, putStudentFeesData } from '../../api/AllApi'
import Button from '../../Component/Button'
import ReuseInputField from '../../Component/ReuseInputField'

export default function AddFees() {
    const location = useLocation()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState()
    const [remainingPayment, setRemainingPayment] = useState()
    const id = location.state.data.id

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
                    <ReuseInputField disabled={true} name={'studentName'} label={'Student Name'} type={'text'} formik={formik} />
                    <ReuseInputField disabled={true} name={'selectDate'} label={'date'} type={'text'} formik={formik} />
                    <ReuseInputField disabled={true} name={'classData'} label={'class'} type={'text'} formik={formik} />
                    <ReuseInputField disabled={true} name={'fees'} label={'Fees'} type={'number'} formik={formik} />
                    <div className="col-auto addClassWidth">
                        <label htmlFor="inputPassword4">Amount Fees</label>
                        <input type="number" name='paidFees' onChange={paidFeesHandleChange} onBlur={formik.handleBlur}
                            value={formik.values.paidFees} className="form-control" placeholder="Amount Fees" />
                        {formik.errors.paidFees && formik.touched.paidFees ? (<p className='text-danger my-2'>{formik.errors.paidFees}</p>) : null}
                        {errorMessage && <p className='text-danger my-2'>{errorMessage}</p>}
                    </div>
                    <Button disabled={!!errorMessage}>Add Fees</Button>
                </div>
            </form>
        </div>
    )
}
