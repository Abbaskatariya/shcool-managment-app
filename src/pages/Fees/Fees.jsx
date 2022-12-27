import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { studentFetchData } from '../../api/AllApi'
import pay from '../../Assets/pay.png';
import doubleTap from '../../Assets/double-tap.png';
import ReusablePagination from '../../Component/ReusablePagination';
import ReusableSpinner from '../../Component/ReusableSpinner';
import RecordNotFound from '../../Component/RecordNotFound';

export default function Fees() {
  const navigate = useNavigate()
  const location = useLocation()
  const [feesData, setFeesData] = useState([])
  const [feesFilter, setFeesFilter] = useState()
  const [search, setSearch] = useState('')
  const [feesNotFound, setFeesNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggleSort, setToggleSort] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('')
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 7
  const pageCount = Math.ceil(feesData?.length / itemsPerPage);
  const currentItems = feesData?.slice(itemOffset * itemsPerPage, (itemOffset + 1) * itemsPerPage);

  useEffect(() => {
    if (!search && !filterValue) {
      (async () => {
        const data = await studentFetchData()
        setFeesData(data)
        setFeesFilter(data)
        setLoading(false)
      })()
    } else {
      const filterData = feesFilter?.filter(item => {
        const classData = item.classData.split('-')
        const isSearch = item.firstName.trim().toLowerCase().includes(search.trim().toLowerCase())
        if (filterValue && filterValue === 'paidFees' && +item.fees?.fees === 0)
          return isSearch
        else if (filterValue && filterValue === 'remaining' && +item.fees?.paidFees !== +classData[3])
          return isSearch
        else if (!filterValue)
          return isSearch
      })
      setFeesData(filterData)
      setItemOffset(0);
    }
  }, [location, search])

  const handleClick = (index) => {
    setItemOffset(index)
  }

  const filterHandler = async (e, filterValue) => {
    if (filterValue === 'all') {
      setFilterValue('')
      if (search) {
        const data = feesFilter.filter(val => val.firstName?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
        setFeesData(data)
      } else {
        const data = await studentFetchData()
        setFeesData(data)
      }
    }
    if (filterValue !== 'all') {
      const data = feesFilter.filter(val => {
        const isSearch = val.firstName.trim().toLowerCase().includes(search.trim().toLowerCase())
        setFilterValue(e.target.value)
        if (filterValue === 'paidFees') {
          const isFees = +val.fees?.fees === 0
          if (search) {
            if (isFees && isSearch)
              return val
          } else {
            if (isFees)
              return val
          }
        } else {
          const classData = val.classData.split('-')
          const isPaidFees = +val.fees?.paidFees !== +classData[3]
          if (search) {
            if (isPaidFees && isSearch)
              return val
          } else {
            if (isPaidFees)
              return val
          }
        }
      })
      setFeesData(data)
    }
  }

  const redirectStudentCollection = (data) => {
    if (data.fees) {
      setFeesNotFound(false)
      navigate('/fees/feesCollection', { state: data })
    } else {
      setFeesNotFound(true)
      setTimeout(() => {
        setFeesNotFound(false)
      }, 1500);
    }
  }
  const backgroundColor = 'green'
  const color = 'white'

  const sort = () => {
    toggleSort ? feesData.sort((a, b) => (b.firstName < a.firstName ? -1 : 1)) : feesData.sort((a, b) => (a.firstName < b.firstName ? -1 : 1))
    setToggleSort((val) => !val)
  }

  return (
    <div className='class'>
      <h1 >Fees</h1>
      <h6 className='classHeadingMargin'>Dashboard / <span >Fees</span></h6>
      {feesNotFound && <div className="feesNotFound d-flex justify-content-center text-danger my-2" role="alert">
        <strong>Fees Detail Not Found.</strong>
      </div>}
      <div className='classContainer table-responsive'>
        <div className='classFilter space-between'>
          <form className="form-inline">
            <input onChange={(e) => setSearch(e.target.value)} className="classFilterSearchInput form-control" placeholder="Search student Name..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen((prevState) => !prevState)}>
            <DropdownToggle className='classDropDownToggle' caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem value='all' onClick={(e) => filterHandler(e, 'all')}>All</DropdownItem>
              <DropdownItem value='paidFees' onClick={(e) => filterHandler(e, 'paidFees')}>Paid Fees</DropdownItem>
              <DropdownItem value='remaining' onClick={(e) => filterHandler(e, 'remaining')}>Remaining</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <table className='table  table-bordered'>
          <thead>
            <tr>
              <th>S/N</th>
              <th className='cursor' onClick={sort}>student {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
              <th>Date</th>
              <th>Class</th>
              <th>Remaining Fees</th>
              <th>paid Fees</th>
              <th>Total Fees</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((data, index) => {
              const val = data.classData.split('-')
              return <tr key={index} style={{ background: data.fees?.fees === 0 ? backgroundColor : '', color: data.fees?.fees === 0 ? color : '' }}>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{index + 1}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.firstName}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.fees?.selectDate}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{`${val[0]}-${val[1]}-${val[2]}`} </td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.fees?.fees === undefined ? val[3] : data.fees?.fees}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.fees?.paidFees === undefined ? 0 : data.fees?.paidFees} </td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{val[3]} </td>
                <td onClick={() => data.fees?.fees === 0 ? redirectStudentCollection(data) : navigate('/fees/addFees', { state: { data, edit: true } })}>
                  {data.fees?.fees === 0 ? <img src={doubleTap} alt='edit' className='classImgEditDelete' /> :
                    <img src={pay} className='classImgEditDelete' alt='edit' />}
                </td>
              </tr>
            })}
            {!loading && <RecordNotFound data={feesData} col={'8'} />}
            <ReusableSpinner loading={loading} col={'8'} />
          </tbody>
        </table>
        {!loading && feesData.length > 7 &&
          <ReusablePagination pageCount={pageCount} itemOffset={itemOffset} handleClick={handleClick} />}
      </div>
    </div>
  )
}
