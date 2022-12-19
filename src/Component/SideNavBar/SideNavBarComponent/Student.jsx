import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import edit from '../../../Assets/edit.png';
import deletes from '../../../Assets/delete.png'
import { deleteStudentDataAPI, studentFetchData } from '../../api/AllApi';

export default function Student() {
  const location = useLocation()
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState()
  const [loading, setLoading] = useState(true)
  const [itemsPerPage] = useState(7)
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState('')
  const [studentFilter, setStudentFilter] = useState()
  const [toggleSort, setToggleSort] = useState(false)
  const [toggleSortClassData, setToggleSortClassData] = useState(false)
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState()

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = studentData?.slice(itemOffset, endOffset);
  let pageCount = Math.ceil(studentData?.length / itemsPerPage);

  useEffect(() => {
    (async () => {
      const data = await localStorage.getItem('loginAuth')
      !data && navigate('/login')
    })()
  }, [])

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

  useEffect(() => {
    if (!currentItems?.length)
      setItemOffset(0)
  }, [currentItems])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % studentData?.length;
    setItemOffset(newOffset);
  };

  const addStudentHandler = () => {
    navigate('/student/addStudent', { state: { edit: false } })
  }

  const editStudentHandler = (data) => {
    navigate('/student/addStudent', { state: { data: data, edit: true } })
  }

  const deleteStudentData = () => {
    const val = studentData.filter((val) => val.id !== deleteId)
    deleteStudentDataAPI(deleteId)
    setStudentData(val)
    setStudentFilter(val)
    setModal(false)
  }

  const toggleModel = () => setModal(!modal);

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const sortASD = () => {
    if (toggleSort)
      studentData.sort((a, b) => (a.firstName < b.firstName ? -1 : 1))
    else
      studentData.sort((a, b) => (b.firstName < a.firstName ? -1 : 1))
    setToggleSort((val) => !val)
  }

  const sortClassData = () => {
    if (toggleSortClassData)
      studentData.sort((a, b) => (a.classData < b.classData ? -1 : 1))
    else
      studentData.sort((a, b) => (b.classData < a.classData ? -1 : 1))
      
    setToggleSortClassData((val) => !val)
  }

  return (
    <div className='class'>
      <h1>Student</h1>
      <h6 style={{ marginBottom: '30px' }}>Dashboard / <span style={{ color: 'grey' }}>Student</span></h6>
      <div className='classContainer'>
        <div className='classFilter' >
          <form className="form-inline">
            <input onChange={handleChange} className="classFilterSearchInput form-control" placeholder="Search Name..." aria-label="Search" />
          </form>
          <button onClick={addStudentHandler} style={{ width: 'auto', marginLeft: '10px' }} className='headingButton'>Add Student</button>
        </div>
        <table className='table table-bordered' >
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col" className='cursor' onClick={sortASD}>Name {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th scope="col">Gender </th>
              <th scope="col" className='cursor' onClick={sortClassData}>Class {toggleSortClassData ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
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
                <td>{itemOffset === 7 ? index = index + 8 : index = index + 1}</td>
                <td>{val.firstName}</td>
                <td>{val.gender}</td>
                <td>{`${data[0]}-${data[1]}-${data[2]}`}</td>
                <td>{val.DOB}</td>
                <td>{val.fatherName}</td>
                <td>{val.presentAddress}</td>
                <td>
                  <img src={edit} alt='edit' className='classImgEditDelete' onClick={() => editStudentHandler(val)} />
                  <img src={deletes} alt='deletes' className='classImgEditDelete' onClick={() => deleteToggleOpen(val.id)} />
                  <Modal isOpen={modal} toggle={toggleModel}>
                    <ModalHeader toggle={toggleModel}>Delete Student</ModalHeader>
                    <ModalBody>this record delete permanent</ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={deleteStudentData}>Delete Record</Button>
                      <Button color="secondary" onClick={toggleModel}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </td>
              </tr>
            })}
            {studentData?.length === 0 && <tr>
              <td colSpan={'8'}>
                <p className='text-danger d-flex justify-content-center my-2'>Record Not Found...</p>
              </td>
            </tr>}

            {loading && <tr>
              <td colSpan={'8'}>
                <div className="d-flex justify-content-center text-warning">
                  <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              </td>
            </tr>}
          </tbody>
        </table>
        {!loading && studentData?.length > 7 &&
          <div style={{ float: 'right' }} id="react-paginate" className='d-flex justify-content-between'>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="previous"
              renderOnZeroPageCount={null}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName='active'
            />
          </div>}
      </div>
    </div>

  )
}
