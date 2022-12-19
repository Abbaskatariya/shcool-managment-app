import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { studentFetchData } from '../../api/AllApi'
import pay from '../../../Assets/pay.png';
import doubleTap from '../../../Assets/double-tap.png';

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
  const [itemsPerPage] = useState(7)
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = feesData?.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(feesData?.length / itemsPerPage);

  useEffect(() => {
    (async () => {
      const data = await localStorage.getItem('loginAuth')
      !data && navigate('/login')
    })()
  }, [])

  useEffect(() => {
    if (!currentItems?.length)
      setItemOffset(0)
  }, [currentItems])

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
        if (filterValue && filterValue === 'paidFees' && +item.fees?.fees === 0)
          return item.firstName.trim().toLowerCase().includes(search.trim().toLowerCase())
        else if (filterValue && filterValue === 'remaining' && +item.fees?.paidFees !== +classData[3])
          return item.firstName.trim().toLowerCase().includes(search.trim().toLowerCase())
        else if (!filterValue)
          return item.firstName.trim().toLowerCase().includes(search.trim().toLowerCase())
      })
      setFeesData(filterData)
      setItemOffset(0);
    }
  }, [location, search])

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % feesData?.length;
    setItemOffset(newOffset);
  };
  
  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const editFeesHandler = (data) => {
    navigate('/fees/addFees', { state: { data, edit: true } })
  }

  const filterReset = async (e) => {
    setFilterValue('')
    if (e.target.value === 'all') {
      if (search) {
        const data = feesFilter.filter(val => {
          if (val.firstName?.toLowerCase().trim().includes(search?.toLowerCase().trim()))
            return val
        })
        setFeesData(data)
      } else {
        const data = await studentFetchData()
        setFeesData(data)
      }
    }
  }

  const filterPaid = async (e) => {
    setFilterValue(e.target.value)
    const data = feesFilter.filter(val => {
      if (search) {
        if (+val.fees?.fees === 0 && val.firstName.trim().toLowerCase().includes(search.trim().toLowerCase()))
          return val
      } else {
        if (+val.fees?.fees === 0)
          return val
      }
    })
    setFeesData(data)
  }

  const filterRemaining = (e) => {
    setFilterValue(e.target.value)
    const data = feesFilter.filter(val => {
      const classData = val.classData.split('-')
      if (search) {
        if (+val.fees?.paidFees !== +classData[3] && val.firstName.trim().toLowerCase().includes(search.trim().toLowerCase()))
          return val
      } else {
        if (+val.fees?.paidFees !== +classData[3])
          return val
      }
    })
    setFeesData(data)
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

  const sortASD = () => {
    const data = feesData.sort((a, b) => (a.firstName < b.firstName ? -1 : 1))
    setFeesData(data)
    setToggleSort((val) => !val)
  }

  const sortDESC = () => {
    const data = feesData.sort((a, b) => (b.firstName < a.firstName ? -1 : 1))
    setFeesData(data)
    setToggleSort((val) => !val)
  }

  return (
    <div className='class'>
      <h1 >Fees</h1>
      <h6 style={{ marginBottom: '30px' }} >Dashboard / <span style={{ color: 'grey' }}>Fees</span></h6>
      {feesNotFound && <div className="feesNotFound d-flex justify-content-center text-danger my-2" role="alert">
        <strong>Fees Detail Not Found.</strong>
      </div>}
      <div className='classContainer'>
        <div className='classFilter' style={{ justifyContent: 'space-between' }}>
          <form className="form-inline">
            <input onChange={handleChange} className="classFilterSearchInput form-control" placeholder="Search student Name..." aria-label="Search" />
          </form>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle style={{ background: '#ffbc53', display: 'flex', alignItems: 'center', borderRadius: '50px', borderColor: '#ffbc53', height: '31px' }} caret>filter</DropdownToggle>
            <DropdownMenu>
              <DropdownItem value='all' onClick={filterReset}>All</DropdownItem>
              <DropdownItem value='paidFees' onClick={filterPaid}>Paid Fees</DropdownItem>
              <DropdownItem value='remaining' onClick={filterRemaining}>Remaining</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <table className='table  table-bordered'>
          <thead>
            <tr>
              <th>S/N</th>
              <th className='cursor' onClick={toggleSort ? sortASD : sortDESC}>student {toggleSort ? <i className="bi bi-arrow-down"></i> : <i className="bi bi-arrow-up"></i>}</th>
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
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{itemOffset === 7 ? index = index + 8 : index = index + 1}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.firstName}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.fees?.selectDate}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{`${val[0]}-${val[1]}-${val[2]}`} </td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.fees?.fees === undefined ? val[3] : data.fees?.fees}</td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{data.fees?.paidFees === undefined ? 0 : data.fees?.paidFees} </td>
                <td onClick={() => redirectStudentCollection(data)} className='cursor'>{val[3]} </td>
                <td onClick={() => data.fees?.fees === 0 ? redirectStudentCollection(data) : editFeesHandler(data)}>
                  {data.fees?.fees === 0 ? <img src={doubleTap} alt='edit' className='classImgEditDelete'/> :
                    <img src={pay} className='classImgEditDelete' alt='edit'/>}
                </td>
              </tr>
            })}
            {!loading && feesData.length === 0 && <tr>
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
        {!loading && feesData.length > 7 &&
          <div style={{ float: 'right' }} id="react-paginate" className='d-flex justify-content-between'>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
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
