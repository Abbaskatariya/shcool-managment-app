import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'

import { generateCode } from './GeneratCode';
import { ClassSchemas } from '../../../Schemas';
import { classFetchData, classPostData, studentFetchData, subjectFetchData, teacherFetchData, putClassData, putStudentData, putSubjectData, putTeacherData } from '../../api/AllApi';

export default function AddClass() {
  const location = useLocation()
  const navigate = useNavigate()

  const [feesToggle, setFeesToggle] = useState(false)
  const [studentData, setStudentData] = useState([])
  const [subjectData, setSubjectData] = useState([])
  const [teacherData, setTeacherData] = useState([])
  const [notEqualMessage, setNotEqualMessage] = useState()

  useEffect(() => {
    (async () => {
      const data = await localStorage.getItem('loginAuth')
      !data && navigate('/login')

      const classData = `${formik.values.standard}-${formik.values.division}-${formik.values.medium.toUpperCase()}`

      const dataStudent = await studentFetchData();
      const filterClassData = dataStudent.filter((value) => {
        const val = value.classData.split('-')
        if (`${val[0]}-${val[1]}-${val[2]}` === classData) {
          return value
        }
      })
      setStudentData(filterClassData)

      const dataSubject = await subjectFetchData();
      const filterSubject = dataSubject.filter((val) => {
        if (val.subjectClass === classData) {
          return val
        }
      })
      setSubjectData(filterSubject)

      const dataTeacher = await teacherFetchData();
      const filterTeacher = dataTeacher.filter((val) => {
        if (val.classData === classData)
          return val
      })
      setTeacherData(filterTeacher)
    })()
  }, [])

  const initialValue = {
    standard: location.state.edit ? location.state.data.standard : '',
    division: location.state.edit ? location.state.data.division : '',
    medium: location.state.edit ? location.state.data.medium : '',
    fees: location.state.edit ? location.state.data.fees : ''
  }

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: ClassSchemas,
    onSubmit: (values) => {
      if (location.state.edit) {
        const id = location.state.data.id
        if (formik.values.standard !== location.state.data.standard ||
          formik.values.division !== location.state.data.division ||
          formik.values.medium !== location.state.data.medium ||
          values.fees !== location.state.data.fees
        ) {
          putClassData(id, {
            standard: formik.values.standard,
            division: formik.values.division.toUpperCase(),
            medium: formik.values.medium.toUpperCase(),
            fees: values.fees
          }).then(res => {
            navigate('/class', { state: res })
          })

          studentData.map((studentData) => putStudentData(studentData.id, {
            id: studentData.id,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            studentId: studentData.studentId,
            gender: studentData.gender,
            DOB: studentData.DOB,
            classData: `${formik.values.standard}-${formik.values.division.toUpperCase()}-${formik.values.medium.toUpperCase()}-${formik.values.fees}`,
            joiningDate: studentData.joiningDate,
            fatherName: studentData.fatherName,
            fatherOccupation: studentData.fatherOccupation,
            fatherMobile: studentData.fatherMobile,
            fatherEmail: studentData.fatherEmail,
            presentAddress: studentData.presentAddress,
            permanentAddress: studentData.permanentAddress
          }))

          subjectData.map((subject) => putSubjectData(subject.id, {
            subjectName: subject.subjectName,
            subjectClass: `${formik.values.standard}-${formik.values.division.toUpperCase()}-${formik.values.medium.toUpperCase()}`
          }))

          teacherData.map((value) => putTeacherData(value.id, {
            id: value.id,
            name: value.name,
            studentId: value.studentId,
            gender: value.gender,
            DOB: value.DOB,
            joiningDate: value.joiningDate,
            mobileNumber: value.mobileNumber,
            qualification: value.qualification,
            experience: value.experience,
            classData: `${formik.values.standard}-${formik.values.division.toUpperCase()}-${formik.values.medium.toUpperCase()}`,
            subjectData: value.subjectData,
            img: value.img,
          }))
        }
      } else {
        classPostData({
          id: generateCode(5),
          standard: values.standard,
          division: values.division.toUpperCase(),
          medium: values.medium.toUpperCase(),
          fees: values.fees
        }).then(res => {
          navigate('/class', { state: res })
        })
      }
    }
  });

  useEffect(() => {
    (async () => {
      const data = await classFetchData();
      if (!location.state.edit) {
        data.forEach((val) => {
          if (val.standard === formik.values.standard &&
            val.division === formik.values.division.toUpperCase() &&
            val.medium === formik.values.medium)
            return (setNotEqualMessage(true))()
          else
            return setNotEqualMessage(false)
        })

        data.forEach((val) => {
          if (val.standard === formik.values.standard &&
            val.medium === formik.values.medium.toUpperCase()){
            formik.setFieldValue('fees', val.fees)
            setFeesToggle(true)
          }
          else
            setFeesToggle(false)
        })
      } else {
        data.forEach((val) => {
          if (val.standard === formik.values.standard && val.medium === formik.values.medium) {
            return putClassData(val.id, {
              standard: val.standard,
              division: val.division.toUpperCase(),
              medium: val.medium.toUpperCase(),
              fees: formik.values.fees
            })
          }
        })
      }
    })()

  }, [formik.values, notEqualMessage])

  return (
    <div className='class'>
      <h1>{location.state.edit ? 'Update Class' : 'AddClass'}</h1>
      <form style={{ display: 'grid' }} className='row g-2' onSubmit={formik.handleSubmit} >
        <div className="col-auto addClassWidth">
          <label htmlFor="exampleInputEmail1" className="form-label">Standard</label>
          <input type='tel' maxLength='2' className='form-control' name='standard'
            value={formik.values.standard}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.standard && formik.touched.standard ? (<p className='text-danger'>{formik.errors.standard}</p>) : null}
        </div>

        <div className="col-auto addClassWidth">
          <label>Division</label>
          <input type='text' name='division' className='form-control'
            value={formik.values.division.toUpperCase()} onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
          {formik.errors.division && formik.touched.division
            ? (<p className='text-danger my-2'>{formik.errors.division}</p>) : null}
        </div>
        <div className="col-auto" style={{ width: '500px' }}>
          <label htmlFor="exampleInputEmail1" className="form-label">medium</label>
          <select id="dropdown-basic-button" style={{ width: '495px' }} name='medium' className='select'
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.medium}>
            <option value=''>Select Medium</option>
            <option value='ARB'>ARABIC</option>
            <option value='ENG'>ENGLISH</option>
            <option value='GUJ'>GUJARATI</option>
            <option value='HIN'>HINDI</option>
            <option value='URD'>URDU</option>
          </select>
          {formik.errors.medium && formik.touched.medium
            ? (<p className='text-danger my-2'>{formik.errors.medium}</p>) : null}
          {notEqualMessage && (<p className='text-danger my-2'>this record already exist</p>)}
        </div>
        <div className="col-auto addClassWidth">
          <label>Fees</label>
          <input type='tel' maxLength='5' disabled={feesToggle} name='fees' className='form-control' value={formik.values.fees}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
          {formik.errors.fees && formik.touched.fees
            ? (<p className='text-danger my-2'>{formik.errors.fees}</p>) : null}
        </div>
        <button disabled={!!notEqualMessage} type='submit' className='alert alert-warning addClassWidth'>{location.state.edit ? 'Update Class' : 'Add Class'}</button>
      </form>
    </div>
  )
}
