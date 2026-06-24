function computeEMI(principal, annualRate, tenureMonths) {
    const monthlyRate = annualRate / 12 / 100;
    
    // If rate is 0
    if (monthlyRate === 0) {
        const monthly = principal / tenureMonths;
        return {
            emi: monthly,
            totalInterest: 0,
            totalPayable: principal
        };
    }

    // Standard EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
                
    const totalPayable = emi * tenureMonths;
    const totalInterest = totalPayable - principal;

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayable: Math.round(totalPayable)
    };
}
