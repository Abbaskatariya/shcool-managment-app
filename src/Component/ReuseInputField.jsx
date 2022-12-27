const ReuseInputField = ({ label, type, formik, name,maxLength,disabled }) => {
    return <div className="col-auto addClassWidth" >
        <label htmlFor="exampleInputEmail1" className="form-label">{label}</label>
        <input disabled={disabled} type={type} onChange={formik.handleChange} maxLength={maxLength} onBlur={formik.handleBlur} value={formik.values[name]} name={name} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        {formik.errors[name] && formik.touched[name] ? (<p className='text-danger my-2'>{formik.errors[name]}</p>) : null}
    </div>
}

export default ReuseInputField