import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import IdentifyPage from './pages/identify/IdentifyPage';
import ResultPage from './pages/result/ResultPage';
import CabinetPage from './pages/cabinet/CabinetPage';
import CameraPage from './pages/camera/CameraPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/identify" element={<IdentifyPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/cabinet" element={<CabinetPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
