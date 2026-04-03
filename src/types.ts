export interface UserInput {
  productDescription: string;
  location: string;
  turnover: string;
  employees: number;
  gstRegistration: boolean;
  certifications: string[];
  sellingPlatforms: string[];
  brandTrademark: boolean;
  rawMaterials: string;
  exportExperience: boolean;
  targetCountries?: string;
  bankAccount: boolean;
  productionConsistency: boolean;
  mainConcern: string;
  businessType: 'manufacturer' | 'trader';
}

export interface AnalysisResult {
  productIdentity: {
    hsCode: string;
    category: string;
    suggestedMarkets: string[];
  };
  readinessScore: {
    score: number;
    explanation: string;
    missing: string[];
  };
  requiredActions: {
    iec: string;
    certifications: string[];
    complianceSteps: string[];
  };
  stepByStepPlan: {
    step: string;
    description: string;
  }[];
}
