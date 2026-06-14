import type { ScamReport } from '../stores/appStore';

const STORAGE_KEY = 'nataconnect_community_reports';

function loadReports(): ScamReport[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveReports(reports: ScamReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  window.dispatchEvent(new Event('nataconnect-reports-changed'));
}

export async function reportScamToFirebase(input: Omit<ScamReport, 'id' | 'verified' | 'reportCount' | 'createdAt'> & { hostname?: string }) {
  const reports = loadReports();
  const key = input.hostname || input.sellerUrl || input.sellerName;
  const existing = reports.find(item => item.sellerUrl === key || item.sellerName === input.sellerName);
  if (existing) existing.reportCount += 1;
  const report: ScamReport = existing || {
    id: crypto.randomUUID(), sellerName: input.sellerName, sellerUrl: key, description: input.description,
    reportType: input.reportType, verified: false, reportCount: 1, country: input.country, createdAt: new Date().toISOString(),
  };
  if (!existing) reports.unshift(report);
  saveReports(reports);
  return report;
}

export function subscribeToCommunityFeed(callback: (reports: ScamReport[]) => void, country?: string) {
  const emit = () => callback(loadReports().filter(item => !country || !item.country || item.country === country));
  emit();
  window.addEventListener('nataconnect-reports-changed', emit);
  return () => window.removeEventListener('nataconnect-reports-changed', emit);
}

export async function getCommunityStats() {
  const reports = loadReports();
  return { totalReports: reports.reduce((sum, item) => sum + item.reportCount, 0), uniqueSellers: reports.length };
}

export async function getCommunityReport(hostname: string) {
  return loadReports().find(item => item.sellerUrl === hostname || item.sellerName === hostname) || null;
}
