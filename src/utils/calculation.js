import taxTable from '../data/taxdata';

export const calculateSalary = (inputs) => {
  const { salaryType, severanceType, salary, dependents, children, nonTaxable } = inputs;

  // 1. 입력값 정리 및 월급여 계산
  const annualSalary = Number(salary) || 0;
  const monthlySalaryRaw = salaryType === 'annual' ? annualSalary / 12 : annualSalary;
  const monthlySalary = severanceType === 'included' ? monthlySalaryRaw * (12 / 13) : monthlySalaryRaw;
  const monthlyTaxable = monthlySalary - Number(nonTaxable);

  // 2. 4대 보험료 계산
  const pensionCap = 6370000; // 국민연금 상한액
  const pensionBase = Math.min(monthlyTaxable, pensionCap);
  const National_Pension = Math.floor((pensionBase * 0.045) / 10) * 10;
  const National_Health_Insur = Math.floor((monthlyTaxable * 0.03545) / 10) * 10;
  const Long_Care_Insur = Math.floor((National_Health_Insur * 0.1295) / 10) * 10;
  const Employ_Insur = Math.floor((monthlyTaxable * 0.009) / 10) * 10;

  // 3. 근로소득세 계산
  const dependentsIndex = Math.min(dependents, 11) - 1;
  const monthlySalaryInThousands = monthlySalary / 1000;
  let taxRow = taxTable.find(row => monthlySalaryInThousands >= row.min && monthlySalaryInThousands < row.max);
  let baseTax = 0;
  
  if (taxRow) {
    baseTax = taxRow.tax[dependentsIndex];
  }

  // --- 고소득자 세금 계산 로직 ---
  const monthlySalaryInKRW = monthlySalary;
  const taxFor10M = taxTable.find(row => row.min === 10000)?.tax[dependentsIndex] || 0;

  if (monthlySalaryInKRW > 10000000 && monthlySalaryInKRW <= 14000000) {
    baseTax = taxFor10M + ((monthlySalaryInKRW - 10000000) * 0.98 * 0.35) + 25000;
  } else if (monthlySalaryInKRW > 14000000 && monthlySalaryInKRW <= 28000000) {
    baseTax = taxFor10M + 1397000 + ((monthlySalaryInKRW - 14000000) * 0.98 * 0.38);
  } else if (monthlySalaryInKRW > 28000000 && monthlySalaryInKRW <= 30000000) {
    baseTax = taxFor10M + 6610600 + ((monthlySalaryInKRW - 28000000) * 0.98 * 0.40);
  } else if (monthlySalaryInKRW > 30000000 && monthlySalaryInKRW <= 45000000) {
    baseTax = taxFor10M + 7394600 + ((monthlySalaryInKRW - 30000000) * 0.40);
  } else if (monthlySalaryInKRW > 45000000 && monthlySalaryInKRW <= 87000000) {
    baseTax = taxFor10M + 13394600 + ((monthlySalaryInKRW - 45000000) * 0.42);
  } else if (monthlySalaryInKRW > 87000000) {
    baseTax = taxFor10M + 31034600 + ((monthlySalaryInKRW - 87000000) * 0.45);
  }

  // --- 자녀 세액 공제 로직 수정 시작 ---
  let childTaxCredit = 0;
  if (children === 1) {
    childTaxCredit = 12500;
  } else if (children === 2) {
    childTaxCredit = 29160;
  } else if (children >= 3) {
    childTaxCredit = 29160 + (children - 2) * 25000;
  }

  const Incom_Tax = Math.floor(Math.max(0, baseTax - childTaxCredit) / 10) * 10;
  const Local_Incom_tax = Math.floor((Incom_Tax * 0.1) / 10) * 10;

  // 4. 최종 결과 집계 (변수명 수정)
  const Tax_Total = National_Pension + National_Health_Insur + Long_Care_Insur + Employ_Insur + Incom_Tax + Local_Incom_tax;
  const netSalary = Math.round(monthlySalary - Tax_Total);

  return {
    netSalary,
    Tax_Total,
    National_Pension,
    National_Health_Insur,
    Long_Care_Insur,
    Employ_Insur,
    Incom_Tax,
    Local_Incom_tax,
  };
};