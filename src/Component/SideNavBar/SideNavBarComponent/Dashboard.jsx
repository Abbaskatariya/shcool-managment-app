import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

import student from '../../../Assets/student-with-graduation-cap.png'
import crown from '../../../Assets/crown.png'
import department from '../../../Assets/department.png'
import database from '../../../Assets/database.png'

export default function Dashboard() {
  const [areaChart, setAreaChart] = useState(data);
  const [barChart, setBarChart] = useState(data2)

  const navigate = useNavigate()
  useEffect(() => {
    (async () => {
      const data = await localStorage.getItem('loginAuth')
      !data && navigate('/login')
    })()
  }, [])

  const chartValueChange = (e) => {
    if (e.target.value === 'yesterday')
      setAreaChart(data2)

    if (e.target.value === 'toDay')
      setAreaChart(data)
  }

  const barChartOnChangeHandler = (e) => {
    if (e.target.value === 'Yesterday')
      setBarChart(data)

    if (e.target.value === 'today')
      setBarChart(data2)
  }

  return (
    <div style={{ marginRight: '50px' }}>
      <br />
      <br />
      <h1>Welcome Admin!</h1>
      <h6 style={{ marginBottom: '50px' }}>Dashboard</h6>
      <div className='d-flex justify-content-around' style={{  marginBottom: '50px'}}>
        <div className='border'>
          <div className='dashboardImg'>
            <img src={student} style={{ height: '21px' }} className="mx-2" alt='' />
          </div>
          <div style={{ marginRight: '20px' }}>
            <h6>50055 <br /><p>Students</p></h6>
          </div>
        </div>

        <div className='border' style={{ background: '#8bd6fd' }}>
          <div style={{ border: '1px solid #18aefa', background: '#18aefa' }} className='dashboardImg'>
            <img src={crown} style={{ height: '21px' }} className="mx-2" alt='' />
          </div>
          <div style={{ marginRight: '20px' }}>
            <h6>50+ <br /><p>Awards</p></h6>
          </div>
        </div>

        <div className='border' style={{ background: '#fab3a1' }}>
          <div style={{ border: '1px solid #f56741', background: '#f56741' }} className='dashboardImg'>
            <img src={department} style={{ width: 'auto', height: '21px', }} className="mx-2" alt='' />
          </div>
          <div style={{ marginRight: '20px' }}>
            <h6>30+ <br /><p>Department</p></h6>
          </div>
        </div>

        <div className='border' style={{ background: '#b6b5fb' }}>
          <div style={{ border: '1px solid #6e6bfa', background: '#6e6bfa' }} className='dashboardImg'>
            <img src={database} style={{ width: 'auto', height: '21px', }} className="mx-2" alt='' />
          </div>
          <div style={{ marginRight: '20px' }}>
            <h6>$ 505<br /><p>Revenue</p></h6>
          </div>
        </div>
      </div>
      <div className='class d-flex justify-content-around'>
        <div style={{ border: '1px solid #e7eaed', borderRadius: '5px' }}>
          <div className='d-flex justify-content-between' style={{ padding: '5px' }}>
            <h6>
              Revenue
            </h6>
            <select onChange={chartValueChange}>
              <option value='toDay'>Today</option>
              <option value='yesterday'>Yesterday</option>
            </select>
          </div>
          <AreaChart width={550} height={320} data={areaChart}
            margin={{ top: 30, right: 30, left: 0, bottom: 0 }} >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38aee8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38aee8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f4c26b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f4c26b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid horizontal={true} vertical={false} />
            <Tooltip />
            <Area type="monotone" stackId="a" dataKey="uv" stroke="#38aee8" fill="url(#colorUv)" />
            <Area type="monotone" dataKey="pv" stackId="b" stroke="#f4c26b" fillOpacity={1} fill="url(#colorPv)" />
          </AreaChart>
        </div>

        <div style={{ border: '1px solid #e7eaed', borderRadius: '5px' }}>
          <div  style={{ padding: '5px' }} className='d-flex justify-content-between'>
            <h6>
              Number of Students
            </h6>
            <select onChange={barChartOnChangeHandler}>
              <option value='today'>Today</option>
              <option value='Yesterday'>Yesterday</option>
            </select>
          </div>
          <BarChart
            width={550}
            height={320}
            data={barChart}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid horizontal={true} vertical={false} />
            <Bar dataKey="pv" stackId="a" fill="#febd50" />
            <Bar dataKey="amt" stackId="a" fill="#18aefa" />
          </BarChart>
        </div>
      </div>
    </div>
  )
}
const data = [
  {
    "name": "Jan",
    "uv": 0,
    "pv": 0,
    "amt": 0
  },
  {
    "name": "Feb",
    "uv": 55,
    "pv": 40,
    "amt": 20
  },
  {
    "name": "Mar",
    "uv": 75,
    "pv": 35,
    "amt": 30
  },
  {
    "name": "Apr",
    "uv": 50,
    "pv": 45,
    "amt": 40
  },
  {
    "name": "May",
    "uv": 40,
    "pv": 30,
    "amt": 50
  },
  {
    "name": "Jun",
    "uv": 65,
    "pv": 50,
    "amt": 60
  },
  {
    "name": "jul",
    "uv": 0,
    "pv": 0,
    "amt": 70
  },
]

const data2 = [
  {
    "name": "Jan",
    "uv": 0,
    "pv": 10,
    "amt": 10
  },
  {
    "name": "Feb",
    "uv": 55,
    "pv": 40,
    "amt": 20
  },
  {
    "name": "Mar",
    "uv": 75,
    "pv": 45,
    "amt": 30
  },
  {
    "name": "Apr",
    "uv": 50,
    "pv": 45,
    "amt": 40
  },
  {
    "name": "May",
    "uv": 40,
    "pv": 30,
    "amt": 50
  },
  {
    "name": "Jun",
    "uv": 65,
    "pv": 50,
    "amt": 60
  },
  {
    "name": "jul",
    "uv": 80,
    "pv": 40,
    "amt": 70
  },
  {
    "name": "Aug",
    "uv": 40,
    "pv": 70,
    "amt": 80
  },
  {
    "name": "Sep",
    "uv": 35,
    "pv": 90,
    "amt": 90
  },
  {
    "name": "Oct",
    "uv": 95,
    "pv": 5,
    "amt": 100
  },
  {
    "name": "Nov",
    "uv": 10,
    "pv": 45,
    "amt": 110
  },
  {
    "name": "Dec",
    "uv": 30,
    "pv": 80,
    "amt": 120
  },
]
