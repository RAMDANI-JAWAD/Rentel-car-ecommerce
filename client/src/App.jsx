import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './component/Layout'
import Home from './pages/Home'
import CarDetail from './pages/CarDetail'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
