import React, { forwardRef, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useLocation, useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { TeacherSchemas } from '../../../Schemas'
import { classFetchData, putTeacherData, subjectFetchData, teacherPostData } from '../../api/AllApi'
import { generateCode } from './GeneratCode'
import moment from 'moment'

export default function AddTeacher() {
    const navigate = useNavigate()
    const location = useLocation()
    const [classData, setClassData] = useState()
    const [subjectData, setSubjectData] = useState()

    const initialValues = {
        id: generateCode(5),
        name: '',
        studentId: generateCode(5),
        gender: 'male',
        DOB: '',
        joiningDate: '',
        mobileNumber: '',
        qualification: '10',
        experience: '',
        classData: '',
        subjectData: '',
        img: '',
    }

    useEffect(() => {
        (async () => {
            const data = await localStorage.getItem('loginAuth')
            !data && navigate('/login')

            const classFirstData = await classFetchData()
            setClassData(classFirstData)

            const subject = await subjectFetchData()
            setSubjectData(subject)

            if (!location.state.edit)
                formik.setFieldValue('joiningDate', moment().format('L'))
        })()
    }, [])

    const formik = useFormik({
        initialValues: location.state.edit ? location.state.data : initialValues,
        validationSchema: TeacherSchemas,
        onSubmit: (value) => {
            if (location.state.edit) {
                const id = location.state.data.id;
                if (
                    value.name !== location.state.data.name ||
                    value.studentId !== location.state.data.studentId ||
                    value.gender !== location.state.data.gender ||
                    value.DOB !== location.state.data.DOB ||
                    value.joiningDate !== location.state.data.joiningDate ||
                    value.mobileNumber !== location.state.data.mobileNumber ||
                    value.qualification !== location.state.data.qualification ||
                    value.experience !== location.state.data.experience ||
                    value.classData !== location.state.data.classData ||
                    value.subjectData !== location.state.data.subjectData ||
                    value.img !== location.state.data.img
                ) {
                    putTeacherData(id, {
                        id: value.id,
                        name: value.name,
                        studentId: value.studentId,
                        gender: value.gender,
                        DOB: value.DOB,
                        joiningDate: value.joiningDate,
                        mobileNumber: value.mobileNumber,
                        qualification: value.qualification,
                        experience: value.experience,
                        classData: value.classData,
                        subjectData: value.subjectData,
                        img: value.img
                    }).then(res => {
                        navigate('/teacher', { state: res })
                    })
                }
            } else {
                teacherPostData(value).then(res => {
                    navigate('/teacher', { state: res })
                })
            }
        }
    })

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => formik.setFieldValue('img', e.target.result)
            reader.readAsDataURL(event.target.files[0])
        }
    }

    const removeImg = () => {
        formik.setFieldValue('img', '')
    }

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <input placeholder='Click to select a date' className="form-control" onClick={onClick} ref={ref} value={value} />
    ));

    return (
        <div className='class'>
            <div>
                <h1>{location.state.edit ? 'Update Teacher' : 'Add Teacher'}</h1><br />
                <form onSubmit={formik.handleSubmit} className={'row g-2'} style={{ border: '1px solid #dfe3e7', borderRadius: '5px', padding: '50px', marginRight: '30px' }}>
                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                        <input type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} name='name' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        {formik.errors.name &&
                            formik.touched.name ?
                            (<p className='text-danger my-2'>{formik.errors.name}</p>)
                            : null}
                    </div>
                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">Gender</label>
                        <select className='select' id="dropdown-basic-button" title="Gender" name='gender' value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                        </select>
                        {formik.errors.gender &&
                            formik.touched.gender ?
                            (<p className='text-danger my-2'>{formik.errors.gender}</p>)
                            : null}
                    </div>

                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputPassword1" className="form-label">Date-of-Birth</label>
                        <DatePicker yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown maxDate={new Date()} value={formik.values.DOB} onChange={(d) => formik.setFieldValue('DOB', moment(d).format('L'))} name='DOB'
                            onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                        {formik.errors.DOB && formik.touched.DOB ? (<p className='text-danger my-2'>{formik.errors.DOB}</p>) : null}
                    </div>

                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputPassword1" className="form-label">joining Date</label>
                        <DatePicker yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown maxDate={new Date()} value={formik.values.joiningDate} onChange={(d) => formik.setFieldValue('joiningDate', moment(d).format('L'))} name='joiningDate'
                            onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                        {formik.errors.joiningDate &&
                            formik.touched.joiningDate ?
                            (<p className='text-danger my-2'>{formik.errors.joiningDate}</p>)
                            : null}
                    </div>

                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">Mobile Number</label>
                        <input type="tel" maxLength={10} className="form-control" id="exampleInputEmail1" name='mobileNumber' value={formik.values.mobileNumber} aria-describedby="emailHelp" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.mobileNumber &&
                            formik.touched.mobileNumber ?
                            (<p className='text-danger my-2'>{formik.errors.mobileNumber}</p>)
                            : null}

                    </div>

                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">Experience</label>
                        <input type="number" className="form-control" id="exampleInputEmail1" name='experience' value={formik.values.experience} aria-describedby="emailHelp" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.experience &&
                            formik.touched.experience ?
                            (<p className='text-danger my-2'>{formik.errors.experience}</p>)
                            : null}
                    </div>

                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">Qualification</label>
                        <select id="dropdown-basic-button" className='select' title="Class" name='qualification' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.qualification}>
                            <option value='10'>10</option>
                            <option value='12'>12</option>
                            <option value='graduation'>Graduation</option>
                        </select>
                        {formik.errors.qualification &&
                            formik.touched.qualification ?
                            (<p className='text-danger my-2'>{formik.errors.qualification}</p>)
                            : null}
                    </div>

                    <div className="col-auto" style={{ width: '500px' }}>
                        <label className="form-label">class</label><br />
                        <select id="dropdown-basic-button" className='select' title="Class" name='classData' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.classData}>
                            <option value=''>select Class</option>
                            {classData?.map((val, index) => {
                                return <option href="#/class" key={index} value={`${val.standard}-${val.division}-${val.medium}`}>
                                    {val.standard}-
                                    {val.division}-
                                    {val.medium}
                                </option>
                            })}
                        </select>
                        {formik.errors.classData &&
                            formik.touched.classData ?
                            (<p className='text-danger my-2'>{formik.errors.classData}</p>)
                            : null}
                    </div>

                    <div className="row-auto" style={{ width: '500px' }}>
                        <label className="form-label">subject</label><br />
                        <select id="dropdown-basic-button" className='select' title="Class" name='subjectData' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.subjectData}>
                            <option value=''>select Subject</option>
                            {subjectData?.map((val, index) => {
                                return <option href="#/class" key={index} value={val.subjectName}>
                                    {val.subjectName}
                                </option>
                            })}
                        </select>
                        {formik.errors.subjectData &&
                            formik.touched.subjectData ?
                            (<p className='text-danger my-2'>{formik.errors.subjectData}</p>)
                            : null}
                    </div>

                    <div className="col-auto" style={{ width: '500px' }}>
                        <label htmlFor="exampleInputEmail1" className="form-label">select image</label>
                        <input type="file" accept='image/*' value={formik.val?.img} className="form-control" id="exampleInputEmail1" name='img' aria-describedby="emailHelp" onChange={onImageChange} onBlur={formik.handleBlur} />
                        {formik.errors.img &&
                            formik.touched.img ?
                            (<p className='text-danger my-2'>{formik.errors.img}</p>)
                            : null}
                    </div>
                    <div className="col-auto" style={{ width: '500px' }}>
                        <img src={formik.values?.img} style={{ width: 'auto', height: '150px' }} alt='' />
                        {formik.values.img ? <button type="button" className="btn-close" aria-label="Close" onClick={removeImg}></button> : ''}
                    </div>
                    <button style={{ width: '1100px', marginTop: '30px' }} type="submit" className="btn btn-warning">{location.state.edit ? 'Update Teacher' : 'Add Teacher'}</button>
                </form>
            </div>
        </div>
    )
}
