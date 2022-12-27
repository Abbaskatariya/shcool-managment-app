import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'

import { generateCode } from '../../Utils/GeneratCode'
import { SubjectSchemas } from '../../Utils/validationSchema'
import { classFetchData, subjectPostData, teacherFetchData, putSubjectData, putTeacherData } from '../../api/AllApi'
import Button from '../../Component/Button'
import ReuseInputField from '../../Component/ReuseInputField'

export default function AddSubject() {
    const navigate = useNavigate()
    const location = useLocation()
    const [classData, setClassData] = useState()
    const [teacherData, setTeacherData] = useState([])

    useEffect(() => {
        (async () => {

            const res = await classFetchData()
            setClassData(res)

            const dataTeacher = await teacherFetchData()

            const filterTeacherData = dataTeacher.filter((val) => {
                if (val.subjectData === formik.values.subjectName && val.classData === formik.values.subjectClass)
                    return val
            })
            setTeacherData(filterTeacherData)
        })()
    }, [])

    const initialValue = {
        subjectName: location.state.edit ? location.state.data.subjectName : '',
        subjectClass: location.state.edit ? location.state.data.subjectClass : '',
    }
    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: SubjectSchemas,
        onSubmit: (value) => {
            const data = {
                id: generateCode(5),
                subjectName: value.subjectName,
                subjectClass: value.subjectClass.toUpperCase()
            }
            if (location.state.edit) {
                const id = location.state.data.id
                if (value.subjectName !== location.state.data.subjectName ||
                    value.subjectClass !== location.state.data.subjectClass) {
                    putSubjectData(id, {
                        subjectName: value.subjectName,
                        subjectClass: value.subjectClass
                    }).then(res => {
                        navigate('/subject', { state: res })
                    })

                    teacherData.map((val) => {
                        putTeacherData(val.id, {
                            id: val.id,
                            name: val.name,
                            studentId: val.studentId,
                            gender: val.gender,
                            DOB: val.DOB,
                            joiningDate: val.joiningDate,
                            mobileNumber: val.mobileNumber,
                            qualification: val.qualification,
                            experience: val.experience,
                            classData: value.subjectClass,
                            subjectData: value.subjectName,
                            img: val.img,
                        })
                    })
                }
            } else {
                subjectPostData(data).then(res => {
                    navigate('/subject', { state: res })
                })
            }
            navigate('/subject')
        }
    })

    return (
        <div className='class'>
            <h1>{location.state.edit ? 'Update Subject' : 'Add Subject'}</h1>
            <form onSubmit={formik.handleSubmit}>
                <ReuseInputField name={'subjectName'} label={'Subject Name'} type={'text'} formik={formik} />
                <div className="mb-2">
                    <label htmlFor="exampleInputEmail1" className="form-label">class</label><br />
                    <select name='subjectClass' className='select' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.subjectClass}>
                        <option value=''>Select Class</option>
                        {classData?.map((val, index) => {
                            return <option key={index}
                                value={`${val.standard}-${val.division}-${val.medium.toUpperCase()}`}>
                                {val.standard}-{val.division}-{val.medium.toUpperCase()}</option>
                        })}
                    </select>
                </div>
                {formik.errors.subjectClass &&
                    formik.touched.subjectClass ?
                    (<p className='text-danger my-1'>{formik.errors.subjectClass}</p>)
                    : null}
                <Button>{location.state.edit ? 'Update Subject' : 'Add Subject'}</Button>
            </form>
        </div>
    )
}
