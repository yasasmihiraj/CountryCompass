import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CountryDetail from './pages/CountryDetail';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:code" element={<CountryDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
