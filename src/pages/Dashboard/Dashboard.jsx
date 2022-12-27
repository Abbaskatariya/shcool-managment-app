import React, { useState } from 'react'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

import './Dashboard.css'
import student from '../../Assets/student-with-graduation-cap.png'
import crown from '../../Assets/crown.png'
import department from '../../Assets/department.png'
import database from '../../Assets/database.png'

export default function Dashboard() {
  const [areaChart, setAreaChart] = useState(data);
  const [barChart, setBarChart] = useState(data2)

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
    <div className='mx-3'>
      <br />
      <h1>Welcome Admin!</h1>
      <h6 className='classHeadingMargin'>Dashboard</h6>
      <div className='box classHeadingMargin'>
        <div className='border'>
          <div className='dashboardImgBorder dashboardImg'>
            <img src={student}  className="height mx-2" alt='' />
          </div>
          <div className='marginRight'>
            <h6>50055 <br /><p>Students</p></h6>
          </div>
        </div>

        <div className='border crownBg'>
          <div className='dashboardImg'>
            <img src={crown} className="height mx-2" alt='' />
          </div>
          <div className='marginRight'>
            <h6>50+ <br /><p>Awards</p></h6>
          </div>
        </div>

        <div className='departmentBg border'>
          <div className='dashboardImg'>
            <img src={department} className="height mx-2" alt='' />
          </div>
          <div className='marginRight'>
            <h6>30+ <br /><p>Department</p></h6>
          </div>
        </div>

        <div className='dataBaseBg border' >
          <div  className='dashboardImg'>
            <img src={database} className="height mx-2" alt='database' />
          </div>
          <div className='marginRight'>
            <h6>$ 505<br /><p>Revenue</p></h6>
          </div>
        </div>
      </div>
      <div className='box chart'>
        <div className='chartBorder'>
          <div className='d-flex justify-content-between'>
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

        <div className='chartBorder'>
          <div className='d-flex justify-content-between'>
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
