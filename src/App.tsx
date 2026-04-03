import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  MapPin, 
  Users, 
  IndianRupee,
  Factory,
  Store,
  Package,
  Target,
  Loader2
} from 'lucide-react';
import { UserInput, AnalysisResult } from './types';
import { analyzeExportReadiness } from './geminiService';

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserInput>({
    productDescription: '',
    location: '',
    turnover: '',
    employees: 0,
    gstRegistration: false,
    certifications: [],
    sellingPlatforms: [],
    brandTrademark: false,
    rawMaterials: '',
    exportExperience: false,
    targetCountries: '',
    bankAccount: false,
    productionConsistency: false,
    mainConcern: 'Compliance',
    businessType: 'manufacturer',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (name: keyof UserInput, value: string) => {
    setFormData(prev => {
      const current = prev[name] as string[];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter(v => v !== value) };
      }
      return { ...prev, [name]: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeExportReadiness(formData);
      setResult(data);
      setStep(4); // Results step
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Globe className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Niryat<span className="text-indigo-600">Mitra</span>
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 font-medium">
            AI-Powered Export Readiness Engine
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step <= 3 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="bg-slate-100 h-2 flex">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500" 
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              <div className="p-8 sm:p-12">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-slate-900">Business Basics</h2>
                      <p className="text-slate-500">Tell us about your product and operation.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Package className="w-4 h-4" /> Product Description
                        </label>
                        <textarea
                          name="productDescription"
                          value={formData.productDescription}
                          onChange={handleInputChange}
                          placeholder="e.g. Handmade leather bags with traditional embroidery"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> State/Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. Rajasthan"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" /> Annual Turnover (Lakhs)
                          </label>
                          <select
                            name="turnover"
                            value={formData.turnover}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                          >
                            <option value="">Select Range</option>
                            <option value="10">Under 10 Lakhs</option>
                            <option value="50">10 - 50 Lakhs</option>
                            <option value="200">50 Lakhs - 2 Cr</option>
                            <option value="1000">Above 2 Cr</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Number of Employees
                          </label>
                          <input
                            type="number"
                            name="employees"
                            value={formData.employees}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Factory className="w-4 h-4" /> Business Type
                          </label>
                          <div className="flex gap-4">
                            <button
                              onClick={() => setFormData(prev => ({ ...prev, businessType: 'manufacturer' }))}
                              className={`flex-1 py-3 rounded-xl border transition-all ${formData.businessType === 'manufacturer' ? 'bg-indigo-50 border-indigo-600 text-indigo-600 font-bold' : 'border-slate-200 text-slate-500'}`}
                            >
                              Manufacturer
                            </button>
                            <button
                              onClick={() => setFormData(prev => ({ ...prev, businessType: 'trader' }))}
                              className={`flex-1 py-3 rounded-xl border transition-all ${formData.businessType === 'trader' ? 'bg-indigo-50 border-indigo-600 text-indigo-600 font-bold' : 'border-slate-200 text-slate-500'}`}
                            >
                              Trader
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-slate-900">Compliance & Assets</h2>
                      <p className="text-slate-500">Legal and certification status of your business.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="text-indigo-600 w-5 h-5" />
                          <div>
                            <p className="font-semibold text-slate-800">GST Registration</p>
                            <p className="text-xs text-slate-500">Required for most exports</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="gstRegistration"
                          checked={formData.gstRegistration}
                          onChange={handleInputChange}
                          className="w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700">Certifications Held</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['ISO', 'FSSAI', 'BIS', 'APEDA', 'MSME'].map(cert => (
                            <button
                              key={cert}
                              onClick={() => handleMultiSelect('certifications', cert)}
                              className={`px-4 py-2 rounded-lg border text-sm transition-all ${formData.certifications.includes(cert) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                            >
                              {cert}
                            </button>
                          ))}
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, certifications: ['none'] }))}
                            className={`px-4 py-2 rounded-lg border text-sm transition-all ${formData.certifications.includes('none') ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                          >
                            None
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="text-indigo-600 w-5 h-5" />
                          <div>
                            <p className="font-semibold text-slate-800">Brand / Trademark</p>
                            <p className="text-xs text-slate-500">Registered brand name</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="brandTrademark"
                          checked={formData.brandTrademark}
                          onChange={handleInputChange}
                          className="w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Selling Platforms</label>
                        <div className="flex gap-4">
                          {['Online', 'Offline'].map(platform => (
                            <button
                              key={platform}
                              onClick={() => handleMultiSelect('sellingPlatforms', platform)}
                              className={`flex-1 py-3 rounded-xl border transition-all ${formData.sellingPlatforms.includes(platform) ? 'bg-indigo-50 border-indigo-600 text-indigo-600 font-bold' : 'border-slate-200 text-slate-500'}`}
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-slate-900">Operations & Experience</h2>
                      <p className="text-slate-500">Final details to refine your roadmap.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3">
                            <ClipboardCheck className="text-indigo-600 w-5 h-5" />
                            <p className="font-semibold text-slate-800 text-sm">Export Experience</p>
                          </div>
                          <input
                            type="checkbox"
                            name="exportExperience"
                            checked={formData.exportExperience}
                            onChange={handleInputChange}
                            className="w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-indigo-600 w-5 h-5" />
                            <p className="font-semibold text-slate-800 text-sm">Production Consistency</p>
                          </div>
                          <input
                            type="checkbox"
                            name="productionConsistency"
                            checked={formData.productionConsistency}
                            onChange={handleInputChange}
                            className="w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Main Concern</label>
                        <select
                          name="mainConcern"
                          value={formData.mainConcern}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                        >
                          <option value="Compliance">Regulatory Compliance</option>
                          <option value="Logistics">Logistics & Shipping</option>
                          <option value="Marketing">Finding Buyers</option>
                          <option value="Finance">Export Financing</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Raw Materials Used</label>
                        <input
                          type="text"
                          name="rawMaterials"
                          value={formData.rawMaterials}
                          onChange={handleInputChange}
                          placeholder="e.g. Cotton, Steel, Organic Spices"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
                  {step > 1 ? (
                    <button
                      onClick={prevStep}
                      disabled={loading}
                      className="flex items-center gap-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  ) : <div />}

                  {step < 3 ? (
                    <button
                      onClick={nextStep}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          Generate Roadmap <TrendingUp className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Score Header */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center gap-8">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64" cy="64" r="58"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="64" cy="64" r="58"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * result.readinessScore.score) / 10}
                      className="text-indigo-600 transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900">{result.readinessScore.score}/10</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Export Readiness Analysis</h2>
                  <p className="text-slate-600 leading-relaxed">{result.readinessScore.explanation}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {result.readinessScore.missing.map(item => (
                      <span key={item} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Identity */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-slate-200/40 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <FileText className="text-indigo-600 w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Product Identity</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Accurate HS Code</p>
                      <p className="text-2xl font-black text-indigo-600">{result.productIdentity.hsCode}</p>
                      <p className="text-sm text-slate-600 font-medium">{result.productIdentity.category}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-500" /> High Demand Markets
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.productIdentity.suggestedMarkets.map(market => (
                          <span key={market} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
                            {market}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Actions */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-slate-200/40 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <ShieldCheck className="text-emerald-600 w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Compliance & Certs</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-emerald-800 font-medium">{result.requiredActions.iec}</p>
                    </div>
                    {result.requiredActions.certifications.map(cert => (
                      <div key={cert} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700 font-medium">{cert}</p>
                      </div>
                    ))}
                    {result.requiredActions.complianceSteps.map(step => (
                      <div key={step} className="flex items-start gap-3 p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
                        <ClipboardCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-600">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Roadmap */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <TrendingUp className="text-amber-600 w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xl">Actionable Export Roadmap</h3>
                </div>
                
                <div className="relative space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {result.stepByStepPlan.map((step, idx) => (
                    <div key={idx} className="relative pl-12">
                      <div className="absolute left-0 top-0 w-10 h-10 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center z-10">
                        <span className="text-indigo-600 font-black text-sm">{idx + 1}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900">{step.step}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setStep(1)}
                  className="text-indigo-600 font-bold hover:underline flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Start New Assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400 text-sm">
        <p>© 2026 NiryatMitra - Empowering Indian MSMEs for Global Trade</p>
      </footer>
    </div>
  );
}
