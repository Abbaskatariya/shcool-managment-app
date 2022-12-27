import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { deleteTeacherDataAPI, teacherFetchData } from '../../api/AllApi'
import edit from '../../Assets/edit.png';
import deletes from '../../Assets/delete.png'
import ModelDelete from '../../Component/ModelDelete';
import ReusablePagination from '../../Component/ReusablePagination';
import ReusableSpinner from '../../Component/ReusableSpinner';
import RecordNotFound from '../../Component/RecordNotFound';

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
  const itemsPerPage = 7
  const [itemOffset, setItemOffset] = useState(0)
  const pageCount = Math.ceil(teacherData?.length / itemsPerPage);
  const currentItems = teacherData?.slice(itemOffset * itemsPerPage,(itemOffset + 1) * itemsPerPage);

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
        const isSearch = item.name?.toLowerCase().trim().includes(search.trim().toLowerCase())
        if (dataClass && dataName && dataClass === item.classData && dataName === item.subjectData)
          return isSearch
        else if (!dataClass && dataName && dataName === item.subjectData)
          return isSearch
        else if (!dataName && dataClass && dataClass === item.classData)
          return isSearch
        else if (!dataName && !dataClass)
          return isSearch
      })
      setTeacherData(filterData)
      setItemOffset(0);
    }
  }, [location, search])

  const handleClick = (index) => {
    setItemOffset(index)
  }

  const deleteTeacherData = () => {
    const val = teacherData.filter((val) => val.id !== deleteId)
    deleteTeacherDataAPI(deleteId)
    setTeacherData(val)
    setTeacherFilter(val)
    setModal(false)
  }

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }

  const sort = (val) => {
    if (val === 'name') {
      toggleSort ? teacherData.sort((a, b) => (a.name < b.name ? -1 : 1)) : teacherData.sort((a, b) => (b.name < a.name ? -1 : 1))
      setToggleSort((val) => !val)
    } else {
      toggleSortTeacherData ? teacherData.sort((a, b) => (b.classData < a.classData ? -1 : 1)) : teacherData.sort((a, b) => (a.classData < b.classData ? -1 : 1))
      setToggleSortTeacherData((val) => !val)
    }
  }

  const filterData = async (e, filterName) => {
    if (filterName === 'all') {
      if (search) {
        const data = teacherFilter.filter(val => val.name?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
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
    const isSubjectName = filterName === 'subjectData'
    if (filterName !== 'all') {
      isSubjectName ? setDataName(e.target.value) : setDataClass(e.target.value)
      const filterData = isSubjectName ? dataClass : dataName
      const data = teacherFilter.filter(val => {
        const isTrue = filterData && val[filterName] === e.target.value && val[isSubjectName ? 'classData' : 'subjectData'] === filterData
        const isSearch = val?.name.toLowerCase().trim().includes(search.toLowerCase().trim())
        if (search) {
          if (isTrue && isSearch)
            return val
          else {
            if (val[filterName] === e.target.value && isSearch)
              return val
          }
        } else {
          if (isTrue) {
            return val
          } else {
            if (val[filterName] === e.target.value) {
              return val
            }
          }
        }
      })
      setTeacherData(data)
      if (isSubjectName) {
        const filterSubject = data.map(val => val.classData)
        setFilterByClass(filterSubject)
      } else {
        const filterName = data.map(val => val.subjectData)
        setFilterByName(filterName)
      }
    }
  }
  return (
    <div className='class'>
      <h1>Teacher</h1>
      <h6 className='classHeadingMargin'>Dashboard / <span>Teacher</span></h6>
      <div className='classContainer table-responsive'>
        <div className='classFilter'>
          <form className="form-inline">
            <input onChange={(e) => setSearch(e.target.value)} className="classFilterSearchInput form-control" placeholder="Search name..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen((prevState) => !prevState)}>
            <DropdownToggle className='classDropDownToggle' caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={(e) => filterData(e, 'all')}>All</DropdownItem>
              <select className='filterSelect' onChange={(e) => filterData(e, 'subjectData')} id="dropdown-basic-button">
                <option selected disabled>Subject</option>
                {filterByName?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
              <select className='filterSelect' onChange={(e) => filterData(e, 'classData')}>
                <option selected disabled>Class</option>
                {filterByClass?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
            </DropdownMenu>
          </Dropdown>
          <button onClick={() => navigate('/teacher/addTeacher', { state: { edit: false } })} className='headingButton mx-2'>Add Teacher</button>
        </div>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>S/N</th>
              <th className='cursor' onClick={() => sort('name')}>Name {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Gender </th>
              <th className='cursor' onClick={() => sort('class')}>Class {toggleSortTeacherData ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Subject</th>
              <th>Mobile Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((val, index) => {
              return <tr key={index}>
                <td>{index + 1}</td>
                <td><img src={val.img} alt='img' className='teacherImgShow' /> {val.name}</td>
                <td>{val.gender}</td>
                <td>{val.classData}</td>
                <td>{val.subjectData}</td>
                <td>{val.mobileNumber}</td>
                <td>
                  <img src={edit} alt='editImg' className='classImgEditDelete' onClick={() => navigate('/teacher/addTeacher', { state: { data: val, edit: true } })} />
                  <img src={deletes} alt='deleteImg' className='classImgEditDelete' onClick={() => deleteToggleOpen(val.id)} />

                </td>
              </tr>
            })}
            <RecordNotFound data={teacherData} col={'8'} />
            <ReusableSpinner loading={loading} col={'8'} />
          </tbody>
        </table>
        {!loading && teacherData.length > 7 &&
          <ReusablePagination pageCount={pageCount} itemOffset={itemOffset} handleClick={handleClick} />}
      </div>
      <ModelDelete modal={modal} setModal={setModal} deleted={deleteTeacherData} />
    </div>

  )
}
