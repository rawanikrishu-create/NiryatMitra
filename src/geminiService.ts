import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, AnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeExportReadiness(input: UserInput): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    As an expert International Trade Consultant and AI Export Readiness Engine, analyze the following MSME business details and provide a comprehensive export roadmap.
    
    Business Details:
    - Product Description: ${input.productDescription}
    - Location: ${input.location}
    - Annual Turnover: ${input.turnover} Lakhs
    - Employees: ${input.employees}
    - GST Registered: ${input.gstRegistration ? 'Yes' : 'No'}
    - Current Certifications: ${input.certifications.join(', ')}
    - Selling Platforms: ${input.sellingPlatforms.join(', ')}
    - Brand/Trademark: ${input.brandTrademark ? 'Yes' : 'No'}
    - Raw Materials: ${input.rawMaterials}
    - Previous Export Experience: ${input.exportExperience ? 'Yes' : 'No'}
    - Target Countries: ${input.targetCountries || 'Not specified'}
    - Bank Account: ${input.bankAccount ? 'Yes' : 'No'}
    - Production Consistency: ${input.productionConsistency ? 'Yes' : 'No'}
    - Main Concern: ${input.mainConcern}
    - Business Type: ${input.businessType}

    Please provide the output in the following JSON structure:
    {
      "productIdentity": {
        "hsCode": "6-digit or 8-digit HS Code",
        "category": "Specific Product Category",
        "suggestedMarkets": ["Country 1", "Country 2", "Country 3"]
      },
      "readinessScore": {
        "score": number (0-10),
        "explanation": "Detailed explanation of the score",
        "missing": ["Item 1", "Item 2"]
      },
      "requiredActions": {
        "iec": "Details about IEC requirement",
        "certifications": ["Specific Cert 1", "Specific Cert 2"],
        "complianceSteps": ["Step 1", "Step 2"]
      },
      "stepByStepPlan": [
        { "step": "Step Title", "description": "Detailed actionable description" }
      ]
    }

    Ensure the HS Code is accurate for the product description. 
    Identify high-demand markets specifically for this product.
    List specific certifications required (e.g., CE, FDA, GOTS, etc.) based on the product and potential markets.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productIdentity: {
              type: Type.OBJECT,
              properties: {
                hsCode: { type: Type.STRING },
                category: { type: Type.STRING },
                suggestedMarkets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["hsCode", "category", "suggestedMarkets"]
            },
            readinessScore: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
                missing: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["score", "explanation", "missing"]
            },
            requiredActions: {
              type: Type.OBJECT,
              properties: {
                iec: { type: Type.STRING },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                complianceSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["iec", "certifications", "complianceSteps"]
            },
            stepByStepPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["step", "description"]
              }
            }
          },
          required: ["productIdentity", "readinessScore", "requiredActions", "stepByStepPlan"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
