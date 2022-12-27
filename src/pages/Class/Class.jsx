import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import '../Class/Class.css'
import { classFetchData, deleteClassDataAPI, deleteStudentDataAPI, deleteSubjectDataAPI, deleteTeacherDataAPI, studentFetchData, subjectFetchData, teacherFetchData } from '../../api/AllApi';
import edit from '../../Assets/edit.png';
import deletes from '../../Assets/delete.png'
import ModelDelete from '../../Component/ModelDelete';
import ReusablePagination from '../../Component/ReusablePagination';
import ReusableSpinner from '../../Component/ReusableSpinner';
import RecordNotFound from '../../Component/RecordNotFound';

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

  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 7
  const pageCount = Math.ceil(classData?.length / itemsPerPage)
  const currentItems = classData?.slice(itemOffset * itemsPerPage, (itemOffset + 1) * itemsPerPage)

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
        const isSearch = item.standard.toString().includes(search.trim())
        if (dataDivision && dataMedium && dataDivision === item.division && dataMedium === item.medium)
          return isSearch
        else if (!dataMedium && dataDivision && dataDivision === item.division)
          return isSearch
        else if (!dataDivision && dataMedium && dataMedium === item.medium)
          return isSearch
        else if (!dataDivision && !dataMedium)
          return isSearch
      })
      setClassData(filterData)
      setItemOffset(0);
    }
  }, [location, search])

  const handleClick = (index) => {
    setItemOffset(index)
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

  const sort = (val) => {
    if (val === 'division') {
      toggleSortDivision ? classData.sort((a, b) => (a.division < b.division ? -1 : 1)) : classData.sort((a, b) => (b.division < a.division ? -1 : 1))
      setToggleSortDivision((val) => !val)
    } else {
      toggleSort ? classData.sort((a, b) => (b.standard - a.standard)) : classData.sort((a, b) => (a.standard - b.standard))
      setToggleSort((val) => !val)
    }
  }

  const filterData = async (e, filterName) => {
    if (filterName === 'all') {
      if (search) {
        const data = classFilter.filter(val => val.standard === search)
        setClassData(data)
      } else {
        const data = await classFetchData()
        setClassData(data)
        const filterClass = Array.from(new Set(data.map(val => val.division)))
        setDivision(filterClass)

        const filterDivision = Array.from(new Set(data.map(val => val.medium)))
        setMedium(filterDivision)
      }
      setDataDivision('')
      setDataMedium('')
    } else {
      const isMedium = filterName === 'medium';
      isMedium ? setDataMedium(e.target.value) : setDataDivision(e.target.value)
      const filteredData = isMedium ? dataDivision : dataMedium
      const data = classFilter.filter(val => {
        const isTrue = filteredData && val[filterName] === e.target.value && val[isMedium ? 'division' : 'medium'] === filteredData
        if (search) {
          if (isTrue && val.standard === search)
            return val
          else {
            if (val[filterName] === e.target.value && val.standard === search)
              return val
          }
        } else {
          if (isTrue)
            return val
          else {
            if (val[filterName] === e.target.value)
              return val
          }
        }
      })

      setClassData(data)
      if (isMedium) {
        const medium = data.map(val => val.medium)
        setMedium(medium)
      } else {
        const division = data.map(val => val.division)
        setDivision(division)
      }
    }
  }

  const deleteToggleOpen = (id) => {
    setDeleteId(id)
    setModal(!modal)
  }
  return (
    <div className='class'>
      <h1>Class </h1>
      <h6 className='classHeadingMargin'>Dashboard / <span>Class</span></h6>
      <div className='classContainer table-responsive'>
        <div className='classFilter'>
          <form className="form-inline">
            <input onChange={(e) => setSearch(e.target.value)} className="classFilterSearchInput form-control" placeholder="Search standard..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen((prevState) => !prevState)}>
            <DropdownToggle className='classDropDownToggle' caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={(e) => filterData(e, 'all')}>All</DropdownItem>
              <select className='filterSelect' onChange={(e) => filterData(e, 'medium')} id="dropdown-basic-button">
                <option selected disabled>medium</option>
                {medium?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
              <select className='filterSelect' onChange={(e) => filterData(e, 'division')}>
                <option selected disabled>Division</option>
                {division?.map((val, index) => {
                  return <option key={index} value={val}>{val}</option>
                })}
              </select>
            </DropdownMenu>
          </Dropdown>
          <div>
            <button onClick={() => navigate('/class/addClass', { state: { edit: false } })} className='headingButton mx-2'>Add Class</button>
          </div>
        </div>
        <div>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>S/N</th>
                <th className='cursor' onClick={() => sort('standard')}>standard {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
                <th className='cursor' onClick={() => sort('division')}>Division {toggleSortDivision ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
                <th>Medium</th>
                <th>fees</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((val, index) => {
                return <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{val.standard}</td>
                  <td>{val.division.toUpperCase()}</td>
                  <td>{val.medium.toUpperCase()}</td>
                  <td>{val.fees}</td>
                  <td>
                    <img src={edit} className='classImgEditDelete' alt='edit' onClick={() => navigate('/class/addClass', { state: { data: val, classData, edit: true } })} />
                    <img src={deletes} alt='edit' className='classImgEditDelete' onClick={() => deleteToggleOpen(val.id)} />
                  </td>
                </tr>
              })}
              <RecordNotFound data={classData} col={'6'} />
              <ReusableSpinner loading={loading} col={'6'} />
            </tbody>
          </table>
        </div>
        {!loading && classData?.length > 7 &&
          <ReusablePagination pageCount={pageCount} itemOffset={itemOffset} handleClick={handleClick} />}
      </div>
      <ModelDelete modal={modal} setModal={setModal} deleted={deleteClassData} />
    </div>
  )
}


