import { Link } from 'react-router-dom'
import { Car, Mail, Phone, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5 text-lg font-bold">
              <Car className="h-6 w-6 text-primary" />
              CAR SHOWROOM
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Découvrez les meilleures voitures aux meilleurs prix. Votre destination premium pour l&apos;achat de voitures de luxe au Maroc.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Liens rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 transition-colors hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/#cars" className="text-sm text-gray-400 transition-colors hover:text-primary">
                  Voitures
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 transition-colors hover:text-primary">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-primary" />
                ramdanijawad@carshowroom.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-primary" />
                +212 652669636
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Car Showroom - Tous droits réservés.
            <Heart className="h-3.5 w-3.5 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  )
}
