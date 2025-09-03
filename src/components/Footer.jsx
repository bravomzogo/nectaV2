import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gradient-ocean to-gradient-oceanEnd text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">NECTA Rankings</h3>
            <p className="text-blue-100 mb-4">
              Comprehensive analysis of school performance based on National Examination Council of Tanzania results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-blue-100 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-100 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/rankings/ACSEE/2023" className="text-blue-100 hover:text-white transition-colors">Rankings</Link></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Exam Types</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">ACSEE</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">CSEE</a></li>
              {/* <li><a href="#" className="text-blue-100 hover:text-white transition-colors">FTNA</a></li>
              <li><a href="#" className="text-blue-100 hover:text-white transition-colors">PSLE</a></li> */}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-300 mt-8 pt-8 text-center">
          <p className="text-blue-100">
            © {new Date().getFullYear()} NECTA Rankings System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}