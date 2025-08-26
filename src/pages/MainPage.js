import React from 'react';
import './MainPage.css';
import HexagonButton from '../components/HexagonButton';
import { DollarSign, BarChart2, Calendar, FileText } from 'react-feather';
import { Link } from 'react-router-dom'; // Link 컴포넌트 불러오기

const MainPage = () => {
  return (
    <div className="main-container">
      <header className="main-header">
        <h1>Pay-Calc</h1>
        <p>근로 계산기</p>
      </header>
      <main className="hexagon-grid">
        {/* 각 버튼을 Link 컴포넌트로 감싸줍니다. */}
        <Link to="/salary" style={{ textDecoration: 'none' }}>
          <HexagonButton icon={<DollarSign size={40} />} label="급여 계산" />
        </Link>
        <Link to="/severance" style={{ textDecoration: 'none' }}>
          <HexagonButton icon={<BarChart2 size={40} />} label="퇴직금 계산" />
        </Link>
        <Link to="/annual-leave" style={{ textDecoration: 'none' }}>
          <HexagonButton icon={<Calendar size={40} />} label="연차/휴가 계산" />
        </Link>
        <Link to="/insurance" style={{ textDecoration: 'none' }}>
          <HexagonButton icon={<FileText size={40} />} label="4대보험/세금" />
        </Link>
      </main>
    </div>
  );
};

export default MainPage;