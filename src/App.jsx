import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import PokeInfo from './pages/PokeInfo'
import Pokedex from './pages/Pokedex'
import PokeFooter from './components/shared/PokeFooter'
import Evolves from './components/shared/pokedex/Evolves'

function App() {
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route>
          <Route path='pokedex' element={<Pokedex/>}/>
          <Route path='pokedex/:id' element={<PokeInfo/>}/>
          <Route path='pokedex/evolves/:id' element={<Evolves />} />
        </Route>
      </Routes>
      <PokeFooter/>
    </div>
  )
}

export default App;