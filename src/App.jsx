import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Rankings from './components/Rankings';
import SchoolDetail from './components/SchoolDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { api } from './services/api';

function App() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await api.getHomeData();
        setHomeData(data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gradient-start mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <i className={`mr-2 ${showAdmin ? 'fas fa-eye-slash' : 'fas fa-cogs'}`}></i>
              {showAdmin ? 'Hide Admin Panel' : 'Show Admin Panel'}
            </button>
          </div>
          
          {showAdmin && <AdminPanel />}
          
          <Routes>
            <Route path="/" element={<Home homeData={homeData} />} />
            <Route path="/rankings/:examType/:year" element={<Rankings />} />
            <Route path="/school/:schoolId" element={<SchoolDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;