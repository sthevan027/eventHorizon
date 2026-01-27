import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, User } from 'lucide-react'

interface HeaderProps {
  showSearch?: boolean
}

export default function Header({ showSearch = false }: HeaderProps) {
  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            EventHorizon
          </Link>

          {/* Search Bar - Desktop */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="flex items-center bg-white rounded-lg shadow-soft border border-gray-200 w-full">
                <div className="flex-1 flex items-center px-4 py-2 border-r border-gray-200">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Buscar eventos, artistas, venues"
                    className="flex-1 outline-none text-sm"
                  />
                </div>
                <div className="flex items-center px-4 py-2 border-r border-gray-200">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <select className="outline-none text-sm text-gray-600 bg-transparent">
                    <option>Qualquer Local</option>
                    <option>São Paulo, SP</option>
                    <option>Rio de Janeiro, RJ</option>
                    <option>Belo Horizonte, MG</option>
                  </select>
                </div>
                <div className="flex items-center px-4 py-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <select className="outline-none text-sm text-gray-600 bg-transparent">
                    <option>Qualquer Data</option>
                    <option>Hoje</option>
                    <option>Esta Semana</option>
                    <option>Este Mês</option>
                  </select>
                </div>
                <button className="bg-primary-600 text-white px-6 py-2 rounded-r-lg hover:bg-primary-700 transition-colors font-medium">
                  Buscar
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/criar-evento"
              className="hidden sm:block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
            >
              Criar Evento
            </Link>
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Cadastrar
            </Link>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
