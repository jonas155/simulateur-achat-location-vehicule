// Calculs financiers pour les options de financement automobile

export interface FinancingParams {
  vehiclePrice: number;
  downPayment: number;
  duration: number; // en années
  mileage: number; // km/an
}

export interface CreditParams extends FinancingParams {
  interestRate: number; // taux annuel en %
}

export interface LOAParams extends FinancingParams {
  residualValueRate: number; // % de la valeur du véhicule
  monthlyPayment: number;
}

export interface LLDParams extends FinancingParams {
  monthlyPayment: number;
  maintenanceIncluded?: boolean;
  insuranceIncluded?: boolean;
}

export interface DetailedCosts {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  residualValue?: number;
  totalCostOwnership: number; // Coût réel de possession
  totalCostUsage: number; // Coût d'usage (pour comparaison)
  additionalFees: {
    establishmentFee: number;
    insurance: number;
    maintenance: number;
    penalties: number;
  };
}

// Calcul du crédit avec amortissement
export function calculateCredit(params: CreditParams): DetailedCosts {
  const { vehiclePrice, downPayment, duration, interestRate } = params;
  const principal = vehiclePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = duration * 12;

  // Calcul mensualité avec formule d'amortissement
  const monthlyPayment =
    monthlyRate > 0
      ? (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : principal / numberOfPayments;

  const totalPayments = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayments - principal;

  // Estimation valeur résiduelle après dépréciation
  const depreciationRate = 0.15; // 15% par an en moyenne
  const residualValue = vehiclePrice * Math.pow(1 - depreciationRate, duration);

  const establishmentFee = Math.min(principal * 0.012, 600); // 1.2% plafonné à 600€ (frais actuels)
  const annualInsurance = Math.max(vehiclePrice * 0.025, 600); // 2.5% par an, minimum 600€
  const annualMaintenance = 900; // 900€/an en moyenne (inflation des coûts)

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayments: Math.round(totalPayments + downPayment),
    totalInterest: Math.round(totalInterest),
    residualValue: Math.round(residualValue),
    totalCostOwnership: Math.round(totalPayments + downPayment),
    totalCostUsage: Math.round(totalPayments + downPayment - residualValue),
    additionalFees: {
      establishmentFee: Math.round(establishmentFee),
      insurance: Math.round(annualInsurance * duration),
      maintenance: Math.round(annualMaintenance * duration),
      penalties: 0,
    },
  };
}

// Calcul LOA avec option d'achat
export function calculateLOA(params: LOAParams): DetailedCosts {
  const {
    vehiclePrice,
    downPayment,
    duration,
    residualValueRate,
    monthlyPayment,
  } = params;

  const residualValue = vehiclePrice * (residualValueRate / 100);
  const totalPayments = monthlyPayment * duration * 12 + downPayment;

  // Coût total si achat (location + option)
  const totalCostOwnership = totalPayments + residualValue;
  // Coût d'usage si pas d'achat (location uniquement)
  const totalCostUsage = totalPayments;

  const establishmentFee = 350; // Forfait typique LOA (actualisé)
  const annualInsurance = Math.max(vehiclePrice * 0.02, 500); // 2% par an, minimum 500€ (souvent incluse partiellement)

  return {
    monthlyPayment,
    totalPayments: Math.round(totalPayments),
    totalInterest: 0, // Intérêts inclus dans la mensualité LOA
    residualValue: Math.round(residualValue),
    totalCostOwnership: Math.round(totalCostOwnership),
    totalCostUsage: Math.round(totalCostUsage),
    additionalFees: {
      establishmentFee,
      insurance: Math.round(annualInsurance * duration),
      maintenance: 0, // Souvent inclus
      penalties: Math.round(
        params.mileage > 15000 ? (params.mileage - 15000) * 0.1 * duration : 0
      ),
    },
  };
}

// Calcul LLD
export function calculateLLD(params: LLDParams): DetailedCosts {
  const { monthlyPayment, duration, downPayment, mileage } = params;

  const totalPayments = monthlyPayment * duration * 12 + downPayment;

  const establishmentFee = 200; // Forfait typique LLD
  const penaltyOverMileage =
    mileage > 15000 ? (mileage - 15000) * 0.12 * duration : 0; // 0.12€/km dépassé

  return {
    monthlyPayment,
    totalPayments: Math.round(totalPayments),
    totalInterest: 0,
    residualValue: 0, // Pas de propriété en LLD
    totalCostOwnership: 0, // Pas d'option propriété
    totalCostUsage: Math.round(totalPayments),
    additionalFees: {
      establishmentFee,
      insurance: 0, // Incluse
      maintenance: 0, // Inclus
      penalties: Math.round(penaltyOverMileage),
    },
  };
}

// Estimation des taux selon profil
export function estimateInterestRate(
  vehiclePrice: number,
  downPaymentRatio: number
): number {
  // Taux moyens approximatifs fin 2024 (contexte de taux élevés)
  if (downPaymentRatio >= 0.3) return 4.8; // Bon apport
  if (downPaymentRatio >= 0.15) return 5.8; // Apport moyen
  return 7.2; // Apport faible
}

// Estimation valeur résiduelle LOA selon durée
export function estimateResidualValue(duration: number): number {
  if (duration <= 2) return 60; // 60% après 2 ans (marché tendu)
  if (duration <= 3) return 50; // 50% après 3 ans
  if (duration <= 4) return 42; // 42% après 4 ans (dépréciation accélérée)
  if (duration <= 5) return 32; // 32% après 5 ans
  return 25; // 25% après 6+ ans
}
