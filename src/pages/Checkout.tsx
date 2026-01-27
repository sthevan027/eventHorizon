import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CreditCard, Lock } from 'lucide-react'

interface Ticket {
  id: string
  name: string
  price: number
}

interface CheckoutData {
  event: {
    title: string
    date: string
    location: string
  }
  quantities: Record<string, number>
}

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const checkoutData = location.state as CheckoutData

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })

  // Se não houver dados, redirecionar para home
  useEffect(() => {
    if (!checkoutData) {
      navigate('/')
    }
  }, [checkoutData, navigate])

  if (!checkoutData) {
    return null
  }

  const tickets: Ticket[] = [
    { id: 'early-bird', name: 'EARLY BIRD PASS', price: 799 },
    { id: 'general', name: 'GENERAL ADMISSION', price: 1299 },
    { id: 'vip', name: 'VIP EXPERIENCE', price: 2599 },
  ]

  const calculateTotal = () => {
    return Object.entries(checkoutData.quantities).reduce((total, [ticketId, qty]) => {
      const ticket = tickets.find((t) => t.id === ticketId)
      return total + (ticket ? ticket.price * qty : 0)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 3) {
      // Finalizar compra
      navigate('/confirmacao', {
        state: {
          event: checkoutData.event,
          tickets: Object.entries(checkoutData.quantities)
            .filter(([, qty]) => qty > 0)
            .map(([ticketId, qty]) => {
              const ticket = tickets.find((t) => t.id === ticketId)
              return {
                name: ticket?.name || '',
                quantity: qty,
                price: ticket?.price || 0,
              }
            }),
          total: calculateTotal(),
        },
      })
    } else {
      setStep(step + 1)
    }
  }

  const total = calculateTotal()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step > s ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-24 mt-4">
            <span
              className={`text-sm font-medium ${
                step === 1 ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              Dados do Comprador
            </span>
            <span
              className={`text-sm font-medium ${
                step === 2 ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              Pagamento
            </span>
            <span
              className={`text-sm font-medium ${
                step === 3 ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              Confirmação
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-medium p-6 md:p-8">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Dados do Comprador
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CPF *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cpf}
                          onChange={(e) =>
                            setFormData({ ...formData, cpf: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Forma de Pagamento
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do Cartão *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardNumber: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome no Cartão *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardName}
                        onChange={(e) =>
                          setFormData({ ...formData, cardName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Validade *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/AA"
                          maxLength={5}
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              expiryDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData({ ...formData, cvv: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                      <Lock className="w-4 h-4" />
                      <span>Pagamento seguro e criptografado</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Confirmação
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium">
                        ✓ Verifique os dados antes de finalizar a compra
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Dados do Comprador
                      </h3>
                      <p className="text-gray-700">{formData.name}</p>
                      <p className="text-gray-700">{formData.email}</p>
                      <p className="text-gray-700">{formData.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Evento
                      </h3>
                      <p className="text-gray-700">{checkoutData.event.title}</p>
                      <p className="text-gray-700">{checkoutData.event.date}</p>
                      <p className="text-gray-700">
                        {checkoutData.event.location}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
                >
                  {step === 3 ? 'Finalizar Compra' : 'Continuar'}
                </button>
              </div>
            </form>
          </div>

          {/* Summary Sidebar */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-medium p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Resumo da Compra
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {checkoutData.event.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {checkoutData.event.date} • {checkoutData.event.location}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  {Object.entries(checkoutData.quantities)
                    .filter(([, qty]) => qty > 0)
                    .map(([ticketId, qty]) => {
                      const ticket = tickets.find((t) => t.id === ticketId)
                      if (!ticket) return null
                      return (
                        <div
                          key={ticketId}
                          className="flex justify-between mb-2 text-sm"
                        >
                          <span className="text-gray-600">
                            {ticket.name} x{qty}
                          </span>
                          <span className="text-gray-900 font-medium">
                            R$ {(ticket.price * qty).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    R$ {total.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
