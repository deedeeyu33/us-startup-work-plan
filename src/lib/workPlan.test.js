import { describe, expect, it } from 'vitest';
import { currentStage, funnelCounts, nextGate, scoreCustomer, validateImport } from './workPlan';

describe('work plan logic',()=>{
  it('selects inclusive stage boundaries',()=>{expect(currentStage('2026-07-23').id).toBe('stage-01');expect(currentStage('2026-08-17').id).toBe('stage-05');expect(currentStage('2026-09-05').id).toBe('stage-10')});
  it('handles dates outside the plan',()=>{expect(currentStage('2026-01-01').id).toBe('pre-start');expect(currentStage('2027-01-01').id).toBe('post-plan')});
  it('selects the current or next undecided gate',()=>{expect(nextGate('2026-07-23',{}).id).toBe('gate-1');expect(nextGate('2026-08-18',{'gate-1':{decision:'继续'}}).id).toBe('gate-2')});
  it('scores customers and counts funnel stages',()=>{const c={stage:'合格机会',scores:{a:2,b:1}};expect(scoreCustomer(c)).toBe(0);const real={stage:'合格机会',scores:{'清洗频率':2,'试用意愿':2}};expect(scoreCustomer(real)).toBe(4);expect(funnelCounts([real])['合格机会']).toBe(1)});
  it('rejects invalid backups',()=>{expect(()=>validateImport({version:1,data:{}})).toThrow();expect(validateImport({schema:'us-work-plan',version:1,data:{crm:[],expenses:[]}}).version).toBe(1)});
});
