import { useEffect, useState } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL
const DRONE_ID = import.meta.env.VITE_DRONE_ID

export default function App() {
  const [tab, setTab] = useState('config')
  const [config, setConfig] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/configs/${DRONE_ID}`)
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => setError('โหลดข้อมูลไม่สำเร็จ'))
  }, [])

  return (
    <div className="container">
      <h1>Drone Dashboard</h1>

      <nav>
        <button onClick={() => setTab('config')}>View Config</button>
        <button onClick={() => setTab('form')}>Temperature Log</button>
        <button onClick={() => setTab('logs')}>View Logs</button>
      </nav>

      {error && <p>{error}</p>}
      {!config && !error && <p>กำลังโหลด...</p>}

      {config && tab === 'config' && <ConfigPage config={config} />}
      {config && tab === 'form' && <FormPage config={config} />}
      {config && tab === 'logs' && <LogsPage config={config} />}
    </div>
  )
}

// ---------- หน้า 1: View Config ----------
function ConfigPage({ config }) {
  return (
    <div className="card">
      <p><b>Drone ID:</b> {config.drone_id}</p>
      <p><b>Drone Name:</b> {config.drone_name}</p>
      <p><b>Light:</b> {config.light}</p>
      <p><b>Country:</b> {config.country}</p>
    </div>
  )
}

// ---------- หน้า 2: Temperature Log Form ----------
function FormPage({ config }) {
  const [celsius, setCelsius] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (celsius === '') {
      setMessage('กรุณากรอกอุณหภูมิ')
      return
    }

    const res = await fetch(`${API}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        drone_id: config.drone_id,
        drone_name: config.drone_name,
        country: config.country,
        celsius: Number(celsius),
      }),
    })

    if (res.ok) {
      setMessage('บันทึกสำเร็จ')
      setCelsius('')
    } else {
      setMessage('บันทึกไม่สำเร็จ')
    }
  }

  return (
    <div className="card">
      <label>Temperature (°C)</label>
      <input
        type="number"
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit data</button>
      {message && <p>{message}</p>}
    </div>
  )
}

// ---------- หน้า 3: View Logs ----------
function LogsPage({ config }) {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch(`${API}/logs/${config.drone_id}?page=${page}`)
      .then((res) => res.json())
      .then((data) => setLogs(data))
  }, [page, config.drone_id])

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Created</th>
            <th>Country</th>
            <th>Drone ID</th>
            <th>Drone Name</th>
            <th>Celsius</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{log.created}</td>
              <td>{log.country}</td>
              <td>{log.drone_id}</td>
              <td>{log.drone_name}</td>
              <td>{log.celsius}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pager">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button disabled={logs.length < 12} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}