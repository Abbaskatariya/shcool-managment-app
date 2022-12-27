import React, { forwardRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

import { StudentSchemas } from '../../Utils/validationSchema';
import { classFetchData, putStudentData, studentPostData } from '../../api/AllApi';
import { generateCode } from '../../Utils/GeneratCode';
import ReuseInputField from '../../Component/ReuseInputField';
import Button from '../../Component/Button';
import ReuseTextarea from '../../Component/ReuseTextarea';

export default function AddStudent() {
    const navigate = useNavigate()
    const location = useLocation()
    const [classData, setClassData] = useState()
    const gender = ['male', 'female']

    useEffect(() => {
        (async () => {
            const res = await classFetchData()
            setClassData(res)
            if (!location.state.edit)
                formik.setFieldValue('joiningDate', moment().format('L'))
        })()
    }, [])

    const initialValue = {
        id: generateCode(5),
        firstName: '',
        lastName: '',
        studentId: generateCode(5),
        gender: 'male',
        DOB: '',
        classData: '',
        joiningDate: '',
        fatherName: '',
        fatherOccupation: '',
        fatherMobile: '',
        fatherEmail: '',
        presentAddress: '',
        permanentAddress: '',
        classFees: ''
    }
    const formik = useFormik({
        initialValues: location.state.edit ? location.state.data : initialValue,
        validationSchema: StudentSchemas,
        onSubmit: (value) => {
            if (location.state.edit) {
                const id = location.state.data.id;
                if (value !== location.state.data) {
                    putStudentData(id, {
                        id: value.id,
                        firstName: value.firstName,
                        lastName: value.lastName,
                        studentId: value.studentId,
                        gender: value.gender,
                        DOB: value.DOB,
                        classData: value.classData,
                        joiningDate: value.joiningDate,
                        fatherName: value.fatherName,
                        fatherOccupation: value.fatherOccupation,
                        fatherMobile: value.fatherMobile,
                        fatherEmail: value.fatherEmail,
                        presentAddress: value.presentAddress,
                        permanentAddress: value.permanentAddress,
                        classFees: value.classFees
                    }).then(res => {
                        navigate('/student', { state: res })
                    })
                }
            } else {
                studentPostData(value).then(res => {
                    navigate('/student', { state: res })
                })
            }
            navigate('/student')
        }
    })

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <input placeholder='Click to select a date' className="form-control" onClick={onClick} ref={ref} value={value} />
    ));

    return (
        <div className='class'>
            <h1>{location.state.edit ? 'Update Student' : 'Add Student'}</h1>
            <form onSubmit={formik.handleSubmit} className='studentForm row g-2'>
                <ReuseInputField name={'firstName'} label={'First Name'} type={'text'} formik={formik} />
                <ReuseInputField name={'lastName'} label={'Last Name'} type={'text'} formik={formik} />
                <div className="col-auto addClassWidth" >
                    <label htmlFor="exampleInputEmail1" className="form-label">gender</label>
                    <select className='select' id="dropdown-basic-button" title="Gender" name='gender' value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        {gender.map(val => <option value={val}>{val}</option>)}
                    </select>
                    {formik.errors.gender && formik.touched.gender ? (<p className='text-danger my-2'>{formik.errors.gender}</p>) : null}
                </div>
                <div className="col-auto addClassWidth" >
                    <label htmlFor="exampleInputPassword1" className="form-label">Date-of-Birth</label>
                    <DatePicker yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown maxDate={new Date()} value={formik.values.DOB} onChange={(d) => formik.setFieldValue('DOB', moment(d).format('L'))}
                        name='DOB' onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                    {formik.errors.DOB && formik.touched.DOB ?
                        (<p className='text-danger my-2'>{formik.errors.DOB}</p>) : null}
                </div>

                <div className="col-auto addClassWidth" >
                    <label htmlFor="exampleInputEmail1" className="form-label">class</label>
                    <select className='select' id="dropdown-basic-button" title="Class" name='classData' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.classData}>
                        <option value=''>select Class</option>
                        {classData?.map((val, index) => {
                            return <option key={index} value={`${val.standard}-${val.division}-${val.medium}-${val.fees}`}>
                                {val.standard}-{val.division}-{val.medium}
                            </option>
                        })}
                    </select>
                    {formik.errors.classData && formik.touched.classData ? (<p className='text-danger my-2'>{formik.errors.classData}</p>) : null}
                </div>

                <div className="col-auto addClassWidth">
                    <label htmlFor="exampleInputPassword1" className="form-label">joining Date</label>
                    <DatePicker maxDate={new Date()} value={formik.values.joiningDate} yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown
                        onChange={(d) => formik.setFieldValue('joiningDate', moment(d).format('L'))}
                        name='joiningDate' onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                    {formik.errors.joiningDate && formik.touched.joiningDate ?
                        (<p className='text-danger my-2'>{formik.errors.joiningDate}</p>) : null}
                </div>

                <h3>Parent Information</h3>
                <ReuseInputField name={'fatherName'} label={"Father's Name"} type={'text'} formik={formik} />
                <ReuseInputField name={'fatherOccupation'} label={"Father's Occupation"} formik={formik} type={'text'} />
                <ReuseInputField name={'fatherMobile'} label={"Father's Mobile"} formik={formik} maxLength={10} type={'tel'} />
                <ReuseInputField name={'fatherEmail'} label={"Father's Email"} formik={formik} type={'email'} />
                <ReuseTextarea name={'presentAddress'} label={'Present Address'} formik={formik} />
                <ReuseTextarea name={'permanentAddress'} label={'Permanent Address'} formik={formik} />
                <Button>{location.state.edit ? 'Update Student' : 'Add Student'}</Button>
            </form>
        </div>
    )
}
