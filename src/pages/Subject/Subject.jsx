import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import edit from '../../Assets/edit.png';
import deletes from '../../Assets/delete.png'
import { deleteSubjectDataAPI, deleteTeacherDataAPI, subjectFetchData, teacherFetchData } from '../../api/AllApi';
import ModelDelete from '../../Component/ModelDelete';
import ReusablePagination from '../../Component/ReusablePagination';
import ReusableSpinner from '../../Component/ReusableSpinner';
import RecordNotFound from '../../Component/RecordNotFound';

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
  const itemsPerPage = 7
  const [itemOffset, setItemOffset] = useState(0)
  const pageCount = Math.ceil(subjectData?.length / itemsPerPage);
  const currentItems = subjectData?.slice(itemOffset * itemsPerPage,(itemOffset + 1) * itemsPerPage);

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

  const handleClick = (index) => {
    setItemOffset(index)
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

  const sort = () => {
    toggleSort ? subjectData.sort((a, b) => (a.subjectName < b.subjectName ? -1 : 1)) : subjectData.sort((a, b) => (b.subjectName < a.subjectName ? -1 : 1))
    setToggleSort((val) => !val)
  }

  const filterData = async (e) => {
    if (e.target.value.length === 0) {
      if (search) {
        const data = subjectFilter.filter(val => val.subjectName.toLowerCase().trim().includes(search.toLowerCase().trim()))
        setSubjectData(data)
      } else {
        const data = await subjectFetchData();
        setSubjectData(data)
      }
      setFilterClass('')
    } else {
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
  }

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }

  return (
    <div className='class'>
      <h1>Subject</h1>
      <h6 className='classHeadingMargin'>Dashboard / <span>Subject</span></h6>
      <div className='classContainer table-responsive'>
        <div className='classFilter'>
          <form className="form-inline">
            <input onChange={(e) => setSearch(e.target.value)} className="classFilterSearchInput form-control" placeholder="Search Name..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen((prevState) => !prevState)}>
            <DropdownToggle className='classDropDownToggle' caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={filterData}>All</DropdownItem>
              <select className='filterSelect' onChange={filterData}>
                <option selected disabled>Class</option>
                {filterByClassData?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
            </DropdownMenu>
          </Dropdown>
          <button className='headingButton mx-2' onClick={() => navigate('/subject/addSubject', { state: { edit: false } })}>Add Subject</button>
        </div>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>S/N</th>
              <th className='cursor' onClick={sort}>Name {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Class</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((val, index) => {
              return <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.subjectName}</td>
                <td>{val.subjectClass}</td>
                <td>
                  <img src={edit} alt='edit' className='classImgEditDelete' onClick={() => navigate('/subject/addSubject', { state: { data: val, edit: true } })} />
                  <img src={deletes} onClick={() => deleteToggleOpen(val.id)} className='classImgEditDelete' alt='delete' />
                </td>
              </tr>
            })}
            {!loading && <RecordNotFound data={subjectData} col={'4'} />}
            <ReusableSpinner loading={loading} col={'4'} />
          </tbody>
        </table>
        {!loading && subjectData.length > 7 &&
         <ReusablePagination pageCount={pageCount} itemOffset={itemOffset} handleClick={handleClick}/>}
      </div>
      <ModelDelete modal={modal} setModal={setModal} deleted={deleteSubjectData} />
    </div>

  )
}
