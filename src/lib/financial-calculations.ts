// Calculs financiers pour les options de financement automobile

export interface FinancingParams {
  vehiclePrice: number;
  downPayment: number; // Apport initial (réduit le capital à financer)
  duration: number; // en années
  mileage: number; // km/an
}

export interface CreditParams extends FinancingParams {
  interestRate: number; // taux annuel en %
  monthlyPayment: number; // mensualité saisie par l'utilisateur (capital + intérêts)
}

export interface LOAParams {
  vehiclePrice: number;
  firstPaymentLOA: number; // Premier loyer majoré LOA (optionnel)
  duration: number; // en années
  mileage: number; // km/an
  residualValueRate: number; // % de la valeur du véhicule
  monthlyPayment: number;
}

export interface LLDParams {
  vehiclePrice: number;
  firstPaymentLLD: number; // Premier loyer majoré pour LLD (pas d'apport qui réduit le capital)
  duration: number; // en années
  mileage: number; // km/an
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

// Calcul du crédit avec mensualité fournie par l'utilisateur
export function calculateCredit(params: CreditParams): DetailedCosts {
  const { vehiclePrice, downPayment, duration, monthlyPayment, interestRate } =
    params;
  const principal = vehiclePrice - downPayment; // L'apport réduit le capital à financer

  // Calcul des intérêts réels basé sur le taux et la durée
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = duration * 12;

  // Calcul de la mensualité théorique avec le taux d'intérêt
  const theoreticalMonthlyPayment =
    monthlyRate > 0
      ? (principal *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : principal / numberOfPayments; // Si taux = 0

  // Utilise la mensualité saisie mais calcule les intérêts basés sur le taux d'intérêt réel
  // Cela donne une estimation plus précise des intérêts que de simplement soustraire le capital des paiements totaux
  const totalPayments = monthlyPayment * numberOfPayments;
  const theoreticalTotalPayments = theoreticalMonthlyPayment * numberOfPayments;
  const totalInterest = Math.round(theoreticalTotalPayments - principal);

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
    firstPaymentLOA,
    duration,
    residualValueRate,
    monthlyPayment,
  } = params;

  const residualValue = vehiclePrice * (residualValueRate / 100);
  // Pour la LOA : premier loyer majoré (optionnel) + mensualités normales
  const totalPayments = monthlyPayment * duration * 12 + firstPaymentLOA;

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
  const { monthlyPayment, duration, firstPaymentLLD, mileage } = params;

  // Pour la LLD : premier loyer majoré + mensualités normales (pas d'apport qui réduit le capital)
  const totalPayments = monthlyPayment * duration * 12 + firstPaymentLLD;

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
