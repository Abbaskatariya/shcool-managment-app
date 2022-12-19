import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import edit from '../../../Assets/edit.png';
import deletes from '../../../Assets/delete.png'
import { deleteSubjectDataAPI, deleteTeacherDataAPI, subjectFetchData, teacherFetchData } from '../../api/AllApi';

export default function Subject() {
  const navigate = useNavigate()
  const location = useLocation()
  const [subjectData, setSubjectData] = useState([])
  const [subjectFilter, setSubjectFilter] = useState()
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('')
  const [toggleSort, setToggleSort] = useState(false)
  const [filterByClassData, setFilterByClassData] = useState([])
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState()
  const [filterClass, setFilterClass] = useState('')
  const [itemsPerPage] = useState(7)
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = subjectData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(subjectData?.length / itemsPerPage);

  useEffect(() => {
    if (!search && !filterClass) {
      (async () => {
        const data = await subjectFetchData()
        const classData = Array.from(new Set(data.map((val) => val.subjectClass)))
        classData.sort((a, b) => a < b ? -1 : 1)
        setFilterByClassData(classData)
        setSubjectData(data)
        setSubjectFilter(data)
        setLoading(false)
      })()
    } else {
      const filterData = subjectFilter?.filter(item => {
        if (filterClass && filterClass === item.subjectClass)
          return (item.subjectName.toLowerCase().trim().includes(search.toLowerCase().trim()))
        else if (!filterClass)
          return (item.subjectName.toLowerCase().trim().includes(search.toLowerCase().trim()))
      })
      setSubjectData(filterData)
      setItemOffset(0)
    }
  }, [location, search])

  useEffect(() => {
    if (!currentItems?.length) {
      setItemOffset(0)
    }
  }, [currentItems])

  useEffect(() => {
    (async () => {
      const data = await localStorage.getItem('loginAuth')
      !data && navigate('/login')
    })()
  }, [])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % subjectData?.length;
    setItemOffset(newOffset);
  };

  const addSubject = () => {
    navigate('/subject/addStudent', { state: { edit: false } })
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const editSubjectHandler = (data) => {
    navigate('/subject/addStudent', { state: { data, edit: true } })
  }

  const deleteSubjectData = async () => {
    const deleteSubject = subjectData.filter((val) => val.id !== deleteId);
    const deleteTeacher = subjectData.find((val) => val.id === deleteId);
    deleteSubjectDataAPI(deleteId)
    setSubjectData(deleteSubject)
    setSubjectFilter(deleteSubject)
    setModal(false)

    const teacherData = await teacherFetchData();
    teacherData.filter((data) => data.subjectData === deleteTeacher.subjectName &&
      data.classData === deleteTeacher.subjectClass ? deleteTeacherDataAPI(data.id) : '')
  }

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const sortASD = () => {
    const data = subjectData.sort((a, b) => (a.subjectName < b.subjectName ? -1 : 1))
    setSubjectData(data)
    setToggleSort((val) => !val)
  }

  const sortDESC = () => {
    const data = subjectData.sort((a, b) => (b.subjectName < a.subjectName ? -1 : 1))
    setSubjectData(data)
    setToggleSort((val) => !val)
  }

  const filterData = async (e) => {
    if (e.target.value.length === 0) {
      if (search) {
        const data = subjectFilter.filter(val => {
          if (val.subjectName.toLowerCase().trim().includes(search.toLowerCase().trim()))
            return val
        })
        setSubjectData(data)
      } else {
        const data = await subjectFetchData();
        setSubjectData(data)
      }
      setFilterClass('')
    }
  }

  const classFilter = (e) => {
    setFilterClass(e.target.value)
    const data = subjectFilter.filter(val => {
      if (search) {
        if (val.subjectClass === e.target.value && val.subjectName.toLowerCase().trim().includes(search.toLowerCase().trim())) {
          return val
        }
      } else {
        if (val.subjectClass === e.target.value) {
          return val
        }
      }
    })
    setSubjectData(data)
  }


  const toggleModel = () => setModal(!modal);

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }

  return (
    <div className='class'>
      <h1>Subject</h1>
      <h6 style={{ marginBottom: '30px' }}>Dashboard / <span style={{ color: 'grey' }}>Subject</span></h6>
      <div className='classContainer'>
        <div className='classFilter'>
          <form className="form-inline">
            <input onChange={handleChange} className="classFilterSearchInput form-control" placeholder="Search Name..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle style={{ background: '#ffbc53', borderRadius: '50px', display: 'flex', alignItems: 'center', borderColor: '#ffbc53', height: '31px' }} caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={filterData}>All</DropdownItem>
              <select className='select' style={{ width: '180px' }} onChange={classFilter}>
                <option selected disabled>Class</option>
                {filterByClassData?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
            </DropdownMenu>
          </Dropdown>

          <button className='headingButton mx-2' onClick={addSubject}>Add Subject</button>
        </div>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>S/N</th>
              <th className='cursor' onClick={toggleSort ? sortASD : sortDESC}>Name {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Class</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((val, index) => {
              return <tr key={index}>
                <td>{itemOffset === 7 ? index = index + 8 : index = index + 1}</td>
                <td>{val.subjectName}</td>
                <td>{val.subjectClass}</td>
                <td>
                  <img src={edit} alt='edit' className='classImgEditDelete' onClick={() => editSubjectHandler(val)} />
                  <img src={deletes} onClick={() => deleteToggleOpen(val.id)} className='classImgEditDelete' alt='delete' />
                  <Modal isOpen={modal} toggle={toggleModel}>
                    <ModalHeader toggle={toggleModel}>Delete Subject</ModalHeader>
                    <ModalBody>this record delete permanent</ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={deleteSubjectData}>Delete Record</Button>
                      <Button color="secondary" onClick={toggleModel}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </td>
              </tr>
            })}
            {!loading && subjectData?.length === 0 && <tr>
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
        {!loading && subjectData.length > 7 &&
          <div style={{ float: 'right' }} id="react-paginate" className='d-flex justify-content-between'>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="previous"
              renderOnZeroPageCount={null}
              activeClassName='active'

            />
          </div>}
      </div>
    </div>

  )
}
