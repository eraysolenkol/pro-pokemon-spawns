import './App.css';
import Pokemon from './Pokemon';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:pokemonName" element={<Pokemon />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
