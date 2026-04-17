import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, FileWarning } from 'lucide-react';
import axios from 'axios';

export default function Track() {
  const [refId, setRefId] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const res = await axios.get(`${BASE}/loan/status/${refId}`);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Could not fetch status. Please check your Reference Number.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors: any = {
    'Received': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Under Review': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Approved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Additional Documents Required': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-4">Track Application Status</h2>
        <p className="text-gray-400">Enter your Reference Number to check real-time updates.</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-4 mb-10">
        <input 
          type="text" 
          placeholder="e.g. LN1715001234" 
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
          className="premium-input text-lg py-4 placeholder:text-gray-600"
        />
        <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center min-w-[140px] text-lg">
          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <><Search className="h-5 w-5 mr-2" /> Track</>}
        </button>
      </form>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-error/20 border border-error/50 p-4 rounded-xl text-red-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </motion.div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/5 pb-8">
              <div>
                <p className="text-sm text-gray-400 mb-1">Applicant Name</p>
                <h3 className="text-2xl font-bold">{data.fullName}</h3>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-gray-400 mb-1">Current Status</p>
                <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold inline-flex items-center shadow-[0_0_15px_rgba(0,0,0,0.5)] ${statusColors[data.status] || 'bg-gray-500/20 text-gray-400'}`}>
                  {data.status === 'Additional Documents Required' && <FileWarning className="w-4 h-4 mr-2" />}
                  {data.status}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 mt-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Loan Type</p>
                <p className="font-medium text-lg">{data.loanType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Amount</p>
                <p className="font-medium text-lg">${data.loanAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Date Applied</p>
                <p className="font-medium text-lg">{new Date(data.submissionDate).toLocaleDateString()}</p>
              </div>
            </div>

            {data.status === 'Additional Documents Required' && data.missingDocuments && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mt-4">
                <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <FileWarning className="h-5 w-5" />
                  Please upload or submit the required missing documents.
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
                  {data.missingDocuments.map((doc: string, idx: number) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
                <button className="mt-5 btn-primary text-sm py-2 px-4 shadow-none">Upload Documents</button>
              </motion.div>
            )}

            {data.status === 'Received' && (
              <p className="text-gray-400 text-sm italic mt-4 transition-opacity">Your application has been received successfully.</p>
            )}

            {data.status === 'Under Review' && (
              <p className="text-gray-400 text-sm italic mt-4 transition-opacity">Your application is currently being reviewed by our team.</p>
            )}

            {data.status === 'Approved' && (
              <p className="text-green-400 text-sm italic mt-4 transition-opacity">Congratulations, your loan has been approved.</p>
            )}

            {data.status === 'Rejected' && (
              <p className="text-red-400 text-sm italic mt-4 transition-opacity">We regret to inform you that your application was not approved.</p>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
