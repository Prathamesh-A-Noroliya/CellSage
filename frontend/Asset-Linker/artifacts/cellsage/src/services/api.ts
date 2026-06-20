import axios from 'axios';
import { mockInvestigation, mockHistory } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({ baseURL: API_BASE_URL });

function isNetworkError(err: any): boolean {
  return err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED' || err?.code === 'ECONNREFUSED';
}

export async function investigateQuery(query: string) {
  try {
    const res = await client.post('/investigate', { query });
    return res.data;
  } catch (err: any) {
    if (isNetworkError(err)) {
      console.warn('[CellSage] Backend unreachable, using mock investigation data');
      return mockInvestigation;
    }
    console.error('[CellSage] /investigate error:', err?.response?.status, err?.response?.data);
    throw err;
  }
}

export async function getHistory() {
  try {
    const res = await client.get('/history');
    return res.data;
  } catch (err: any) {
    if (isNetworkError(err)) {
      console.warn('[CellSage] Backend unreachable, using mock history data');
      return { investigations: mockHistory };
    }
    console.error('[CellSage] /history error:', err?.response?.status, err?.response?.data);
    throw err;
  }
}

export async function generateReport(payload: { query?: string; investigation_id?: number }) {
  try {
    const res = await client.post('/report', payload);
    return res.data;
  } catch (err: any) {
    if (isNetworkError(err)) {
      console.warn('[CellSage] Backend unreachable for report generation');
      return null;
    }
    console.error('[CellSage] /report error:', err?.response?.status, err?.response?.data);
    throw err;
  }
}