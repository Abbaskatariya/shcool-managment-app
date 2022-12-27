import React from 'react'

export default function ReuseTextarea({ label, formik, name }) {
    return <div className="col-auto addClassWidth">
        <label htmlFor="exampleInputEmail1" className="form-label">{label}</label>
        <textarea className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
            value={formik.values[name]} name={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur} />
        {formik.errors[name] && formik.touched[name] ?
            (<p className='text-danger my-2'>{formik.errors[name]}</p>) :
            null}
    </div>
}
