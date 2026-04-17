import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Activity, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] gap-12 text-center max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          Next-Generation Banking
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Modernizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Loan Applications.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Skip the branch visits and paperwork. Apply for a Home, Personal, or Business loan instantly and track your status in real-time.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Link to="/apply" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex justify-center">
          Start Application
        </Link>
        <Link to="/track" className="glass-card px-8 py-4 text-lg hover:bg-white/10 transition-all w-full sm:w-auto flex justify-center border border-white/10 hover:border-white/20">
          Check Status
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12"
      >
        {[
          { icon: <FileText className="text-primary h-8 w-8" />, title: "Digital Intake", desc: "Smart dynamic forms that adjust to your specific loan needs." },
          { icon: <Activity className="text-secondary h-8 w-8" />, title: "Live Tracking", desc: "Crystal clear transparency with instant status updates." },
          { icon: <ShieldCheck className="text-accent h-8 w-8" />, title: "Secure & Validated", desc: "Bank-grade data validation and duplicate detection." }
        ].map((feature, i) => (
          <div key={i} className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-1 transition-transform group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
