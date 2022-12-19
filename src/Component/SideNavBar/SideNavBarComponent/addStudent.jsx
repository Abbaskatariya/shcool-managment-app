import { useFormik } from 'formik';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

import React, { forwardRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StudentSchemas } from '../../../Schemas';
import { classFetchData, putStudentData, studentPostData } from '../../api/AllApi';
import { generateCode } from './GeneratCode';

export default function AddStudent() {
    const navigate = useNavigate()
    const location = useLocation()
    const [classData, setClassData] = useState()

    useEffect(() => {
        (async () => {
            const data = await localStorage.getItem('loginAuth')
            !data && navigate('/login')

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
            navigate('/student')
            if (location.state.edit) {
                const id = location.state.data.id;
                if (value.firstName !== location.state.data.firstName ||
                    value.lastName !== location.state.data.lastName ||
                    value.gender !== location.state.data.gender ||
                    value.DOB !== location.state.data.DOB ||
                    value.classData !== location.state.data.classData ||
                    value.joiningDate !== location.state.data.joiningDate ||
                    value.fatherName !== location.state.data.fatherName ||
                    value.fatherOccupation !== location.state.data.fatherOccupation ||
                    value.fatherMobile !== location.state.data.fatherMobile ||
                    value.fatherEmail !== location.state.data.fatherEmail ||
                    value.presentAddress !== location.state.data.presentAddress ||
                    value.permanentAddress !== location.state.data.permanentAddress) {
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
        }
    })

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <input placeholder='Click to select a date' className="form-control" onClick={onClick} ref={ref} value={value} />
    ));

    return (
        <div className='class'>
            <h1>{location.state.edit ? 'Update Student' : 'Add Student'}</h1>
            <form onSubmit={formik.handleSubmit} className={'row g-2'} style={{ border: '1px solid #dfe3e7', borderRadius: '5px', padding: '50px', marginRight: '30px' }}>
                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">First Name</label>
                    <input type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName} name='firstName' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    {formik.errors.firstName && formik.touched.firstName ? (<p className='text-danger my-2'>{formik.errors.firstName}</p>) : null}
                </div>
                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Last Name</label>
                    <input type="text" name='lastName' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    {formik.errors.lastName && formik.touched.lastName ? (<p className='text-danger my-2'>{formik.errors.lastName}</p>) : null}
                </div>
                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">gender</label>
                    <select className='select' id="dropdown-basic-button" title="Gender" name='gender' value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                    {formik.errors.gender && formik.touched.gender ? (<p className='text-danger my-2'>{formik.errors.gender}</p>) : null}
                </div>
                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputPassword1" className="form-label">Date-of-Birth</label>
                    <DatePicker yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown maxDate={new Date()} value={formik.values.DOB} onChange={(d) => formik.setFieldValue('DOB', moment(d).format('L'))}
                        name='DOB' onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                    {formik.errors.DOB && formik.touched.DOB ?
                        (<p className='text-danger my-2'>{formik.errors.DOB}</p>) : null}
                </div>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">class</label>
                    <select className='select' id="dropdown-basic-button" title="Class" name='classData' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.classData}>
                        <option value=''>select Class</option>
                        {classData?.map((val, index) => {
                            return <option key={index} value={`${val.standard}-${val.division}-${val.medium}-${val.fees}`}>
                                {val.standard}-
                                {val.division.toUpperCase()}-
                                {val.medium.toUpperCase()}
                            </option>
                        })}
                    </select>
                    {formik.errors.classData && formik.touched.classData ? (<p className='text-danger my-2'>{formik.errors.classData}</p>) : null}
                </div>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputPassword1" className="form-label">joining Date</label>
                    <DatePicker maxDate={new Date()} value={formik.values.joiningDate} yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown
                        onChange={(d) => formik.setFieldValue('joiningDate', moment(d).format('L'))}
                        name='joiningDate' onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                    {formik.errors.joiningDate && formik.touched.joiningDate ?
                        (<p className='text-danger my-2'>{formik.errors.joiningDate}</p>) : null}
                </div>

                <h3>Parent Information</h3>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Father's Name</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" value={formik.values.fatherName} name='fatherName' aria-describedby="emailHelp" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.fatherName && formik.touched.fatherName ? (<p className='text-danger my-2'>{formik.errors.fatherName}</p>) : null}
                </div>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Father's Occupation</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" name='fatherOccupation' value={formik.values.fatherOccupation} aria-describedby="emailHelp" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.fatherOccupation && formik.touched.fatherOccupation ? (<p className='text-danger my-2'>{formik.errors.fatherOccupation}</p>) : null}
                </div>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Father's Mobile</label>
                    <input type="tel" maxLength={10} className="form-control" id="exampleInputEmail1" name='fatherMobile' value={formik.values.fatherMobile} aria-describedby="emailHelp" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.fatherMobile && formik.touched.fatherMobile ? (<p className='text-danger my-2'>{formik.errors.fatherMobile}</p>) : null}
                </div>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Father's Email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name='fatherEmail' value={formik.values.fatherEmail.toLowerCase()} aria-describedby="emailHelp" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.fatherEmail && formik.touched.fatherEmail ? (<p className='text-danger my-2'>{formik.errors.fatherEmail}</p>) : null}
                </div>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Present Address</label>
                    <textarea className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={formik.values.presentAddress} name='presentAddress' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.presentAddress && formik.touched.presentAddress ? (<p className='text-danger my-2'>{formik.errors.presentAddress}</p>) : null}
                </div>

                <div className="col-auto" style={{ width: '500px' }}>
                    <label htmlFor="exampleInputEmail1" className="form-label">Permanent Address</label>
                    <textarea className="form-control" id="exampleInputEmail1" name='permanentAddress' value={formik.values.permanentAddress} aria-describedby="emailHelp" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                    {formik.errors.permanentAddress && formik.touched.permanentAddress ? (<p className='text-danger my-2'>{formik.errors.permanentAddress}</p>) : null}
                </div>

                <button type="submit" className="btn btn-warning" style={{ width: '1000px', marginTop: '30px' }}>{location.state.edit ? 'Update Student' : 'Add Student'}</button>
            </form>
        </div>
    )
}
