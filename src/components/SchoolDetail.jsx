import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SchoolDetail() {
  const { schoolId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeExamTab, setActiveExamTab] = useState('all');
  const [activeGraphTab, setActiveGraphTab] = useState('gpa');

  useEffect(() => {
    const fetchSchoolDetail = async () => {
      try {
        setLoading(true);
        const schoolData = await api.getSchoolDetail(schoolId);
        setData(schoolData);
      } catch (error) {
        console.error('Error fetching school detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetail();
  }, [schoolId]);

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

  // Prepare data for charts
  const cseeResults = data?.results
    .filter(result => result.exam === 'CSEE')
    .sort((a, b) => a.year - b.year) || [];

  const acseeResults = data?.results
    .filter(result => result.exam === 'ACSEE')
    .sort((a, b) => a.year - b.year) || [];

  // Chart options and data
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#b2bec3',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#b2bec3',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#b2bec3',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const gpaChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        reverse: true,
        title: {
          display: true,
          text: 'GPA',
          color: '#b2bec3',
        },
      },
      x: {
        ...chartOptions.scales.x,
        title: {
          display: true,
          text: 'Year',
          color: '#b2bec3',
        },
      },
    },
  };

  const gpaChartData = (results, borderColor, backgroundColor) => ({
    labels: results.map(result => result.year),
    datasets: [
      {
        label: 'GPA Trend',
        data: results.map(result => result.gpa),
        borderColor,
        backgroundColor,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: borderColor,
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  });

  const divisionChartData = (result) => ({
    labels: ['Div I', 'Div II', 'Div III', 'Div IV', 'Div 0'],
    datasets: [
      {
        data: [
          result.division1 || 0,
          result.division2 || 0,
          result.division3 || 0,
          result.division4 || 0,
          result.division0 || 0,
        ],
        backgroundColor: [
          '#00b894',
          '#0984e3',
          '#fdcb6e',
          '#e17055',
          '#d63031',
        ],
        borderWidth: 1,
        hoverOffset: 15,
      },
    ],
  });

  const divisionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#b2bec3',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const comparisonChartData = (cseeData, acseeData, year) => ({
    labels: ['CSEE', 'ACSEE'],
    datasets: [
      {
        label: `GPA Comparison (${year})`,
        data: [cseeData.gpa, acseeData.gpa],
        backgroundColor: ['#74b9ff', '#00cec9'],
        borderColor: ['#0984e3', '#00b894'],
        borderWidth: 1,
      },
    ],
  });

  const divisionComparisonData = (cseeData, acseeData, year) => ({
    labels: ['Div I', 'Div II', 'Div III', 'Div IV', 'Div 0'],
    datasets: [
      {
        label: `CSEE (${year})`,
        data: [
          cseeData.division1 || 0,
          cseeData.division2 || 0,
          cseeData.division3 || 0,
          cseeData.division4 || 0,
          cseeData.division0 || 0,
        ],
        backgroundColor: 'rgba(116,185,255,0.7)',
        borderColor: '#0984e3',
        borderWidth: 1,
      },
      {
        label: `ACSEE (${year})`,
        data: [
          acseeData.division1 || 0,
          acseeData.division2 || 0,
          acseeData.division3 || 0,
          acseeData.division4 || 0,
          acseeData.division0 || 0,
        ],
        backgroundColor: 'rgba(0,206,201,0.7)',
        borderColor: '#00b894',
        borderWidth: 1,
      },
    ],
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Error loading school data</div>;
  }

  return (
    <motion.div 
      className="space-y-8 px-4 py-8 text-gray-900 dark:text-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumb */}
      <motion.nav className="text-sm mb-4" variants={itemVariants}>
        <ol className="flex space-x-2">
          <li>
            <Link to="/" className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300">
              Home
            </Link>
          </li>
          <li className="before:content-['/'] before:mx-2 text-gray-500">
            <Link to="/rankings/ACSEE/2023" className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300">
              ACSEE 2023 Rankings
            </Link>
          </li>
          <li className="before:content-['/'] before:mx-2 text-gray-300">
            {data.school.name}
          </li>
        </ol>
      </motion.nav>

      {/* School Header */}
      <motion.div 
        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-8 rounded-3xl shadow-lg"
        variants={cardVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{data.school.name}</h1>
            <p className="mb-1">
              <strong>Code:</strong> {data.school.code}
            </p>
            <p>
              <strong>Region:</strong> {data.school.region}
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/20 text-white px-4 py-2 rounded-2xl shadow-sm">
            <i className="fas fa-clipboard-list mr-2"></i>
            {data.results.length} Records
          </div>
        </div>
      </motion.div>

      {/* Exam Type Tabs */}
      <motion.div className="flex justify-center space-x-2 mb-6" variants={itemVariants}>
        {['all', 'CSEE', 'ACSEE'].map((examType) => (
          <motion.button
            key={examType}
            onClick={() => setActiveExamTab(examType)}
            className={`px-4 py-2 rounded-full ${
              activeExamTab === examType
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {examType === 'all' ? 'All Results' : `${examType} Results`}
          </motion.button>
        ))}
      </motion.div>

      {/* Graph Type Tabs */}
      <motion.div className="flex justify-center flex-wrap gap-2 mb-6" variants={itemVariants}>
        {['gpa', 'division', 'comparison'].map((graphType) => (
          <motion.button
            key={graphType}
            onClick={() => setActiveGraphTab(graphType)}
            className={`px-3 py-2 rounded-lg text-sm ${
              activeGraphTab === graphType
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {graphType === 'gpa' && 'GPA Trends'}
            {graphType === 'division' && 'Division Distribution'}
            {graphType === 'comparison' && 'Performance Comparison'}
          </motion.button>
        ))}
      </motion.div>

      {/* GPA Charts */}
      {activeGraphTab === 'gpa' && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-500 text-center">
              CSEE GPA Trend
            </h3>
            {cseeResults.length > 0 ? (
              <Line
                data={gpaChartData(cseeResults, '#74b9ff', 'rgba(116,185,255,0.15)')}
                options={gpaChartOptions}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No CSEE data available
              </div>
            )}
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
          >
            <h3 className="text-xl font-semibold mb-4 text-teal-500 text-center">
              ACSEE GPA Trend
            </h3>
            {acseeResults.length > 0 ? (
              <Line
                data={gpaChartData(acseeResults, '#00cec9', 'rgba(0,206,201,0.15)')}
                options={gpaChartOptions}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No ACSEE data available
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Division Charts */}
      {activeGraphTab === 'division' && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-500 text-center">
              CSEE Division Distribution
              {cseeResults.length > 0 && ` (${cseeResults[cseeResults.length - 1].year})`}
            </h3>
            {cseeResults.length > 0 ? (
              <Doughnut
                data={divisionChartData(cseeResults[cseeResults.length - 1])}
                options={divisionChartOptions}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No CSEE data available
              </div>
            )}
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
          >
            <h3 className="text-xl font-semibold mb-4 text-teal-500 text-center">
              ACSEE Division Distribution
              {acseeResults.length > 0 && ` (${acseeResults[acseeResults.length - 1].year})`}
            </h3>
            {acseeResults.length > 0 ? (
              <Doughnut
                data={divisionChartData(acseeResults[acseeResults.length - 1])}
                options={divisionChartOptions}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No ACSEE data available
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Comparison Charts */}
      {activeGraphTab === 'comparison' && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-500 text-center">
              CSEE vs ACSEE GPA Comparison
            </h3>
            {cseeResults.length > 0 && acseeResults.length > 0 ? (
              <Bar
                data={comparisonChartData(
                  cseeResults[cseeResults.length - 1],
                  acseeResults[acseeResults.length - 1],
                  cseeResults[cseeResults.length - 1].year
                )}
                options={chartOptions}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                Comparison data not available
              </div>
            )}
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
          >
            <h3 className="text-xl font-semibold mb-4 text-teal-500 text-center">
              Division I Comparison
            </h3>
            {cseeResults.length > 0 && acseeResults.length > 0 ? (
              <Bar
                data={divisionComparisonData(
                  cseeResults[cseeResults.length - 1],
                  acseeResults[acseeResults.length - 1],
                  cseeResults[cseeResults.length - 1].year
                )}
                options={chartOptions}
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                Comparison data not available
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Exam Results Table */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        variants={cardVariants}
      >
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
          <h2 className="text-xl font-semibold">
            <i className="fas fa-history mr-2"></i>Exam Results History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-left">Exam Type</th>
                <th className="p-3 text-center">GPA</th>
                <th className="p-3 text-center">Div I</th>
                <th className="p-3 text-center">Div II</th>
                <th className="p-3 text-center">Div III</th>
                <th className="p-3 text-center">Div IV</th>
                <th className="p-3 text-center">Div 0</th>
                <th className="p-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.results
                .filter(result => activeExamTab === 'all' || result.exam === activeExamTab)
                .map((result) => (
                  <tr
                    key={`${result.exam}-${result.year}`}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="p-3 font-bold">{result.year}</td>
                    <td className="p-3">{result.exam}</td>
                    <td className="p-3 text-center font-bold text-blue-500">
                      {result.gpa.toFixed(4)}
                    </td>
                    <td className="p-3 text-center text-green-500">{result.division1}</td>
                    <td className="p-3 text-center text-blue-500">{result.division2}</td>
                    <td className="p-3 text-center text-yellow-500">{result.division3}</td>
                    <td className="p-3 text-center text-gray-500">{result.division4}</td>
                    <td className="p-3 text-center text-red-500">{result.division0}</td>
                    <td className="p-3 text-center font-bold">{result.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Back Button */}
      <motion.div className="text-center mt-6" variants={itemVariants}>
        <Link
          to="/rankings/ACSEE/2023"
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center"
        >
          <i className="fas fa-arrow-left mr-2"></i>Back to Rankings
        </Link>
      </motion.div>
    </motion.div>
  );
}