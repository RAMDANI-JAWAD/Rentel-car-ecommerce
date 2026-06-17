import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/card'
import { Heart, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editImage, setEditImage] = useState('')
  const [, setVersion] = useState(0)

  const email = localStorage.getItem('email') || ''
  const name = localStorage.getItem('name') || ''
  const profilePicture = localStorage.getItem('profilePicture') || ''
  const isAdmin = email === 'admin@admin.com'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    api.get('/favorites')
      .then((r) => setFavorites(r.data))
      .catch(() => {})
  }, [])

  const removeFavorite = async (carId) => {
    try {
      const res = await api.delete(`/favorites/${carId}`)
      setFavorites(res.data.favorites)
      toast.success('Removed from favorites.')
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('profilePicture')
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  const handleEditProfile = async () => {
    try {
      const res = await api.put('/user/update', { name: editName, profilePicture: editImage })
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('profilePicture', res.data.profilePicture)
      setEditing(false)
      setVersion((v) => v + 1)
      toast.success(res.data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    }
  }

  const openEdit = () => {
    setEditName(localStorage.getItem('name') || '')
    setEditImage(localStorage.getItem('profilePicture') || '')
    setEditing(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <div className="mb-10 rounded-2xl bg-white p-8 text-center shadow-lg">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-[#ff3c00] object-cover shadow-md"
          />
        ) : (
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#ff3c00] bg-gray-200 text-3xl font-bold text-gray-500 shadow-md">
            {email.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="mb-1 text-3xl font-bold tracking-tight">{name || email}</h1>
        {name && <p className="mb-2 text-sm text-gray-400">{email}</p>}
        <p className="mb-6 text-gray-500">Welcome to your dashboard!</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={openEdit}
            className="rounded-lg border border-[#ff3c00] px-6 py-2 text-sm font-semibold text-[#ff3c00] transition-colors hover:bg-[#ff3c00] hover:text-white"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-[#ff3c00] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d63100]"
          >
            Logout
          </button>
        </div>
      </div>

      {editing && (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-bold">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your display name"
                className="h-11 w-full rounded-lg border border-gray-300 bg-background px-4 text-sm outline-none focus:border-[#ff3c00] focus:ring-1 focus:ring-[#ff3c00]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Profile Picture URL</label>
              <p className="mb-2 text-xs text-gray-400">
                Tip: Upload your image to ImgBB or Cloudinary, then paste the direct link here.
              </p>
              <input
                type="url"
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="h-11 w-full rounded-lg border border-gray-300 bg-background px-4 text-sm outline-none focus:border-[#ff3c00] focus:ring-1 focus:ring-[#ff3c00]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleEditProfile}
                className="rounded-lg bg-[#ff3c00] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d63100]"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="mb-10 rounded-2xl border-2 border-primary/20 bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Manage Cars
            </button>
          </div>
        </div>
      )}

      <h2 className="mb-6 text-2xl font-bold">My Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">You have no favorite cars yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <img
                src={car.mainImage}
                alt={car.name}
                className="h-44 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{car.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{car.year}</p>
                <p className="mt-1 font-bold text-[#ff3c00]">{car.price}</p>
                <button
                  onClick={() => removeFavorite(car.id)}
                  className="mt-3 flex items-center gap-1.5 text-sm text-red-500 transition-colors hover:text-red-700"
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  Remove
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
