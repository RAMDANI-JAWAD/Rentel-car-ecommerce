import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await api.post('/register', { email, password, profilePicture })
      toast.success('User registered successfully.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4] px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Create Account</h1>
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
          className="mb-4 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#ff3c00] focus:ring-1 focus:ring-[#ff3c00]"
        />
        <input
          type="url"
          placeholder="Profile Picture URL (optional)"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          className="mb-6 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#ff3c00] focus:ring-1 focus:ring-[#ff3c00]"
        />
        <button
          onClick={handleRegister}
          className="w-full rounded-lg bg-[#ff3c00] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d63100]"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}
