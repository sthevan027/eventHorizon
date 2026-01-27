import { Minus, Plus } from 'lucide-react'

interface TicketType {
  id: string
  name: string
  price: number
  status: 'available' | 'selling-fast' | 'limited' | 'sold-out'
  statusText: string
}

interface TicketSelectorProps {
  tickets: TicketType[]
  quantities: Record<string, number>
  onQuantityChange: (ticketId: string, quantity: number) => void
}

export default function TicketSelector({
  tickets,
  quantities,
  onQuantityChange,
}: TicketSelectorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selling-fast':
        return 'text-red-600'
      case 'limited':
        return 'text-orange-600'
      case 'sold-out':
        return 'text-gray-500'
      default:
        return 'text-green-600'
    }
  }

  const total = tickets.reduce((sum, ticket) => {
    return sum + ticket.price * (quantities[ticket.id] || 0)
  }, 0)

  return (
    <div className="bg-white rounded-xl shadow-medium p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">INGRESSOS</h2>
      
      <div className="space-y-4 mb-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="border-b border-gray-200 pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm uppercase mb-1">
                  {ticket.name}
                </h3>
                <p className={`text-xs ${getStatusColor(ticket.status)}`}>
                  {ticket.statusText}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-900">
                  R$ {ticket.price.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            
            {ticket.status !== 'sold-out' ? (
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600">Quantidade</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onQuantityChange(
                        ticket.id,
                        Math.max(0, (quantities[ticket.id] || 0) - 1)
                      )
                    }
                    disabled={(quantities[ticket.id] || 0) === 0}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantities[ticket.id] || 0}
                  </span>
                  <button
                    onClick={() =>
                      onQuantityChange(
                        ticket.id,
                        (quantities[ticket.id] || 0) + 1
                      )
                    }
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Esgotado</p>
            )}
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              R$ {total.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
