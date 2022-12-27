import React from 'react'

export default function RecordNotFound({ data, col }) {
    return (
        <tr>
            {data?.length === 0 &&
                <td colSpan={col}>
                    <p className='text-danger d-flex justify-content-center my-2'>Record Not Found...</p>
                </td>}
        </tr>
    )
}
