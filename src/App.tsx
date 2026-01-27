import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EventPage from './pages/EventPage'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evento/:id" element={<EventPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmacao" element={<Confirmation />} />
      </Routes>
    </Router>
  )
}

export default App
