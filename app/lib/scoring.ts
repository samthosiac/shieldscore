// lib/scoring.ts
// ShieldScore AI scoring engine
// Runs entirely client-side — no data ever leaves the browser

export interface FinancialInput {
  annualIncome: number;        // USD
  monthlyDebt: number;         // USD/month
  totalAssets: number;         // USD
  employmentYears: number;     // years at current job
  creditHistory: number;       // years of credit history
  missedPayments: number;      // count in last 2 years
}

export interface ScoreResult {
  aiScore: number;             // 0-100
  incomeTier: 0 | 1 | 2;      // bucketed for ZK circuit
  debtRatioTier: 0 | 1 | 2;
  assetTier: 0 | 1 | 2;
  eligibility: 'ELIGIBLE' | 'REVIEW' | 'INELIGIBLE';
  reasons: string[];
}

// Bucket a continuous value into 0/1/2 tiers
function toTier(value: number, low: number, high: number): 0 | 1 | 2 {
  if (value <= low) return 0;
  if (value >= high) return 2;
  return 1;
}

// Core AI scoring logic (rule-based model for demo, can swap for ONNX model)
export function computeScore(input: FinancialInput): ScoreResult {
  const reasons: string[] = [];
  let score = 50; // base score

  // --- Income factor (max +20) ---
  const monthlyIncome = input.annualIncome / 12;
  if (input.annualIncome >= 80000) {
    score += 20;
  } else if (input.annualIncome >= 40000) {
    score += 10;
  } else {
    score -= 10;
    reasons.push('Income below recommended threshold');
  }

  // --- Debt-to-income ratio (max +20) ---
  const dti = monthlyIncome > 0 ? input.monthlyDebt / monthlyIncome : 1;
  if (dti < 0.2) {
    score += 20;
  } else if (dti < 0.36) {
    score += 10;
  } else if (dti < 0.5) {
    score -= 5;
    reasons.push('Elevated debt-to-income ratio');
  } else {
    score -= 20;
    reasons.push('High debt-to-income ratio');
  }

  // --- Asset ratio (max +15) ---
  const assetRatio = input.annualIncome > 0 ? input.totalAssets / input.annualIncome : 0;
  if (assetRatio >= 3) {
    score += 15;
  } else if (assetRatio >= 1) {
    score += 8;
  } else {
    reasons.push('Limited assets vs income');
  }

  // --- Employment years (max +10) ---
  if (input.employmentYears >= 3) {
    score += 10;
  } else if (input.employmentYears >= 1) {
    score += 5;
  } else {
    score -= 5;
    reasons.push('Short employment history');
  }

  // --- Credit history (max +10) ---
  if (input.creditHistory >= 5) {
    score += 10;
  } else if (input.creditHistory >= 2) {
    score += 5;
  } else {
    score -= 5;
    reasons.push('Limited credit history');
  }

  // --- Missed payments (max +5, min -25) ---
  if (input.missedPayments === 0) {
    score += 5;
  } else if (input.missedPayments <= 2) {
    score -= 10;
    reasons.push('Recent missed payments');
  } else {
    score -= 25;
    reasons.push('Multiple missed payments');
  }

  const aiScore = Math.max(0, Math.min(100, Math.round(score)));
  const incomeTier = toTier(input.annualIncome, 40000, 80000);
  const debtRatioTier = toTier(dti, 0.2, 0.36);
  const assetTier = toTier(assetRatio, 1, 3);

  let eligibility: 'ELIGIBLE' | 'REVIEW' | 'INELIGIBLE';
  if (debtRatioTier === 2 && incomeTier === 0) eligibility = 'INELIGIBLE';
  else if (aiScore < 40) eligibility = 'INELIGIBLE';
  else if (aiScore > 70 && debtRatioTier < 2) eligibility = 'ELIGIBLE';
  else eligibility = 'REVIEW';
  if (eligibility === 'ELIGIBLE' && reasons.length === 0) reasons.push('Strong financial profile');

  return {
    aiScore,
    incomeTier,
    debtRatioTier,
    assetTier,
    eligibility,
    reasons,
  };
}
