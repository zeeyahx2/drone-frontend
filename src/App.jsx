import { useEffect, useState } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL
const DRONE_ID = import.meta.env.VITE_DRONE_ID

const CLOUDS = [
  { src: '/cloud1.png', top: '6%', size: 128, duration: 70, delay: -10, opacity: 0.95 },
  { src: '/cloud2.png', top: '20%', size: 96, duration: 95, delay: -60, opacity: 0.8 },
  { src: '/cloud3.png', top: '46%', size: 160, duration: 80, delay: -30, opacity: 0.9 },
  { src: '/cloud4.png', top: '64%', size: 96, duration: 110, delay: -80, opacity: 0.75 },
  { src: '/cloud5.png', top: '80%', size: 128, duration: 75, delay: -45, opacity: 0.9 },
]

export default function App() {
  const [tab, setTab] = useState('config')
  const [config, setConfig] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/configs/${DRONE_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error('not ok')
        return res.json()
      })
      .then((data) => setConfig(data))
      .catch(() => setError('Failed to load data'))
  }, [])

  return (
    <>

      <div className="sky" aria-hidden="true">
        {CLOUDS.map((c, i) => (
          <img
            key={i}
            src={c.src}
            className="cloud"
            alt=""
            style={{
              top: c.top,
              width: c.size,
              opacity: c.opacity,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
        <div className="drone-fly">
          <img src="/drone.png" className="drone" alt="" />
        </div>
      </div>

      <nav className="navbar bg-primary-subtle mb-4">
        <div className="container" style={{ maxWidth: 720 }}>
          <span className="navbar-brand mb-0 h1">Drone Dashboard</span>
        </div>
      </nav>

      <div className="container pb-4" style={{ maxWidth: 720 }}>
        <ul className="nav nav-pills mb-4 menu-bar">
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'config' ? 'active' : ''}`}
              onClick={() => setTab('config')}
            >
              View Config
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'form' ? 'active' : ''}`}
              onClick={() => setTab('form')}
            >
              Temperature Log
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'logs' ? 'active' : ''}`}
              onClick={() => setTab('logs')}
            >
              View Logs
            </button>
          </li>
        </ul>

        {error && <div className="alert alert-danger">{error}</div>}
        {!config && !error && (
          <div className="text-center my-5">
            <img src="/drone.svg" className="drone-loading" alt="" />
            <p className="text-secondary mt-3 mb-0">Loading...</p>
          </div>
        )}

        {config && tab === 'config' && <ConfigPage config={config} />}
        {config && tab === 'form' && <FormPage config={config} />}
        {config && tab === 'logs' && <LogsPage config={config} />}
      </div>
    </>
  )
}

// ---------- หน้า 1: View Config ----------
function ConfigPage({ config }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header fw-bold">Drone Config</div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex justify-content-between">
          <span>Drone ID</span>
          <strong>{config.drone_id}</strong>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Drone Name</span>
          <strong>{config.drone_name}</strong>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Light</span>
          <span
            className={`badge ${config.light === 'on' ? 'text-bg-success' : 'text-bg-secondary'}`}
          >
            {config.light}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between">
          <span>Country</span>
          <strong>{config.country}</strong>
        </li>
      </ul>
    </div>
  )
}

// ---------- หน้า 2: Temperature Log Form ----------
function FormPage({ config }) {
  const [celsius, setCelsius] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (celsius === '') {
      setSuccess(false)
      setMessage('Please enter a temperature')
      return
    }

    try {
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
        setSuccess(true)
        setMessage('Successfully saved')
        setCelsius('')
      } else {
        setSuccess(false)
        setMessage('Save failed')
      }
    } catch {
      setSuccess(false)
      setMessage('Save failed')
    }
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header fw-bold">Temperature Log</div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Temperature (°C)</label>
          <input
            type="number"
            className="form-control"
            value={celsius}
            onChange={(e) => setCelsius(e.target.value)}
          />
        </div>

        <button className="btn btn-outline-primary" onClick={handleSubmit}>
          Submit data
        </button>

        {message && (
          <div className={`alert mt-3 mb-0 ${success ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
      </div>
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
      .then((data) => setLogs(Array.isArray(data) ? data : []))
  }, [page, config.drone_id])

  return (
    <div className="card shadow-sm">
      <div className="card-header fw-bold">Temperature Logs</div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
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
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            className="btn btn-outline-primary"
            disabled={logs.length < 12}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}