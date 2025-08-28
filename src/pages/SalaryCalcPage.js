import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import './SalaryCalcPage.css';
import SegmentedControl from '../components/SegmentedControl';
import NumberInput from '../components/NumberInput';
import { calculateSalary } from '../utils/calculation';

const SalaryCalcPage = () => {
  // 입력값들을 관리할 state
  const [salaryType, setSalaryType] = useState('annual');
  const [severanceType, setSeveranceType] = useState('separate');
  const [salary, setSalary] = useState('');
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);
  const [nonTaxable, setNonTaxable] = useState('200000');
  const [focusedInput, setFocusedInput] = useState('');
  const [results, setResults] = useState(null);

  // 콤마를 제거하고 숫자만 state에 저장하는 함수
  const handleNumericChange = (setter, value) => {
    const rawValue = value.replaceAll(',', '');
    // 입력값이 숫자인 경우에만 state 업데이트
    if (!isNaN(rawValue) || rawValue === '') {
      setter(rawValue);
    }
  };

    // 금액을 더하는 함수 추가
  const addSalary = (amount) => {
    // 현재 salary state 값을 숫자로 변환 (비어있으면 0으로 처리)
    const currentSalary = Number(salary || 0);
    // 더한 값을 다시 문자열로 변환하여 state 업데이트
    setSalary(String(currentSalary + amount));
  };

  const handleReset = () => {
    setSalaryType('annual');
    setSeveranceType('separate');
    setSalary('');
    setDependents(1);
    setChildren(0);
    setNonTaxable('200000');
    setFocusedInput('');
    setResults(null); // 결과도 초기화
  };

  const handleCalculate = () => {
    const inputs = { salaryType, severanceType, salary, dependents, children, nonTaxable };
    const calculatedResults = calculateSalary(inputs);
    setResults(calculatedResults);
  };

  const handleDependentsChange = (newDependents) => {
    if (newDependents <= children) {
      alert("부양가족 수는 자녀 수보다 적을 수 없습니다.");
      return;
    }
    setDependents(newDependents);
  };

  const handleChildrenChange = (newChildren) => {
    if (newChildren >= dependents) {
      alert("자녀 수는 부양가족 수와 같거나 초과할 수 없습니다.");
      return;
    }
    setChildren(newChildren);
  };


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
        <h3 className="section-title">필수 입력</h3>
        <div className="form-group-inline">
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
        </div>
        <div className="form-group">
          <label>{salaryType === 'annual' ? '연봉' : '월급'}</label>
          <div className="input-wrapper">
            <input
              type="text"
              inputMode="numeric"
              // '원'이 보일 조건일 때 'input-with-unit' 클래스를 추가합니다.
              className={`salary-input ${(focusedInput !== 'salary' && salary) ? 'input-with-unit' : ''}`}
              value={salary ? Number(salary).toLocaleString() : ''}
              onChange={(e) => handleNumericChange(setSalary, e.target.value)}
              onFocus={() => setFocusedInput('salary')}
              onBlur={() => setFocusedInput('')}
              placeholder="금액을 입력하세요"
            />
            { (focusedInput !== 'salary' && salary) && <span className="unit-label">원</span> }
          </div>
          <div className="quick-add-buttons">
            <button onClick={() => addSalary(10000000)} className="quick-add-btn">+1000만</button>
            <button onClick={() => addSalary(1000000)} className="quick-add-btn">+100만</button>
            <button onClick={() => addSalary(100000)} className="quick-add-btn">+10만</button>
          </div>
        </div>

        <div className="divider form-divider"></div>

        <h3 className="section-title">선택 입력</h3>

        <div className="form-group-inline">
          <div className="form-group">
            <label>부양 가족 수</label>
            <NumberInput value={dependents} onChange={handleDependentsChange} min={1} />
          </div>
          <div className="form-group">
            <label>만 8세~20세 자녀 수</label>
            <NumberInput value={children} onChange={handleChildrenChange} />
          </div>
        </div>

        <div className="form-group">
            <label>비과세액 (월)</label>
            <div className="input-wrapper">
              <input
                type="text"
                inputMode="numeric"
                className={`salary-input ${(focusedInput !== 'nonTaxable' && nonTaxable) ? 'input-with-unit' : ''}`}
                value={nonTaxable ? Number(nonTaxable).toLocaleString() : ''}
                onChange={(e) => handleNumericChange(setNonTaxable, e.target.value)}
                onFocus={() => setFocusedInput('nonTaxable')}
                onBlur={() => setFocusedInput('')}
              />
              { (focusedInput !== 'nonTaxable' && nonTaxable) && <span className="unit-label">원</span> }
            </div>
        </div>

        <div className="button-group">
          <button onClick={handleReset} className="button-secondary">초기화</button>
          <button onClick={handleCalculate} className="button-primary">계산하기</button>
        </div>
      </div>

      
      {results && (
        <div className="calculator-card result-card">
          <>
            <div className="result-section net-salary-section">
              <p className="result-label">월 예상 실수령액</p>
              <div className="result-amount net-salary">
                <span>{results.netSalary.toLocaleString()}</span>
                <span className="unit">원</span>
              </div>
            </div>
          
            <div className="result-section">
              <p className="result-label">예상 공제 내역</p>
              <div className="deduction-columns"> 
                {/* 왼쪽 열: 4대 보험 */}
                <div className="column">
                  <ul className="deduction-list">
                    <li><span>국민연금</span> <span>{results.National_Pension.toLocaleString()}원</span></li>
                    <li><span>건강보험</span> <span>{results.National_Health_Insur.toLocaleString()}원</span></li>
                    <li><span>장기요양</span> <span>{results.Long_Care_Insur.toLocaleString()}원</span></li>
                    <li><span>고용보험</span> <span>{results.Employ_Insur.toLocaleString()}원</span></li>
                  </ul>
                  <div className="sub-total">
                    <span>소계</span>
                    <span>
                      {(results.National_Pension + results.National_Health_Insur + results.Long_Care_Insur + results.Employ_Insur).toLocaleString()}원
                    </span>
                  </div>
                </div>
                {/* 오른쪽 열: 세금 */}
                <div className="column">
                  <ul className="deduction-list">
                    <li><span>근로소득세</span> <span>{results.Incom_Tax.toLocaleString()}원</span></li>
                    <li><span>지방소득세</span> <span>{results.Local_Incom_tax.toLocaleString()}원</span></li>
                  </ul>
                  {/* 세금 소계 추가 */}
                  <div className="sub-total">
                    <span>소계</span>
                    <span>
                      {(results.Incom_Tax + results.Local_Incom_tax).toLocaleString()}원
                    </span>
                  </div>
                  <div className="total-deduction-section">
                    <p className="result-label">공제액 합계</p>
                    <div className="total-deduction-amount">
                      <span>{results.Tax_Total.toLocaleString()}</span>
                      <span className="unit">원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default SalaryCalcPage;