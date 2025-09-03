import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home({ homeData, isDarkMode }) {
  const [examType, setExamType] = useState('ACSEE');
  const [year, setYear] = useState(2023);
  const navigate = useNavigate();

  const handleViewRankings = (e) => {
    e.preventDefault();
    navigate(`/rankings/${examType}/${year}`);
  };

  if (!homeData) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="space-y-12 px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div 
        className="text-center py-12 relative overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-amber-600/5 -z-10 dark:from-amber-400/10 dark:to-amber-600/10"></div>
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            NECTA Results <span className="text-amber-600 dark:text-amber-400">Ranking System</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Discover comprehensive analysis of school performance based on National Examination Council of Tanzania results with beautiful visualizations and insights.
          </motion.p>
          
          {/* Search Form */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center justify-center">
              <i className="fas fa-search mr-3 text-amber-500"></i>Find School Rankings
            </h2>
            <form onSubmit={handleViewRankings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Exam Type
                  </label>
                  <div className="relative">
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {homeData.exam_types.map((exam) => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Year
                  </label>
                  <div className="relative">
                    <select
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {homeData.years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>
                <div className="flex items-end">
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-chart-line mr-2"></i>View Rankings
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {[
          { value: homeData.total_schools, label: 'Schools Tracked', icon: 'fas fa-school', color: 'from-blue-500 to-blue-600' },
          { value: homeData.years.length, label: 'Years of Data', icon: 'fas fa-calendar-alt', color: 'from-purple-500 to-purple-600' },
          { value: homeData.regions.length, label: 'Regions Covered', icon: 'fas fa-map-marked-alt', color: 'from-green-500 to-green-600' },
          { value: homeData.exam_types.length, label: 'Exam Types', icon: 'fas fa-file-alt', color: 'from-amber-500 to-amber-600' },
        ].map((stat, index) => (
          <motion.div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-2xl mb-4 mx-auto`}>
              <i className={stat.icon}></i>
            </div>
            <div className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">{stat.value}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 text-center">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
      >
        {/* Top Schools */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <i className="fas fa-trophy mr-3 text-amber-500"></i>Top Performing Schools
            </h2>
            <span className="text-sm bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
              ACSEE 2023
            </span>
          </div>
          <div className="space-y-4">
            {homeData.top_schools.slice(0, 5).map((result, index) => (
              <motion.div 
                key={result.id} 
                className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700"
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                  index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                  index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{result.school.name}</h3>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-1">
                    <i className="fas fa-map-marker-alt mr-2 text-purple-500"></i>
                    {result.school.region}
                    <span className="mx-2">•</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">GPA: {result.gpa}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Regions */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <i className="fas fa-globe-africa mr-3 text-green-500"></i>Browse by Region
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {homeData.regions.slice(0, 12).map((region) => (
              <motion.a
                key={region}
                href={`/rankings/ACSEE/2023?region=${region}`}
                className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl text-center border border-blue-100 dark:border-blue-800/50 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{region}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}