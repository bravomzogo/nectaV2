import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

export default function Rankings() {
  const { examType, year } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState(searchParams.get('region') || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const rankingsData = await api.getRankings(examType, year);
        setData(rankingsData);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [examType, year]);

  const filteredResults = data?.results.filter(result => {
    const matchesRegion = !filterRegion || result.school.region === filterRegion;
    const matchesSearch = !searchQuery || 
      result.school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.school.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Error loading rankings data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {examType} {year} Rankings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Showing performance rankings for {data.total_schools} schools
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Region
            </label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Regions</option>
              {data.results
                .map(result => result.school.region)
                .filter((region, index, self) => self.indexOf(region) === index)
                .map(region => (
                  <option key={region} value={region}>{region}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Schools
            </label>
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterRegion('');
                setSearchQuery('');
              }}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-500">
            {data.total_schools}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Schools</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-500">
            {data.total_students}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-500">
            {data.avg_gpa_all}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Average GPA</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-500">
            {data.best_gpa}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Best GPA</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Rank</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">School Code</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">School Name</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Region</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">GPA</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Div I</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Div II</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Div III</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Div IV</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Div 0</th>
                <th className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults?.map((result) => (
                <tr key={result.school.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      result.rank === 1 ? 'bg-yellow-500 text-white' :
                      result.rank <= 3 ? 'bg-gray-500 text-white' :
                      result.rank <= 10 ? 'bg-blue-500 text-white' :
                      'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white'
                    }`}>
                      {result.rank}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{result.school.code}</td>
                  <td className="p-4">
                    <a 
                      href={`/school/${result.school.id}`}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {result.school.name}
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                      {result.school.region}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-blue-500 dark:text-blue-400">
                    {result.gpa.toFixed(4)}
                  </td>
                  <td className="p-4 text-center text-gray-900 dark:text-white">{result.division1}</td>
                  <td className="p-4 text-center text-gray-900 dark:text-white">{result.division2}</td>
                  <td className="p-4 text-center text-gray-900 dark:text-white">{result.division3}</td>
                  <td className="p-4 text-center text-gray-900 dark:text-white">{result.division4}</td>
                  <td className="p-4 text-center text-red-500 dark:text-red-400">{result.division0}</td>
                  <td className="p-4 text-center font-medium text-gray-900 dark:text-white">{result.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredResults?.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No schools match your current filters.
        </div>
      )}
    </div>
  );
}