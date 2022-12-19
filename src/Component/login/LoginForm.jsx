import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './LoginForm.css'
import { LoginSchemas } from '../../Schemas'
import loginImg from '../../Assets/login.jpg'
import logo from '../../Assets/logo.png'
import { loginPostData, signInURL, signUpURL } from '../api/AllApi'

export default function LoginForm() {
    const [toggle, setToggle] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            const data = await localStorage.getItem('loginAuth')
            data && navigate('/dashboard')
        })()
    }, [])
    
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchemas,
        onSubmit: () => {
            let url;
            if (!toggle) {
                url = signInURL
            } else {
                url = signUpURL
            }
            loginPostData(url, {
                email: formik.values.email,
                password: formik.values.password,
                returnSecureToken: true
            }).then(data => {
                if (toggle) {
                    setToggle(false)
                } else {
                    navigate('/dashboard')
                    localStorage.setItem('login', JSON.stringify({
                        email: formik.values.email,
                        password: formik.values.password,
                    }))
                    localStorage.setItem('loginAuth', true)
                }
            }).catch(err => {
                alert(err.message)
            });
        }
    })
    return (
        <section className='loginSection'>
            <div className="container-fluid h-custom shadow-sm p-3 mb-5 bg-white rounded" >
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src={loginImg} className="loginImgOpacity img-fluid" alt="img" />

                        <h1 className='loginImgH1Logo d-flex justify-content-center'>
                            <img src={logo} className='imgLogo' alt='' /> Appsile
                        </h1>
                    </div>
                    <div className="col-md-8 col-lg-6  offset-xl-1">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="d-flex flex-row align-items-center justify-content-center ">
                                <h1 className="lead fw-normal  mb-0 me-3">{toggle ? 'Register' : 'Login'}</h1>
                            </div>

                            <div className="d-flex align-items-center my-4 justify-content-center">
                                <p className="text-center mx-3 mb-0">Access to our dashboard</p>
                            </div>

                            <div className="form-outline mb-4">
                                <input value={formik.values.email} name='email' type="email" id="form3Example3" onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control form-control-lg"
                                    placeholder="email" />
                                {formik.errors.email && formik.touched.email ? (<p className='alert alert-danger my-2'>{formik.errors.email}</p>) : null}
                            </div>

                            <div className="form-outline mb-3">
                                <input type="password" value={formik.values.password} name='password' id="form3Example4" className="form-control form-control-lg" onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    placeholder="password" />
                                {formik.errors.password && formik.touched.password ? (<p className='alert alert-danger my-2'>{formik.errors.password}</p>) : null}
                            </div>

                            <div style={{ marginTop: '50px' }}>
                                <button type="submit" className="btn btn-primary form-control form-control-lg">{toggle ? 'Register' : 'Login'}</button>
                                <div className="d-flex align-items-center my-4 justify-content-center">
                                    <p className="fw-bold" style={{ color: '#849cb2' }}>{!toggle && 'Forgot password?'}</p>
                                </div>
                                <div className="d-flex align-items-center my-4 justify-content-center">
                                    <p onClick={() => setToggle((val => !val))} className="align-items-center small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!"
                                    > {toggle ? 'Login' : 'Register'}</a></p>
                                </div>

                            </div>

                        </form>
                    </div>
                </div>
            </div>

        </section>
    )
}
