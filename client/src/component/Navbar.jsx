import { useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Car, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Voitures', path: '/#cars' },
  { label: 'À propos', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

function getAuth() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
  }
}

function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('email')
  localStorage.removeItem('name')
  localStorage.removeItem('profilePicture')
  localStorage.removeItem('role')
}

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { token, role } = useMemo(() => getAuth(), [pathname])
  const isAdmin = role === 'admin'

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <Car className="h-6 w-6 text-primary" />
          <span>CAR SHOWROOM</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "relative px-5 py-2.5 text-sm font-medium transition-colors rounded-md",
                pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {pathname === link.path && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => token ? handleLogout() : navigate('/login')}
            className="ml-4 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {token ? 'Logout' : 'Login'}
          </button>
          {token && (
            <button
              onClick={() => navigate('/dashboard')}
              className="ml-2 rounded-md border border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Dashboard
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="ml-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Admin
            </button>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1.5 px-6 pb-6 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-5 py-3.5 text-sm font-medium transition-colors",
                  pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { token ? handleLogout() : navigate('/login'); setMobileOpen(false) }}
              className="mt-2 rounded-md bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {token ? 'Logout' : 'Login'}
            </button>
            {token && (
              <button
                onClick={() => { navigate('/dashboard'); setMobileOpen(false) }}
                className="rounded-md border border-primary px-5 py-3.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Dashboard
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => { navigate('/admin'); setMobileOpen(false) }}
                className="rounded-md bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Admin
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
