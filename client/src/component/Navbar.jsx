import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Car, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/button'

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Voitures', path: '/#cars' },
  { label: 'À propos', path: '/about' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

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
          </nav>
        </div>
      )}
    </header>
  )
}
