import React, { useState } from 'react';
import { stages } from '../data/planData';
import { Card, Checklist, Progress, Tag } from './Common';
import { completion } from '../lib/workPlan';

export default function Timeline({current,checks,setChecks}) {
  const [expanded,setExpanded]=useState(current.id);
  const toggle=id=>setChecks(v=>({...v,[id]:!v[id]}));
  return <div className="timeline">{stages.map((s,index)=>{
    const prefix=`${s.id}:`, progress=completion(s.must,checks,prefix), isCurrent=s.id===current.id, isOpen=expanded===s.id;
    return <article key={s.id} className={`timeline-item ${isCurrent?'current':''}`}><div className="timeline-marker">{index+1}</div><Card>
      <button className="timeline-head" onClick={()=>setExpanded(isOpen?'':s.id)} aria-expanded={isOpen}><div><div className="timeline-date">{s.date} {isCurrent&&<Tag tone="gold">当前阶段</Tag>}</div><h3>{s.title}</h3><p>{s.goal}</p></div><span>{isOpen?'收起':'展开'}</span></button>
      <Progress value={progress} label="必须任务" />
      {isOpen&&<div className="timeline-body"><div><h4>必须完成</h4><Checklist items={s.must} checked={checks} onToggle={toggle} prefix={prefix}/></div>
        {!!s.optional.length&&<div><h4>可选任务</h4><ul>{s.optional.map(x=><li key={x}>{x}</li>)}</ul></div>}
        {!!s.dont.length&&<div className="dont"><h4>现在不做</h4><ul>{s.dont.map(x=><li key={x}>{x}</li>)}</ul></div>}
        <div><h4>阶段输出</h4><ul>{s.outputs.map(x=><li key={x}>{x}</li>)}</ul></div>
      </div>}
    </Card></article>
  })}</div>;
}
