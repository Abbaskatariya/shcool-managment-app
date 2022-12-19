import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import { deleteTeacherDataAPI, teacherFetchData } from '../../api/AllApi'
import edit from '../../../Assets/edit.png';
import deletes from '../../../Assets/delete.png'

export default function Teacher() {
  const navigate = useNavigate()
  const location = useLocation()
  const [teacherData, setTeacherData] = useState()
  const [teacherFilter, setTeacherFilter] = useState()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggleSort, setToggleSort] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toggleSortTeacherData, setToggleSortTeacherData] = useState(false)
  const [filterByName, setFilterByName] = useState([])
  const [filterByClass, setFilterByClass] = useState([])
  const [dataName, setDataName] = useState('');
  const [dataClass, setDataClass] = useState('');
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState()
  const [itemsPerPage] = useState(7)
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = teacherData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(teacherData?.length / itemsPerPage);

  useEffect(() => {
    (async () => {
      const data = await localStorage.getItem('loginAuth')
      !data && navigate('/login')
    })()
  }, [])

  useEffect(() => {
    if (!search && !dataName && !dataClass) {
      (async () => {
        const response = await teacherFetchData()
        const classData = Array.from(new Set(response.map((val) => val.classData)))
        const firstName = Array.from(new Set(response.map((val) => val.subjectData)))
        classData.sort((a, b) => a < b ? -1 : 1)
        firstName.sort((a, b) => a < b ? -1 : 1)
        setTeacherData(response)
        setTeacherFilter(response)
        setLoading(false)
        setFilterByName(firstName)
        setFilterByClass(classData)
      })()
    } else {
      const filterData = teacherFilter?.filter((item) => {
        if (dataClass && dataName && dataClass === item.classData && dataName === item.subjectData)
          return item.name?.toLowerCase().trim().includes(search.trim().toLowerCase())
        else if (!dataClass && dataName && dataName === item.subjectData)
          return item.name?.toLowerCase().trim().includes(search.trim().toLowerCase())
        else if (!dataName && dataClass && dataClass === item.classData)
          return item.name?.toLowerCase().trim().includes(search.trim().toLowerCase())
        else if (!dataName && !dataClass)
          return item.name?.toLowerCase().trim().includes(search.trim().toLowerCase())
      })
      setTeacherData(filterData)
      setItemOffset(0);
    }
  }, [location, search])

  useEffect(() => {
    if (!currentItems?.length) {
      setItemOffset(0)
    }
  }, [currentItems])

  const addTeacherHandler = () => {
    navigate('/teacher/addTeacher', { state: { edit: false } })
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const editTeacherHandler = (data) => {
    navigate('/teacher/addTeacher', { state: { data, edit: true } })
  }

  const deleteTeacherData = () => {
    const val = teacherData.filter((val) => val.id !== deleteId)
    deleteTeacherDataAPI(deleteId)
    setTeacherData(val)
    setTeacherFilter(val)
    setModal(false)
  }

  const toggleModel = () => setModal(!modal);

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % teacherData?.length;
    setItemOffset(newOffset);
  };

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const sortASD = () => {
    if (toggleSort)
      teacherData.sort((a, b) => (a.name < b.name ? -1 : 1))
    else
      teacherData.sort((a, b) => (b.name < a.name ? -1 : 1))

    setToggleSort((val) => !val)
  }

  const sortClassData = () => {
    if (toggleSortTeacherData)
      teacherData.sort((a, b) => (a.classData < b.classData ? -1 : 1))
    else
      teacherData.sort((a, b) => (b.classData < a.classData ? -1 : 1))

    setToggleSortTeacherData((val) => !val)
  }

  const filterReset = async (e) => {
    if (e.target.value.length === 0) {
      if (search) {
        const data = teacherFilter.filter(val => {
          if (val.name?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
            return val
        })
        setTeacherData(data)
      } else {
        const data = await teacherFetchData()
        setTeacherData(data)

        const filterClass = Array.from(new Set(data.map(val => val.classData)))
        setFilterByClass(filterClass)

        const filterName = Array.from(new Set(data.map(val => val.subjectData)))
        setFilterByName(filterName)
      }
      setDataClass('')
      setDataName('')
    }
  }

  const filterData = async (e) => {
    setDataName(e.target.value)
    const data = teacherFilter.filter(val => {
      if (search) {
        if (dataClass) {
          if (val.subjectData === e.target.value && val.classData === dataClass && val.name?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
            return val
        } else {
          if (val.subjectData === e.target.value && val.name?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
            return val
        }
      } else {
        if (dataClass) {
          if (val.subjectData === e.target.value && val.classData === dataClass)
            return val
        } else {
          if (val.subjectData === e.target.value)
            return val
        }
      }
    })
    setTeacherData(data)
    const filterSubject = data.map(val => val.classData)
    setFilterByClass(filterSubject)
  }

  const filterClassName = (e) => {
    setDataClass(e.target.value)
    const data = teacherFilter.filter(val => {
      if (search) {
        if (dataName) {
          if (val.classData === e.target.value && val.subjectData === dataName && val.name?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
            return val
        } else {
          if (val.classData === e.target.value && val.name?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
            return val
        }
      } else {
        if (dataName) {
          if (val.classData === e.target.value && val.subjectData === dataName)
            return val
        } else {
          if (val.classData === e.target.value)
            return val
        }
      }
    })
    setTeacherData(data)
    const filterName = data.map(val => val.subjectData)
    setFilterByName(filterName)
  }
  return (
    <div className='class'>
      <h1>Teacher</h1>
      <h6 style={{ marginBottom: '30px' }}>Dashboard / <span style={{ color: 'grey' }}>Teacher</span></h6>
      <div className='classContainer'>
        <div className='classFilter'>
          <form className="form-inline">
            <input onChange={handleChange} className="classFilterSearchInput form-control" placeholder="Search name..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle style={{ background: '#ffbc53', borderRadius: '50px', display: 'flex', alignItems: 'center', borderColor: '#ffbc53', height: '31px' }} caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={filterReset}>All</DropdownItem>
              <select className='select' style={{ width: '180px' }} onChange={filterData} id="dropdown-basic-button">
                <option selected disabled>Subject</option>
                {filterByName?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
              <select className='select' style={{ width: '180px' }} onChange={filterClassName}>
                <option selected disabled>Class</option>
                {filterByClass?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
            </DropdownMenu>
          </Dropdown>
          <button onClick={addTeacherHandler} className='headingButton mx-2'>Add Teacher</button>
        </div>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>S/N</th>
              <th className='cursor' onClick={sortASD}>Name {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Gender </th>
              <th className='cursor' onClick={sortClassData}>Class {toggleSortTeacherData ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Subject</th>
              <th>Mobile Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((val, index) => {
              return <tr key={index}>
                <td>{itemOffset === 7 ? index = index + 8 : index = index + 1}</td>
                <td><img src={val.img} alt='img' style={{ height: '25px', width: '25px', borderRadius: '50px' }} /> {val.name}</td>
                <td>{val.gender}</td>
                <td>{val.classData}</td>
                <td>{val.subjectData}</td>
                <td>{val.mobileNumber}</td>
                <td>
                  <img src={edit} alt='editImg' className='classImgEditDelete' onClick={() => editTeacherHandler(val)} />
                  <img src={deletes} alt='deleteImg' className='classImgEditDelete' onClick={() => deleteToggleOpen(val.id)} />
                  <Modal isOpen={modal} toggle={toggleModel}>
                    <ModalHeader toggle={toggleModel}>Delete Teacher</ModalHeader>
                    <ModalBody>this record delete permanent</ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={deleteTeacherData}>Delete Record</Button>
                      <Button color="secondary" onClick={toggleModel}>Cancel</Button>
                    </ModalFooter>
                  </Modal>

                </td>
              </tr>
            })}
            {teacherData?.length === 0 && <tr>
              <td colSpan={'8'}>
                <p className='d-flex justify-content-center text-danger my-2'>Record Not Found...</p>
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
        {!loading && teacherData.length > 7 &&
          <div style={{ float: 'right' }} id="react-paginate" className='d-flex justify-content-between'>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="previous"
              activeClassName='active'
              renderOnZeroPageCount={null}
            />
          </div>}
      </div>
    </div>

  )
}
