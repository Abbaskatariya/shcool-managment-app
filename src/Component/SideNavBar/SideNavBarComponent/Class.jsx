import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import '../SideNavBarCss/Class.css'
import { classFetchData, deleteClassDataAPI, deleteStudentDataAPI, deleteSubjectDataAPI, deleteTeacherDataAPI, studentFetchData, subjectFetchData, teacherFetchData } from '../../api/AllApi';
import edit from '../../../Assets/edit.png';
import deletes from '../../../Assets/delete.png'

export default function Class() {
  const navigate = useNavigate();
  const location = useLocation();
  const [classData, setClassData] = useState()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [classFilter, setClassFilter] = useState()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggleSort, setToggleSort] = useState(false)
  const [toggleSortDivision, setToggleSortDivision] = useState(false)
  const [medium, setMedium] = useState([])
  const [division, setDivision] = useState([])
  const [dataDivision, setDataDivision] = useState('')
  const [dataMedium, setDataMedium] = useState('')
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState()
  const [itemsPerPage] = useState(7)
  const [itemOffset, setItemOffset] = useState(0);
  
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = classData?.slice(itemOffset, endOffset);
  let pageCount = Math.ceil(classData?.length / itemsPerPage);

  useEffect(() => {
    (async () => {
      const data = await localStorage.getItem('loginAuth')
      !data && navigate('/login')
    })()
  }, [])

  useEffect(() => {
    if (!search && !dataDivision && !dataMedium) {
      (async () => {
        const data = await classFetchData();
        const medium = Array.from(new Set(data.map((val) => val.medium)))
        const division = Array.from(new Set(data.map((val) => val.division)))
        medium.sort((a, b) => a < b ? -1 : 1)
        division.sort((a, b) => a < b ? -1 : 1)
        setMedium(medium)
        setDivision(division)
        setClassData(data)
        setClassFilter(data)
        setLoading(false)
      })()
    } else {
      const filterData = classFilter?.filter((item) => {
        if (dataDivision && dataMedium && dataDivision === item.division && dataMedium === item.medium)
          return (item.standard.toString().includes(search.trim()))
        else if (!dataMedium && dataDivision && dataDivision === item.division)
          return (item.standard.toString().includes(search.trim()))
        else if (!dataDivision && dataMedium && dataMedium === item.medium)
          return (item.standard.toString().includes(search.trim()))
        else if (!dataDivision && !dataMedium)
          return (item.standard.toString().includes(search.trim()))
      })
      setClassData(filterData)
      setItemOffset(0);
    }
  }, [location, search])

  useEffect(() => {
    if (!currentItems?.length) {
      setItemOffset(0)
    }
  }, [currentItems])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % classData?.length;
    setItemOffset(newOffset);
  };

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const addClassesHandler = () => {
    navigate('/class/addClass', { state: { edit: false } })
  }

  const deleteClassData = async () => {
    const val = classData.filter((val) => val.id !== deleteId)
    const val2 = classData.find((val) => val.id === deleteId)
    deleteClassDataAPI(deleteId)
    setClassData(val)
    setClassFilter(val)
    setModal(false)

    const classToDelete = `${val2.standard}-${val2.division}-${val2.medium}`

    const studentData = await studentFetchData();
    studentData.forEach((data) => {
      const val = data.classData.split('-')
      const classData = `${val[0]}-${val[1]}-${val[2]}`
      if (classData === classToDelete) {
        deleteStudentDataAPI(data.id)
      }
    })

    const subjectData = await subjectFetchData();
    subjectData.forEach((data) => {
      if (data.subjectClass === classToDelete) {
        deleteSubjectDataAPI(data.id)
      }
    })

    const teacherData = await teacherFetchData();
    teacherData.forEach((data) => {
      if (data.classData === classToDelete) {
        deleteTeacherDataAPI(data.id)
      }
    })
  }

  const classDataEdit = (data) => {
    navigate('/class/addClass', { state: { data: data, classData, edit: true } })
  }

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const sortASD = () => {
    if (toggleSort)
      classData.sort((a, b) => (a.standard - b.standard))
    else
      classData.sort((a, b) => (b.standard - a.standard))

    setToggleSort((val) => !val)
  }

  const sort = () => {
    if (toggleSortDivision)
      classData.sort((a, b) => (a.division < b.division ? -1 : 1))
    else
      classData.sort((a, b) => (b.division < a.division ? -1 : 1))

    setToggleSortDivision((val) => !val)
  }

  const filterReset = async (e) => {
    if (e.target.value.length === 0) {
      if (search) {
        const data = classFilter.filter(val => {
          if (val.standard === search)
            return val
        })
        setClassData(data)
      } else {
        const data = await classFetchData()
        setClassData(data)
        const filterClass = Array.from(new Set(data.map(val => val.division)))
        setDivision(filterClass)

        const filterName = Array.from(new Set(data.map(val => val.medium)))
        setMedium(filterName)
      }
      setDataDivision('')
      setDataMedium('')
    }
  }

  const filterData = (e) => {
    setDataMedium(e.target.value)
    const data = classFilter.filter(val => {
      if (search) {
        if (dataDivision) {
          if (val.medium === e.target.value && val.division === dataDivision && val.standard === search)
            return val
        } else {
          if (val.medium === e.target.value && val.standard === search)
            return val
        }
      } else {
        if (dataDivision) {
          if (val.medium === e.target.value && val.division === dataDivision)
            return val
        } else {
          if (val.medium === e.target.value)
            return val
        }
      }
    })

    setClassData(data)
    const division = data.map(val => val.division)
    setDivision(division)
  }

  const divisionFilter = (e) => {
    setDataDivision(e.target.value)
    const data = classFilter.filter(val => {
      if (search) {
        if (dataMedium) {
          if (val.division === e.target.value && val.medium === dataMedium && val.standard === search)
            return val
        } else {
          if (val.division === e.target.value && val.standard === search)
            return val
        }
      } else {
        if (dataMedium) {
          if (val.division === e.target.value && val.medium === dataMedium)
            return val
        } else {
          if (val.division === e.target.value)
            return val
        }
      }
    })
    setClassData(data)
    const medium = data.map(val => val.medium)
    setMedium(medium)
  }

  const toggleModel = () => setModal(!modal);

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }

  return (
    <div className='class'>
      <h1>Class </h1>
      <h6 style={{ marginBottom: '30px' }} >Dashboard / <span style={{ color: 'grey' }}>Class</span></h6>
      <div className='classContainer'>
        <div className='classFilter'>
          <form className="form-inline">
            <input onChange={handleChange} className="classFilterSearchInput form-control" placeholder="Search standard..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle style={{ background: '#ffbc53', borderRadius: '50px', display: 'flex', alignItems: 'center', borderColor: '#ffbc53', height: '31px' }} caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={filterReset}>All</DropdownItem>
              <select className='select' style={{ width: '180px' }} onChange={filterData} id="dropdown-basic-button">
                <option selected disabled>medium</option>
                {medium?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
              <select className='select' style={{ width: '180px' }} onChange={divisionFilter}>
                <option selected disabled>Division</option>
                {division?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
            </DropdownMenu>
          </Dropdown>
          <div>
            <button onClick={addClassesHandler} className='headingButton mx-2'>Add Class</button>
          </div>
        </div>

        <table className='table  table-bordered'>
          <thead>
            <tr>
              <th>S/N</th>
              <th className='cursor' onClick={sortASD}>standard {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th className='cursor' onClick={sort}>Division {toggleSortDivision ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Medium</th>
              <th>fees</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((val, index) => {
              return <tr key={index}>
                <td>{itemOffset === 7 ? index = index + 8 : index = index + 1}</td>
                <td>{val.standard}</td>
                <td>{val.division.toUpperCase()}</td>
                <td>{val.medium.toUpperCase()}</td>
                <td>{val.fees}</td>
                <td>
                  <img src={edit} className='classImgEditDelete' alt='edit' onClick={() => classDataEdit(val)} />
                  <img src={deletes} alt='edit' className='classImgEditDelete' onClick={() => deleteToggleOpen(val.id)} />
                  <Modal isOpen={modal} toggle={toggleModel}>
                    <ModalHeader toggle={toggleModel}>Delete Class</ModalHeader>
                    <ModalBody>this record delete permanent</ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={deleteClassData}>Delete Record</Button>
                      <Button color="secondary" onClick={toggleModel}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </td>
              </tr>
            })}
            {classData?.length === 0 && <tr>
              <td colSpan={'6'}>
                <p className='text-danger d-flex justify-content-center my-2'>Record Not Found...</p>
              </td>
            </tr>}
            {loading && <tr>
              <td colSpan={'6'} >
                <div className="d-flex justify-content-center text-warning">
                  <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              </td>
            </tr>}
          </tbody>
        </table>
        {!loading && classData?.length > 7 &&
          <div style={{ float: 'right' }} id="react-paginate" className='d-flex justify-content-between'>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={7}
              pageCount={pageCount}
              activeClassName='active'
              previousLabel="previous"
              renderOnZeroPageCount={null}
            />
          </div>}
      </div>
    </div>
  )
}


