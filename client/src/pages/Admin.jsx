import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, Car, Trash2, UserCog, Plus, LogOut } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('cars')
  const [cars, setCars] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [fuel, setFuel] = useState('Essence')
  const [year, setYear] = useState(new Date().getFullYear())

  const role = localStorage.getItem('role')
  const name_ = localStorage.getItem('name') || localStorage.getItem('email')

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/dashboard')
      return
    }
  }, [role, navigate])

  useEffect(() => {
    if (tab === 'cars') {
      api.get('/cars').then(r => { setCars(r.data); setLoading(false) }).catch(() => setLoading(false))
    } else {
      api.get('/admin/users').then(r => { setUsers(r.data); setLoading(false) }).catch(() => setLoading(false))
    }
  }, [tab])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('profilePicture')
    localStorage.removeItem('role')
    navigate('/login')
  }

  async function handleDeleteCar(carId) {
    if (!confirm('Delete this car?')) return
    try {
      await api.delete(`/admin/cars/${carId}`)
      setCars(prev => prev.filter(c => c.id !== carId))
      toast.success('Car deleted.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete car.')
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u._id !== userId))
      toast.success('User deleted.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.')
    }
  }

  async function handleToggleRole(userId, currentRole) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u))
      toast.success(`User role changed to ${newRole}.`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role.')
    }
  }

  async function handleAddCar(e) {
    e.preventDefault()
    try {
      await api.post('/cars', { name, brand, price, mainImage, image2, image3, videoUrl, fuel, year: Number(year) })
      toast.success('Car added!')
      setShowAddForm(false)
      setName(''); setBrand(''); setPrice(''); setMainImage('')
      setImage2(''); setImage3(''); setVideoUrl(''); setFuel('Essence')
      setYear(new Date().getFullYear())
      const res = await api.get('/cars')
      setCars(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add car.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">{name_}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="rounded-lg border border-gray-300 px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="mb-8 flex gap-2 border-b pb-2">
        <button
          onClick={() => setTab('cars')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${tab === 'cars' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Car className="h-4 w-4" /> Cars
        </button>
        <button
          onClick={() => setTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${tab === 'users' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Users className="h-4 w-4" /> Users
        </button>
      </div>

      {tab === 'cars' && (
        <>
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" /> {showAddForm ? 'Cancel' : 'Add Car'}
            </button>
          </div>

          {showAddForm && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-bold">Add New Car</h2>
                <form onSubmit={handleAddCar} className="grid gap-4 sm:grid-cols-2">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Brand" className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" required className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input value={mainImage} onChange={e => setMainImage(e.target.value)} placeholder="Main Image URL" className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input value={image2} onChange={e => setImage2(e.target.value)} placeholder="Image 2 URL" className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input value={image3} onChange={e => setImage3(e.target.value)} placeholder="Image 3 URL" className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video URL" className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <select value={fuel} onChange={e => setFuel(e.target.value)} className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option>Essence</option><option>Diesel</option><option>Hybride</option><option>Électrique</option>
                  </select>
                  <input type="number" value={year} onChange={e => setYear(e.target.value)} min="2000" max="2030" className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  <button type="submit" className="h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover sm:col-span-2">Add Car</button>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground py-10">Loading...</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Image</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Brand</th>
                    <th className="px-4 py-3 text-left font-medium">Price</th>
                    <th className="px-4 py-3 text-left font-medium">Year</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cars.map(car => (
                    <tr key={car.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        {car.mainImage ? (
                          <img src={car.mainImage} alt="" className="h-10 w-14 rounded object-cover" />
                        ) : (
                          <div className="h-10 w-14 rounded bg-gray-200" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{car.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{car.brand || '-'}</td>
                      <td className="px-4 py-3">{car.price}</td>
                      <td className="px-4 py-3">{car.year || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/edit-car/${car.id}`)}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cars.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No cars found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'users' && (
        <>
          {loading ? (
            <p className="text-center text-muted-foreground py-10">Loading...</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Joined</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleRole(user._id, user.role)}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 flex items-center gap-1"
                            title="Toggle admin/user role"
                          >
                            <UserCog className="h-3.5 w-3.5" />
                            {user.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
