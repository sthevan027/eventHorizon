import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Sobre Nós
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Contato
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Central de Ajuda
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Termos
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Privacidade
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Blog
            </a>
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
