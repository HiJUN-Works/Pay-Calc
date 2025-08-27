import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import './SalaryCalcPage.css';
import SegmentedControl from '../components/SegmentedControl';
import NumberInput from '../components/NumberInput';

const SalaryCalcPage = () => {
  // 입력값들을 관리할 state
  const [salaryType, setSalaryType] = useState('annual');
  const [severanceType, setSeveranceType] = useState('separate');
  const [salary, setSalary] = useState('');
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);
  const [nonTaxable, setNonTaxable] = useState('200000');

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={24} />
        <span>메인으로</span>
      </Link>

      <header className="page-header">
        <h2>연봉 실수령액 계산기</h2>
        <p>연봉/월급을 기준으로 실수령액을 계산합니다.</p>
      </header>

      <div className="calculator-card">
        <div className="form-section">
          <h3 className="section-title">필수 입력</h3>
          <div className="form-group">
            <label>급여 기준</label>
            <SegmentedControl
              name="salaryType"
              options={[{ label: '연봉', value: 'annual' }, { label: '월급', value: 'monthly' }]}
              selected={salaryType}
              onChange={setSalaryType}
            />
          </div>
          <div className="form-group">
            <label>퇴직금</label>
            <SegmentedControl
              name="severanceType"
              options={[{ label: '별도', value: 'separate' }, { label: '포함', value: 'included' }]}
              selected={severanceType}
              onChange={setSeveranceType}
            />
          </div>
          <div className="form-group">
            <label>{salaryType === 'annual' ? '연봉' : '월급'}</label>
            <input
              type="number"
              className="salary-input"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="금액을 입력하세요"
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">선택 입력</h3>
          <div className="form-group-inline">
            <div className="form-group">
              <label>부양 가족 수 (본인포함)</label>
              <NumberInput value={dependents} onChange={setDependents} min={1} />
            </div>
            <div className="form-group">
              <label>20세 이하 자녀 수</label>
              <NumberInput value={children} onChange={setChildren} />
            </div>
          </div>
          <div className="form-group">
              <label>비과세액 (월)</label>
              <input
                type="number"
                className="salary-input"
                value={nonTaxable}
                onChange={(e) => setNonTaxable(e.target.value)}
              />
          </div>
        </div>

        <div className="button-group">
          <button className="button-secondary">초기화</button>
          <button className="button-primary">계산하기</button>
        </div>
      </div>

      <div className="calculator-card result-card">
        {/* 결과 표시 영역은 다음 단계에서 구현합니다. */}
      </div>
    </div>
  );
};

export default SalaryCalcPage;