import { Link, useLocation } from 'react-router-dom';
import { Landmark, ArrowRight, Activity } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 mt-4 mb-8 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        <Landmark className="text-primary h-6 w-6" />
        NexusBank
      </Link>
      
      <div className="flex gap-4 items-center">
        <Link 
          to="/track" 
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            location.pathname === '/track' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="h-4 w-4" />
          Track Status
        </Link>
        <Link 
          to="/apply" 
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2 !rounded-xl text-nowrap"
        >
          Apply Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </nav>
  );
}
