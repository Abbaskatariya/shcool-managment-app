import React, { forwardRef, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useLocation, useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

import { TeacherSchemas } from '../../Utils/validationSchema'
import { classFetchData, putTeacherData, subjectFetchData, teacherPostData } from '../../api/AllApi'
import { generateCode } from '../../Utils/GeneratCode'
import Button from '../../Component/Button';
import ReuseInputField from '../../Component/ReuseInputField';

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
                if (value !== location.state.data) {
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
            navigate('/teacher')
        }
    })

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => formik.setFieldValue('img', e.target.result)
            reader.readAsDataURL(event.target.files[0])
        }
    }

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <input placeholder='Click to select a date' className="form-control" onClick={onClick} ref={ref} value={value} />
    ));

    return (
        <div className='class'>
                <h1>{location.state.edit ? 'Update Teacher' : 'Add Teacher'}</h1><br />
                <form onSubmit={formik.handleSubmit} className={'studentForm row g-2'}>
                    <ReuseInputField name={'name'} label={'Name'} type={'text'} formik={formik} />
                    <div className="col-auto addClassWidth">
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

                    <div className="col-auto addClassWidth">
                        <label htmlFor="exampleInputPassword1" className="form-label">Date-of-Birth</label>
                        <DatePicker yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown maxDate={new Date()} value={formik.values.DOB} onChange={(d) => formik.setFieldValue('DOB', moment(d).format('L'))} name='DOB'
                            onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                        {formik.errors.DOB && formik.touched.DOB ? (<p className='text-danger my-2'>{formik.errors.DOB}</p>) : null}
                    </div>

                    <div className="col-auto addClassWidth">
                        <label htmlFor="exampleInputPassword1" className="form-label">joining Date</label>
                        <DatePicker yearDropdownItemNumber={35} scrollableYearDropdown showYearDropdown maxDate={new Date()} value={formik.values.joiningDate} onChange={(d) => formik.setFieldValue('joiningDate', moment(d).format('L'))} name='joiningDate'
                            onBlur={formik.handleBlur} customInput={<ExampleCustomInput />} />
                        {formik.errors.joiningDate &&
                            formik.touched.joiningDate ?
                            (<p className='text-danger my-2'>{formik.errors.joiningDate}</p>)
                            : null}
                    </div>
                    <ReuseInputField maxLength={10} name={'mobileNumber'} label={'Mobile Number'} type={'tel'} formik={formik} />
                    <ReuseInputField name={'experience'} label={'Experience'} type={'number'} formik={formik} />
                    <div className="col-auto addClassWidth">
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

                    <div className="col-auto addClassWidth">
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

                    <div className="row-auto addClassWidth">
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
                    <div className="col-auto addClassWidth">
                        <label htmlFor="exampleInputEmail1" className="form-label">select image</label>
                        <input type="file" accept='image/*' value={formik.val?.img} className="form-control" id="exampleInputEmail1" name='img' aria-describedby="emailHelp" onChange={onImageChange} onBlur={formik.handleBlur} />
                        {formik.errors.img &&
                            formik.touched.img ?
                            (<p className='text-danger my-2'>{formik.errors.img}</p>)
                            : null}
                    </div>
                    <div className="col-auto addClassWidth">
                        <img src={formik.values?.img} className='teacherImg' alt='' />
                        {formik.values.img ? <button type="button" className="btn-close" aria-label="Close" onClick={() => formik.setFieldValue('img', '')}></button> : ''}
                    </div>
                    <Button>{location.state.edit ? 'Update Teacher' : 'Add Teacher'}</Button>
                </form>
        </div>
    )
}
