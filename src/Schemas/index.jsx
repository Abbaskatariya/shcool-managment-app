import * as Yup from 'yup';

export const ClassSchemas = Yup.object({
    standard: Yup.number().min(1).max(12).required('standard is Required'),
    division: Yup.string().min(1).max(1).required('division is Required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
    medium: Yup.string().max(3).required('medium is Required'),
    fees: Yup.number().min(500).max(30000).required('fees is Required'),
})

export const SubjectSchemas = Yup.object({
    subjectName: Yup.string().required('subject Name is Required'),
    subjectClass: Yup.string().required('subject Class is Required')
})

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const TeacherSchemas = Yup.object({
    name: Yup.string().min(3).max(20).required('name is Required'),
    gender: Yup.string().required('gender is Required'),
    DOB: Yup.date().max(new Date()).required(),
    joiningDate: Yup.date().max(new Date()).required(),
    mobileNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required().min(10, 'Phone number is not valid').max(10, 'Phone number is not valid'),
    qualification: Yup.string().required('Qualification is Required'),
    experience: Yup.number().required('experience is Required').min(1),
    classData: Yup.string().required('class is Required'),
    subjectData: Yup.string().required('Subject is Required'),
    img: Yup.string().required('image is Required')
})

export const StudentSchemas = Yup.object({
    firstName: Yup.string().min(3).max(20).required('first name is Required'),
    lastName: Yup.string().min(3).max(20).required('last name is Required'),
    gender: Yup.string().required('gender is Required'),
    DOB: Yup.date().max(new Date()).required(),
    classData: Yup.string().required('class is Required'),
    joiningDate: Yup.date().max(new Date()).required(),
    fatherName: Yup.string().required('father name is Required'),
    fatherOccupation: Yup.string().required('father Occupation is Required'),
    fatherMobile: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required').min(10, 'Phone number is not valid').max(10, 'Phone number is not valid'),
    fatherEmail: Yup.string().email('Email must be a valid email').required('email is required'),
    presentAddress: Yup.string().required('present Address is Required'),
    permanentAddress: Yup.string().required('permanent Address is Required')
})

export const LoginSchemas = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required('Password is required'),
})

export const FeesSchemas = Yup.object({
    paidFees: Yup.number().required('Amount Is Required').min(100)
})
