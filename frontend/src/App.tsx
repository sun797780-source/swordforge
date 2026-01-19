import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import Home from './components/Home'
import StarFireHeritage from './components/StarFireHeritage'
import EquipmentControl from './components/SpiritCollaborate'
import DivineEngine from './components/DivineEngine'
import About from './components/About'
import Support from './components/Support'
import Admin from './components/Admin'

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/heritage" element={<StarFireHeritage />} />
                        <Route path="/equipment" element={<EquipmentControl />} />
                        <Route path="/ai-design" element={<DivineEngine />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
