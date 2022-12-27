import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()
  return (
    <div className="d-flex align-items-center justify-content-center vh-90 errorPage">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
        <p className="lead"> The page you’re looking for doesn’t exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Dashboard</button>
      </div>
    </div>
  )
}
