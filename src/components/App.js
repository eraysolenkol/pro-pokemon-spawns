import '../styles/App.css';
import Pokemon from './Pokemon';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Item from './Item';
import Map from './Map';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:pokemonName" element={<Pokemon />} />
      <Route path="/item/:itemName" element={<Item/>} />
      <Route path="/map/:mapName" element={<Map/>} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
