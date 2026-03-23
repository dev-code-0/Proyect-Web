import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Preview from './pages/Preview';
import ViewGift from './pages/ViewGift'; // <- IMPORTA ESTO
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template/:id" element={<Preview />} />
        <Route path="/view/:id" element={<ViewGift />} /> {/* <- NUEVA RUTA */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;