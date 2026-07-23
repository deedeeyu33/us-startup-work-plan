import { stages, gates, funnelStages, scoreFields } from '../data/planData';

export const NS = 'us-work-plan:v1:';
export const KEYS = {
  sopChecks:'sop-checks', sopOpen:'sop-open', timelineChecks:'timeline-checks',
  crm:'crm', expenses:'expenses', weekly:'weekly-reviews', gateDecisions:'gate-decisions', templateDrafts:'template-drafts', learningResources:'learning-resources', capabilityReviews:'capability-reviews', ui:'ui'
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}
export function save(key, value) { localStorage.setItem(NS + key, JSON.stringify(value)); }

export function localISO(date = new Date()) {
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
export function currentStage(today = localISO()) {
  if (today < stages[0].start) return { id:'pre-start', title:'准备期', date:'2026年7月23日前', recommended:['sop-01','sop-02'] };
  const found = stages.find(s => today >= s.start && today <= s.end);
  if (found) return found;
  if (today > stages.at(-1).end) return { id:'post-plan', title:'年度复盘与2027规划', date:'2027年起', recommended:['sop-02','sop-12'] };
  return stages.find(s => today < s.start) || stages.at(-1);
}
export function nextGate(today = localISO(), decisions = {}, stage = currentStage(today)) {
  if (stage.gate && !decisions[stage.gate]?.decision) return gates.find(g=>g.id===stage.gate);
  const future = gates.find(g => g.date >= today && !decisions[g.id]?.decision);
  if (future) return future;
  return [...gates].reverse().find(g => !decisions[g.id]?.decision) || null;
}
export function scoreCustomer(customer) {
  return scoreFields.reduce((sum,field)=>sum + Number(customer.scores?.[field] || 0),0);
}
export function scoreLabel(score) { return score >= 10 ? '重点推进' : score >= 7 ? '继续培养' : '暂不上门'; }
export function funnelCounts(customers) {
  return Object.fromEntries(funnelStages.map(stage=>[stage,customers.filter(c=>c.stage===stage).length]));
}
export function completion(items, checked, prefix='') {
  if (!items.length) return 0;
  return Math.round(items.filter((_,i)=>checked[`${prefix}${i}`]).length/items.length*100);
}
export function uid(prefix='item') { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

export function exportData() {
  const data = { schema:'us-work-plan', version:1, exportedAt:new Date().toISOString(), data:{} };
  Object.values(KEYS).forEach(k=>{ data.data[k]=load(k, ['crm','expenses','learning-resources'].includes(k)?[]:{}); });
  return data;
}
export function validateImport(payload) {
  if (!payload || payload.schema !== 'us-work-plan' || payload.version !== 1 || typeof payload.data !== 'object') {
    throw new Error('文件不是受支持的美国创业工作计划 V1 备份。');
  }
  if (!Array.isArray(payload.data.crm) || !Array.isArray(payload.data.expenses) || (payload.data['learning-resources'] && !Array.isArray(payload.data['learning-resources']))) throw new Error('CRM、费用或学习资源数据格式无效。');
  return payload;
}
export function importData(payload) {
  const valid=validateImport(payload);
  Object.values(KEYS).forEach(k=>{ if (k in valid.data) save(k,valid.data[k]); });
}
