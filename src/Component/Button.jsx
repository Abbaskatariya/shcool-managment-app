import React from 'react'

export default function Button(props) {
  return (
    <button disabled={props.disabled} type="submit" className="col-auto my-2 btn btn-warning">{props.children}</button>
  )
}
