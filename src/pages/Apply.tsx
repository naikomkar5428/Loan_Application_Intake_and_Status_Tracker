import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

type LoanType = 'Home Loan' | 'Personal Loan' | 'Business Loan' | '';

export default function Apply() {
  const [loanType, setLoanType] = useState<LoanType>('');
  const [formData, setFormData] = useState<any>({
    fullName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    salary: '',
    loanAmount: '',
    loanPurpose: '',
    employmentType: '',
    propertyValue: '',
    companyName: '',
    registrationNumber: '',
    annualTurnover: ''
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep2 = () => {
    if (!formData.fullName || formData.fullName.trim().split(/\s+/).length < 2) return "Full Name is required (First and Last name).";
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!phoneRegex.test(formData.mobileNumber)) return "Contact number must include country code (e.g. +91) and exactly 10 digits.";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Valid email is required.";
    if (!formData.dateOfBirth || !/^\d{2}-\d{2}-\d{4}$/.test(formData.dateOfBirth)) return "Date of Birth must be in DD-MM-YYYY format.";

    const [dayStr, monthStr, yearStr] = formData.dateOfBirth.split('-');
    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);
    const birthDate = new Date(year, month - 1, day);
    if (Number.isNaN(birthDate.getTime()) || birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
      return "Date of Birth is invalid.";
    }
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
    if (age < 18) return "Applicant must be at least 18 years old.";

    if (!formData.loanAmount || isNaN(formData.loanAmount) || Number(formData.loanAmount) <= 0) return "Valid positive loan amount is required.";
    
    if (loanType === 'Home Loan') {
      if (!formData.propertyValue) return "Property value is required.";
      if (!formData.employmentType) return "Employment type is required.";
    }
    if (loanType === 'Personal Loan') {
      if (!formData.salary) return "Monthly income is required.";
      if (!formData.loanPurpose) return "Loan purpose is required.";
    }
    if (loanType === 'Business Loan') {
      if (!formData.companyName) return "Company name is required.";
      if (!formData.registrationNumber) return "Registration number is required.";
      if (!formData.annualTurnover) return "Annual turnover is required.";
    }
    return null;
  };

  const proceedToSummary = () => {
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(3);
  };

  const submitApplication = async () => {
    setLoading(true);
    setError(null);

    const sanitize = (value: any) => {
      return value === '' || value === null || value === undefined ? undefined : value;
    };

    const payload = {
      loanType,
      fullName: sanitize(formData.fullName),
      email: sanitize(formData.email),
      mobileNumber: sanitize(formData.mobileNumber),
      dateOfBirth: sanitize(formData.dateOfBirth),
      loanAmount: formData.loanAmount ? Number(formData.loanAmount) : undefined,
      propertyValue: formData.propertyValue ? Number(formData.propertyValue) : undefined,
      employmentType: sanitize(formData.employmentType),
      salary: formData.salary ? Number(formData.salary) : undefined,
      loanPurpose: sanitize(formData.loanPurpose),
      companyName: sanitize(formData.companyName),
      registrationNumber: sanitize(formData.registrationNumber),
      annualTurnover: formData.annualTurnover ? Number(formData.annualTurnover) : undefined,
    };

    try {
      const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const res = await axios.post(`${BASE}/loan/apply`, payload);
      setSuccessData(res.data.referenceNumber);
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Something went wrong. Please try again later or contact branch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {step === 4 ? "Application Submitted" : "Digital Loan Application"}
        </h2>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-error/20 border border-error/50 text-red-200 px-4 py-4 rounded-xl mb-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </div>
            
            <div className="flex gap-3 mt-2 pl-8">
                <button 
                  onClick={() => setError(null)} 
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-xs font-semibold"
                >
                    Retry Submission
                </button>
                <button className="px-4 py-1.5 border border-white/20 hover:border-white/40 transition-colors rounded-lg text-xs font-semibold">
                    Contact Branch
                </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <label className="block text-gray-300 mb-2">Select Loan Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Home Loan', 'Personal Loan', 'Business Loan'].map((type) => (
                <button
                  key={type}
                  onClick={() => setLoanType(type as LoanType)}
                  className={`py-4 px-4 rounded-xl border transition-all ${
                    loanType === type 
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                disabled={!loanType}
                onClick={() => setStep(2)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="inline h-4 w-4 ml-1" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName || ''} className="premium-input" onChange={handleInputChange} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-400 mb-1">Mobile Number (e.g. +91 0000000000)</label><input type="text" name="mobileNumber" value={formData.mobileNumber || ''} maxLength={15} className="premium-input" onChange={handleInputChange} /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Email</label><input type="email" name="email" value={formData.email || ''} className="premium-input" onChange={handleInputChange} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date of Birth (DD-MM-YYYY)</label>
                <input type="text" name="dateOfBirth" placeholder="DD-MM-YYYY" value={formData.dateOfBirth || ''} className="premium-input" onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Loan Amount</label>
                <input type="number" name="loanAmount" value={formData.loanAmount || ''} className="premium-input" onChange={handleInputChange} />
              </div>
            </div>

            {loanType === 'Home Loan' && (
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">Property Value</label><input type="number" name="propertyValue" value={formData.propertyValue || ''} className="premium-input" onChange={handleInputChange} /></div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Employment Type</label>
                  {/* FEATURE 1: Form UI Dropdown themed */}
                  <select name="employmentType" value={formData.employmentType || ''} className="premium-input bg-gray-900 border-gray-700 text-gray-100" onChange={handleInputChange}>
                    <option value="">Select...</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business">Business</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {loanType === 'Personal Loan' && (
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-400 mb-1">Monthly Salary</label><input type="number" name="salary" value={formData.salary || ''} className="premium-input" onChange={handleInputChange} /></div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Loan Purpose</label>
                  <select name="loanPurpose" value={formData.loanPurpose || ''} className="premium-input bg-gray-900 border-gray-700 text-gray-100" onChange={handleInputChange}>
                    <option value="">Select...</option>
                    <option value="EDUCATION">EDUCATION</option>
                    <option value="MEDICAL">MEDICAL</option>
                    <option value="MARRIAGE">MARRIAGE</option>
                    <option value="HOME_RENOVATION">HOME_RENOVATION</option>
                    <option value="TRAVEL">TRAVEL</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>
            )}

            {loanType === 'Business Loan' && (
              <div className="space-y-4">
                <div><label className="block text-sm text-gray-400 mb-1">Company Name</label><input type="text" name="companyName" value={formData.companyName || ''} className="premium-input" onChange={handleInputChange} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">Registration No.</label><input type="text" name="registrationNumber" value={formData.registrationNumber || ''} className="premium-input" onChange={handleInputChange} /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Annual Turnover</label><input type="number" name="annualTurnover" value={formData.annualTurnover || ''} className="premium-input" onChange={handleInputChange} /></div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Back</button>
              <button onClick={proceedToSummary} className="btn-primary">Review Details</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h3 className="text-xl font-semibold mb-4 text-primary">Please review your details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-400">Loan Type:</span> {loanType}</p>
                <p><span className="text-gray-400">Name:</span> {formData.fullName}</p>
                <p><span className="text-gray-400">Contact:</span> {formData.mobileNumber}</p>
                <p><span className="text-gray-400">Email:</span> {formData.email}</p>
                <p><span className="text-gray-400">Date of Birth:</span> {formData.dateOfBirth}</p>
                <p><span className="text-gray-400">Amount:</span> ${formData.loanAmount}</p>
                {loanType === 'Home Loan' && (
                  <><p><span className="text-gray-400">Property Value:</span> ${formData.propertyValue}</p><p><span className="text-gray-400">Employment:</span> {formData.employmentType}</p></>
                )}
                {loanType === 'Personal Loan' && (
                  <><p><span className="text-gray-400">Income:</span> ${formData.salary}</p><p><span className="text-gray-400">Purpose:</span> {formData.loanPurpose}</p></>
                )}
                {loanType === 'Business Loan' && (
                  <><p><span className="text-gray-400">Company:</span> {formData.companyName}</p><p><span className="text-gray-400">Registration:</span> {formData.registrationNumber}</p><p><span className="text-gray-400">Turnover:</span> ${formData.annualTurnover}</p></>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button disabled={loading} onClick={() => setStep(2)} className="px-4 py-2 text-gray-400 hover:text-white">Edit</button>
              <button disabled={loading} onClick={submitApplication} className="btn-primary flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm & Submit'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && successData && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center py-8">
            <div className="bg-secondary/20 p-4 rounded-full mb-6 relative">
              <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full" />
              <CheckCircle className="text-secondary h-16 w-16 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
            <p className="text-gray-400 mb-6 max-w-md">Your {loanType} application has been successfully submitted. An email and SMS notification has been sent.</p>
            
            <div className="glass-card p-6 w-full max-w-sm border-secondary/30 text-center">
              <p className="text-sm text-gray-400 mb-1">Reference Number</p>
              <p className="text-3xl font-mono tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{successData}</p>
            </div>
            
            <p className="mt-8 text-sm text-gray-500">Please save this reference number to track your application status.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
