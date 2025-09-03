import { useState } from 'react';

export default function AdminPanel() {
  const [examType, setExamType] = useState('ACSEE');
  const [year, setYear] = useState(new Date().getFullYear());
  const [scrapingStatus, setScrapingStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const checkScrapingStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scrape/status/');
      const data = await response.json();
      setScrapingStatus(data.scraping_in_progress ? 'in_progress' : 'idle');
    } catch (error) {
      console.error('Error checking scraping status:', error);
    }
  };

  const triggerScraping = async () => {
    try {
      setScrapingStatus('starting');
      const response = await fetch('http://localhost:8000/api/scrape/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam_type: examType, year }),
      });
      const data = await response.json();

      if (data.status === 'scraping_started') {
        setScrapingStatus('in_progress');
        setMessage('Scraping started successfully');
        const interval = setInterval(checkScrapingStatus, 5000);
        setTimeout(() => clearInterval(interval), 300000);
      } else if (data.status === 'scraping_already_in_progress') {
        setScrapingStatus('in_progress');
        setMessage('Scraping is already in progress');
      }
    } catch (error) {
      console.error('Error triggering scraping:', error);
      setScrapingStatus('error');
      setMessage('Error starting scraping process');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700 min-w-[320px]">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center">
        <i className="fas fa-cogs mr-3 text-blue-500"></i>Data Scraping Panel
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Exam Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2 flex items-center">
            <i className="fas fa-graduation-cap mr-2 text-blue-500"></i>Exam Type
          </label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          >
            <option value="ACSEE">ACSEE</option>
            <option value="CSEE">CSEE</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2 flex items-center">
            <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            min="2010"
            max={new Date().getFullYear()}
          />
        </div>

        {/* Trigger Button */}
        <div className="flex items-end">
          <button
            onClick={triggerScraping}
            disabled={scrapingStatus === 'in_progress'}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex justify-center items-center ${
              scrapingStatus === 'in_progress'
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-100 dark:text-gray-300'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {scrapingStatus === 'in_progress' ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>Scraping...
              </>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>Start Scraping
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-4 border ${
            scrapingStatus === 'error'
              ? 'bg-red-100 border-red-300 text-red-700'
              : 'bg-blue-100 border-blue-300 text-blue-700'
          } flex items-center`}
        >
          <i
            className={`mr-2 ${
              scrapingStatus === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'
            }`}
          ></i>
          {message}
        </div>
      )}

      {/* In-progress Indicator */}
      {scrapingStatus === 'in_progress' && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
          <div className="flex items-center text-yellow-800 dark:text-yellow-200">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500 dark:border-yellow-400 mr-3"></div>
            <span className="font-medium">
              Scraping in progress... This may take several minutes.
            </span>
          </div>
          <div className="w-full bg-yellow-200 dark:bg-yellow-700 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}
