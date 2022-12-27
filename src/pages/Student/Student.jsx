import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import edit from '../../Assets/edit.png';
import deletes from '../../Assets/delete.png'
import { deleteStudentDataAPI, studentFetchData } from '../../api/AllApi';
import ModelDelete from '../../Component/ModelDelete';
import ReusablePagination from '../../Component/ReusablePagination';
import ReusableSpinner from '../../Component/ReusableSpinner';
import RecordNotFound from '../../Component/RecordNotFound';

export default function Student() {
  const location = useLocation()
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [studentFilter, setStudentFilter] = useState()
  const [toggleSort, setToggleSort] = useState(false)
  const [toggleSortClassData, setToggleSortClassData] = useState(false)
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState()
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 7
  const pageCount = Math.ceil(studentData?.length / itemsPerPage);
  const currentItems = studentData?.slice(itemOffset * itemsPerPage,(itemOffset + 1) * itemsPerPage);

  useEffect(() => {
    if (!search) {
      (async () => {
        const data = await studentFetchData();
        setStudentData(data)
        setStudentFilter(data)
        setLoading(false)
      })()
    } else {
      const filterData = studentFilter?.filter((item) => {
        return (item.firstName.toLowerCase().trim().includes(search.toLowerCase().trim())
        )
      })
      setStudentData(filterData)
      setItemOffset(0)
    }
  }, [location, search])

  const handleClick = (index) => {
    setItemOffset(index)
  }

  const deleteStudentData = () => {
    const val = studentData.filter((val) => val.id !== deleteId)
    deleteStudentDataAPI(deleteId)
    setStudentData(val)
    setStudentFilter(val)
    setModal(false)
  }

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }

  const sort = (val) => {
    if (val === 'firstName') {
      toggleSort ? studentData.sort((a, b) => (b.firstName < a.firstName ? -1 : 1)) : studentData.sort((a, b) => (a.firstName < b.firstName ? -1 : 1))
      setToggleSort((val) => !val)
    } else {
      toggleSortClassData ? studentData.sort((a, b) => (b.classData < a.classData ? -1 : 1)) : studentData.sort((a, b) => (a.classData < b.classData ? -1 : 1))
      setToggleSortClassData((val) => !val)
    }
  }

  return (
    <div className='class'>
      <h1>Student</h1>
      <h6 className='classHeadingMargin'>Dashboard / <span>Student</span></h6>
      <div className='classContainer table-responsive'>
        <div className='classFilter' >
          <form className="form-inline">
            <input onChange={(e) => setSearch(e.target.value)} className="classFilterSearchInput form-control" placeholder="Search Name..." aria-label="Search" />
          </form>
          <button onClick={() => navigate('/student/addStudent', { state: { edit: false } })} className='headingButton'>Add Student</button>
        </div>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col" className='cursor' onClick={() => sort('firstName')}>Name {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th scope="col">Gender </th>
              <th scope="col" className='cursor' onClick={() => sort()}>Class {toggleSortClassData ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th scope="col">DOB</th>
              <th scope="col">Parent Name</th>
              <th scope="col">Address</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((val, index) => {
              const data = val.classData.split('-')
              return <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.firstName}</td>
                <td>{val.gender}</td>
                <td>{`${data[0]}-${data[1]}-${data[2]}`}</td>
                <td>{val.DOB}</td>
                <td>{val.fatherName}</td>
                <td>{val.presentAddress}</td>
                <td>
                  <img src={edit} alt='edit' className='classImgEditDelete' onClick={() => navigate('/student/addStudent', { state: { data: val, edit: true } })} />
                  <img src={deletes} alt='deletes' className='classImgEditDelete' onClick={() => deleteToggleOpen(val.id)} />
                </td>
              </tr>
            })}
            <RecordNotFound data={studentData} col={'8'} />
            <ReusableSpinner loading={loading} col={'8'} />
          </tbody>
        </table>
        {!loading && studentData?.length > 7 &&
          <ReusablePagination pageCount={pageCount} itemOffset={itemOffset} handleClick={handleClick} />}
      </div>
      <ModelDelete modal={modal} setModal={setModal} deleted={deleteStudentData} />
    </div>

  )
}
