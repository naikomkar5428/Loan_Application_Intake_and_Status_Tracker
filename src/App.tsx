import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Track from './pages/Track';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white selection:bg-primary/30 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 pb-12 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/track" element={<Track />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
