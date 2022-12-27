import React from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

export default function ReusablePagination({ itemOffset, handleClick,pageCount}) {
    let pageNumbers = [];
    for (let i = 0; i < pageCount; i++) {
      pageNumbers.push(
        <PaginationItem key={i} active={itemOffset === i ? true : false}>
          <PaginationLink onClick={() => handleClick(i)} >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return (
        <Pagination className='sideNavBarRightIcon'>
            <PaginationItem disabled={0 >= itemOffset}>
                <PaginationLink onClick={() => handleClick(itemOffset - 1)} >previous</PaginationLink>
            </PaginationItem>
            {pageNumbers}
            <PaginationItem disabled={itemOffset >= pageCount - 1}>
                <PaginationLink onClick={() => handleClick(itemOffset + 1)} >next</PaginationLink>
            </PaginationItem>
        </Pagination>
    )
}
