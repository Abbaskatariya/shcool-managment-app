import React from 'react'

export default function ErrorPage() {
  return (

        <div style={{ marginRight: '450px', marginTop: '120px' }} className="d-flex align-items-center justify-content-center vh-90">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    The page you’re looking for doesn’t exist.
                  </p>
                <button className="btn btn-primary">Go Home</button>
            </div>
        </div>
  )
}
