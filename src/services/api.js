const API_BASE = 'http://localhost:8000/api' || 'https://necta-backend.onrender.com/api';

export const api = {
  async getHomeData() {
    const response = await fetch(`${API_BASE}/home/`);
    return await response.json();
  },
  
  async getRankings(examType, year) {
    const response = await fetch(`${API_BASE}/rankings/${examType}/${year}/`);
    return await response.json();
  },
  
  async getSchoolDetail(schoolId) {
    const response = await fetch(`${API_BASE}/school/${schoolId}/`);
    return await response.json();
  },
  
  async getSchools(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/schools/?${queryString}`);
    return await response.json();
  },
  
  async getResults(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/results/?${queryString}`);
    return await response.json();
  }
};