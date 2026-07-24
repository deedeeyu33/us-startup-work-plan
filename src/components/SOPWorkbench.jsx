import React, { useMemo, useState } from 'react';
import { sopCategories, sops } from '../data/planData';
import { Card, Checklist, Progress, Tag } from './Common';

export default function SOPWorkbench({checks,setChecks,open,setOpen,recommended}) {
  const [filter,setFilter]=useState('全部');
  const visible=useMemo(()=>sops.filter(s=>filter==='全部'?s.category!=='trigger':s.status===filter),[filter]);
  const toggleCheck=id=>setChecks(v=>({...v,[id]:!v[id]}));
  const reset=id=>{if(!confirm('重置本SOP的全部勾选？'))return;setChecks(v=>Object.fromEntries(Object.entries(v).filter(([k])=>!k.startsWith(`${id}:`))))};
  const allReset=()=>{if(confirm('重置全部SOP勾选状态？时间线、CRM和费用不会受影响。'))setChecks({})};
  return <><div className="filter-row"><div>{['全部','立即使用','客户验证阶段','触发后启用'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x==='全部'?'当前工作台':x==='触发后启用'?'后续触发（SOP 13—17）':x}</button>)}</div><button className="danger-outline" onClick={allReset}>重置全部 SOP</button></div>
    {sopCategories.map(([cat,label])=>{const items=visible.filter(s=>s.category===cat);if(!items.length)return null;return <div className="sop-category" key={cat}><h3>{label}</h3>{items.map(s=>{const checklist=s.sections.flatMap(x=>x.checklist?x.content:[]), completed=checklist.filter((_,i)=>checks[`${s.id}:${i}`]).length, pct=checklist.length?Math.round(completed/checklist.length*100):0,isOpen=!!open[s.id];return <Card key={s.id} className={`sop-card ${recommended.includes(s.id)?'recommended':''}`}><button className="sop-head" aria-expanded={isOpen} onClick={()=>setOpen(v=>({...v,[s.id]:!v[s.id]}))}><div><span className="sop-num">SOP {s.num}</span><h4>{s.name}</h4><div className="sop-tags"><Tag tone={s.status==='立即使用'?'green':s.status==='客户验证阶段'?'gold':'muted'}>{s.status}</Tag><Tag>{s.frequency}</Tag><Tag>{s.duration}</Tag>{recommended.includes(s.id)&&<Tag tone="gold">当前推荐</Tag>}</div></div><div className="sop-score"><strong>{pct}%</strong><span>{isOpen?'收起':'展开'}</span></div></button><Progress value={pct} label={`${completed}/${checklist.length} 步`} />{isOpen&&<div className="sop-body">{s.framework&&<div className="notice compact">此SOP将在实际业务触发后，根据律师、CPA、报关行、保险要求、设备参数和真实订单进一步完善。</div>}{(()=>{let offset=0;return s.sections.map(section=>{const start=offset;if(section.checklist)offset+=section.content.length;return <div className="sop-section" key={section.label}><h5>{section.label}</h5>{section.checklist?<Checklist items={section.content} checked={checks} onToggle={toggleCheck} prefix={`${s.id}:`} />:<p>{section.content}</p>}</div>})})()}<button className="text-btn" onClick={()=>reset(s.id)}>重置本 SOP</button></div>}</Card>})}</div>})}
  </>;
}
