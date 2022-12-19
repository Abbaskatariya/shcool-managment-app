import axios from 'axios'

export const baseURL = `https://school-management-system-61e6d-default-rtdb.firebaseio.com`

export const signInURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCGf23dB1lK18kM7teiTETa02aVtGHnmJw'

export const signUpURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCGf23dB1lK18kM7teiTETa02aVtGHnmJw'

export const classFetchData = async () => {
  const res = (await axios.get(`${baseURL}/class.json`)).data
  const responseData = await res
  const result = []
  for (let key in responseData) {
    result.push({ ...responseData[key], id: key });
  }
  return result
}

export const studentFetchData = async () => {
  const res = (await axios.get(`${baseURL}/student.json`)).data
  const responseData = await res
  const result = []
  for (let key in responseData) {
    result.push({ ...responseData[key], id: key });
  }
  return result
}

export const subjectFetchData = async () => {
  const res = (await axios.get(`${baseURL}/subject.json`)).data
  const responseData = await res
  const result = []
  for (let key in responseData) {
    result.push({ ...responseData[key], id: key });
  }
  return result
}

export const teacherFetchData = async () => {
  const res = (await axios.get(`${baseURL}/teacher.json`)).data
  const responseData = await res
  const result = []
  for (let key in responseData) {
    result.push({ ...responseData[key], id: key });
  }
  return result
}

export const feesCollectionFetchData = async (id) => {
  const res = (await axios.get(`${baseURL}/student/${id}/feesCollection.json`)).data
  const responseData = await res
  const result = []
  for (let key in responseData) {
    result.push({ ...responseData[key], id: key });
  }
  return result
}

export const classPostData = async (classData) => {
  await fetch(`${baseURL}/class.json`, {
    method: 'POST',
    body: JSON.stringify(classData),
  })
}

export const studentPostData = async (classData) => {
  await fetch(`${baseURL}/student.json`, {
    method: 'POST',
    body: JSON.stringify(classData),
  })
}

export const subjectPostData = async (classData) => {
  await fetch(`${baseURL}/subject.json`, {
    method: 'POST',
    body: JSON.stringify(classData),
  })
}

export const teacherPostData = async (classData) => {
  await fetch(`${baseURL}/teacher.json`, {
    method: 'POST',
    body: JSON.stringify(classData),
  })
}

export const feesCollectionPostData = async (id, feesCollectionData) => {
  await fetch(`${baseURL}/student/${id}/feesCollection.json`, {
    method: 'POST',
    body: JSON.stringify(feesCollectionData),
  })
}

export const deleteClassDataAPI = async (id) => {
  await axios.delete(`${baseURL}/class/${id}.json`)
}

export const deleteSubjectDataAPI = async (id) => {
  await axios.delete(`${baseURL}/subject/${id}.json`)
}

export const deleteTeacherDataAPI = async (id) => {
  await axios.delete(`${baseURL}/teacher/${id}.json`)
}

export const deleteStudentDataAPI = async (id) => {
  await axios.delete(`${baseURL}/student/${id}.json`)
}

export const putClassData = async (id, data) => {
  await axios.put(`${baseURL}/class/${id}.json`, data)
}

export const putTeacherData = async (id, data) => {
  await axios.put(`${baseURL}/teacher/${id}.json`, data)
}

export const putStudentData = async (id, data) => {
  await axios.put(`${baseURL}/student/${id}.json`, data)
}

export const putSubjectData = async (id, data) => {
  await axios.put(`${baseURL}/subject/${id}.json`, data)
}

export const putStudentFeesData = async (id, data) => {
  await axios.put(`${baseURL}/student/${id}/fees.json`, data)
}

export const loginPostData = (url, data) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return res.json().then((data) => {
        let errorMessage = 'Authentication failed!';
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message
        }
        throw new Error(errorMessage)
      });
    }
  })
}