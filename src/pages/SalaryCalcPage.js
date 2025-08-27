import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import './SalaryCalcPage.css';
import SegmentedControl from '../components/SegmentedControl';
import NumberInput from '../components/NumberInput';
import { calculateSalary } from '../utils/calculation';
import Tooltip from '../components/Tooltip';

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
            <NumberInput value={dependents} onChange={setDependents} min={1} />
          </div>
          <div className="form-group">
            <label>20세 이하 자녀 수</label>
            <NumberInput value={children} onChange={setChildren} />
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

      <div className="calculator-card result-card">
          {results ? (
            <>
              <div className="result-section">
                <p className="result-label">월 예상 실수령액</p>
                <p className="result-amount net-salary">{results.netSalary.toLocaleString()}원</p>
              </div>
              <div className="divider"></div>
              <div className="result-section">
                <p className="result-label">한 달 기준 공제액</p>
                <ul className="deduction-list">
                  <li>
                    <span>
                      국민연금
                      <Tooltip text="[과세금액 * 4.5%]"/>
                    </span> 
                    <span>{results.National_Pension.toLocaleString()}원</span>
                  </li>
                  <li>
                    <span>
                      건강보험 (3.545%) 
                      <Tooltip text="[과세금액 * 3.545%]"/>
                    </span> 
                    <span>{results.National_Health_Insur.toLocaleString()}원</span>
                  </li>
                  <li>
                    <span>
                      장기요양 
                      <Tooltip text="[건강보험료 * 12.95%]"/>
                    </span> 
                    <span>{results.Long_Care_Insur.toLocaleString()}원</span>
                  </li>
                  <li>
                    <span>
                      고용보험
                      <Tooltip text="[(과세금액 - 비과세액) * 0.9%]"/>
                    </span> 
                    <span>{results.Employ_Insur.toLocaleString()}원</span>
                  </li>
                  <li>
                    <span>
                      소득세 
                      <Tooltip text="[간이세액표 및 부양 가족 수, 20세 이사 자녀 수 기준]"/>
                    </span> 
                    <span>{results.Incom_Tax.toLocaleString()}원</span>
                  </li>
                  <li>
                    <span>
                      지방소득세
                      <Tooltip text="[소득세 * 10%]"/>
                    </span> 
                    <span>{results.Local_Incom_tax.toLocaleString()}원</span>
                  </li>
                </ul>
                <div className="divider"></div>
                <div className="total-deduction">
                  <span>공제액 합계</span>
                  <span className="total-deduction-amount">{results.Tax_Total.toLocaleString()}원</span>
                </div>
              </div>
            </>
          ) : (
            <p className="no-result">계산기 버튼을 눌러주세요.</p>
          )}
      </div>
    </div>
  );
};

export default SalaryCalcPage;