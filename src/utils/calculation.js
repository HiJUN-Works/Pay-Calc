import taxTable from '../data/taxdata';

export const calculateSalary = (inputs) => {
  const { salaryType, severanceType, salary, dependents, children, nonTaxable } = inputs;

  // 1. 입력값 정리 및 월급여 계산
  const annualSalary = Number(salary) || 0;
  const monthlySalaryRaw = salaryType === 'annual' ? annualSalary / 12 : annualSalary;
  const monthlySalary = severanceType === 'included' ? monthlySalaryRaw * (12 / 13) : monthlySalaryRaw;
  const monthlyTaxable = monthlySalary - Number(nonTaxable);

  // 2. 4대 보험료 계산 (변수명 수정)
  const pensionCap = 6370000;
  const pensionBase = Math.min(monthlyTaxable, pensionCap);
  const National_Pension = Math.floor((pensionBase * 0.045) / 10) * 10;
  const National_Health_Insur = Math.floor((monthlyTaxable * 0.03545) / 10) * 10;
  const Long_Care_Insur = Math.floor((National_Health_Insur * 0.1295) / 10) * 10;
  const Employ_Insur = Math.floor((monthlyTaxable * 0.009) / 10) * 10;

  // 3. 근로소득세 계산 (변수명 수정)
  const monthlySalaryInThousands = monthlySalary / 1000;
  let taxRow = taxTable.find(row => monthlySalaryInThousands >= row.min && monthlySalaryInThousands < row.max);
  let baseTax = 0;
  if (taxRow) {
    const dependentsIndex = Math.min(dependents, 11) - 1;
    baseTax = taxRow.tax[dependentsIndex];
  }
  const childTaxCredit = children * 12500;
  const Incom_Tax = Math.max(0, baseTax - childTaxCredit);
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