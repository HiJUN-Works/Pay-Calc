import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SalaryCalcPage from './pages/SalaryCalcPage';
import SeveranceCalcPage from './pages/SeveranceCalcPage';
import AnnualLeaveCalcPage from './pages/AnnualLeaveCalcPage';
import InsuranceCalcPage from './pages/InsuranceCalcPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/salary" element={<SalaryCalcPage />} />
          <Route path="/severance" element={<SeveranceCalcPage />} />
          <Route path="/annual-leave" element={<AnnualLeaveCalcPage />} />
          <Route path="/insurance" element={<InsuranceCalcPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;