import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CheckCircle, Download, Share2, Eye, Calendar, MapPin } from 'lucide-react'

interface ConfirmationData {
  event: {
    title: string
    date: string
    location: string
  }
  tickets: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
}

export default function Confirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const confirmationData = location.state as ConfirmationData
  const [qrCode] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EVENTHORIZON-TICKET-12345')

  useEffect(() => {
    if (!confirmationData) {
      navigate('/')
    }
  }, [confirmationData, navigate])

  if (!confirmationData) {
    return null
  }

  const handleDownload = () => {
    // Simular download do ingresso
    alert('Download do ingresso iniciado!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ingresso: ${confirmationData.event.title}`,
        text: `Confira meu ingresso para ${confirmationData.event.title}`,
      })
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Compra Realizada com Sucesso!
          </h1>
          <p className="text-lg text-gray-600">
            Seu ingresso foi confirmado e enviado para seu e-mail
          </p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-xl shadow-strong p-8 mb-8">
          {/* QR Code */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white p-4 rounded-lg shadow-medium mb-4">
              <img
                src={qrCode}
                alt="QR Code do Ingresso"
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Código: EVENTHORIZON-TICKET-12345
            </p>
          </div>

          {/* Event Info */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {confirmationData.event.title}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                <span>{confirmationData.event.date}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                <span>{confirmationData.event.location}</span>
              </div>
            </div>
          </div>

          {/* Tickets Details */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Ingressos:</h3>
            <div className="space-y-2">
              {confirmationData.tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{ticket.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantidade: {ticket.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    R$ {(ticket.price * ticket.quantity).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-primary-600">
                R$ {confirmationData.total.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Baixar Ingresso
            </button>
            <button
              onClick={() => {
                // Navegar para visualização do ingresso
                alert('Visualizando ingresso...')
              }}
              className="flex-1 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Ver Ingresso
            </button>
            <button
              onClick={handleShare}
              className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">
            Informações Importantes:
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Apresente o QR Code na entrada do evento</li>
            <li>• Chegue com pelo menos 30 minutos de antecedência</li>
            <li>• Traga um documento de identidade com foto</li>
            <li>• O ingresso é pessoal e intransferível</li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            ← Voltar para a página inicial
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
