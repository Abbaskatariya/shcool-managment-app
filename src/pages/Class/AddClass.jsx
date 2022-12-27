import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'

import { generateCode } from '../../Utils/GeneratCode';
import { ClassSchemas } from '../../Utils/validationSchema';
import { classFetchData, classPostData, studentFetchData, subjectFetchData, teacherFetchData, putClassData, putStudentData, putSubjectData, putTeacherData } from '../../api/AllApi';
import Button from '../../Component/Button';
import ReuseInputField from '../../Component/ReuseInputField';

export default function AddClass() {
  const location = useLocation()
  const navigate = useNavigate()

  const [feesToggle, setFeesToggle] = useState(false)
  const [studentData, setStudentData] = useState([])
  const [subjectData, setSubjectData] = useState([])
  const [teacherData, setTeacherData] = useState([])
  const [notEqualMessage, setNotEqualMessage] = useState()
  const mediumSelect = [
    { mediumValue: 'ARB', name: 'ARABIC' },
    { mediumValue: 'ENG', name: 'ENGLISH' },
    { mediumValue: 'GUJ', name: 'GUJARATI' },
    { mediumValue: 'HIN', name: 'HINDI' },
    { mediumValue: 'URD', name: 'URDU' }
  ]
  useEffect(() => {
    (async () => {
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
          formik.values.fees !== location.state.data.fees) {
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
      navigate('/class')
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
            (setNotEqualMessage(true))()
          else
            setNotEqualMessage(false)
        })

        data.forEach((val) => {
          if (val.standard === formik.values.standard &&
            val.medium === formik.values.medium.toUpperCase()) {
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
      <form className='g-2' onSubmit={formik.handleSubmit} >
        <ReuseInputField maxLength={'2'} name={'standard'} label={'Standard'} type={'tel'} formik={formik} />
        <div className="col-auto addClassWidth">
          <label>Division</label>
          <input type='text' name='division' className='form-control'
            value={formik.values.division.toUpperCase()} onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
          {formik.errors.division && formik.touched.division
            ? (<p className='text-danger my-2'>{formik.errors.division}</p>) : null}
        </div>
        <div className="col-auto addClassWidth">
          <label htmlFor="exampleInputEmail1" className="form-label">medium</label>
          <br />
          <select id="dropdown-basic-button" name='medium' className='classSelect'
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.medium}>
            <option value=''>Select Medium</option>
            {mediumSelect.map(val => {
              return <option value={val.mediumValue}>{val.name}</option>
            })}
          </select>
          {formik.errors.medium && formik.touched.medium
            ? (<p className='text-danger my-2'>{formik.errors.medium}</p>) : null}
          {notEqualMessage && (<p className='text-danger my-2'>this record already exist</p>)}
        </div>
        <ReuseInputField disabled={feesToggle} maxLength={'5'} name={'fees'} label={'Fees'} type={'tel'} formik={formik} />
        <Button disabled={!!notEqualMessage}>{location.state.edit ? 'Update Class' : 'Add Class'}</Button>
      </form>
    </div>
  )
}
