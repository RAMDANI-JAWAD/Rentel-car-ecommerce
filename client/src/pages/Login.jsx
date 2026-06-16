import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.email)
      localStorage.setItem('name', data.name || '')
      localStorage.setItem('profilePicture', data.profilePicture || '')
      toast.success(data.message)
      navigate('/dashboard')
    } catch {
      toast.error('Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4] px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#ff3c00] focus:ring-1 focus:ring-[#ff3c00]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#ff3c00] focus:ring-1 focus:ring-[#ff3c00]"
        />
        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-[#ff3c00] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d63100]"
        >
          Login
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#ff3c00] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
