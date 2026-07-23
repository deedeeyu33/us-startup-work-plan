import React, { useEffect, useState } from 'react';
import { navItems } from '../data/planData';

export default function Navigation() {
  const [open,setOpen]=useState(false), [active,setActive]=useState('overview');
  useEffect(()=>{
    const nodes=navItems.map(([id])=>document.getElementById(id)).filter(Boolean);
    const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if(visible)setActive(visible.target.id)}, {rootMargin:'-15% 0px -70% 0px',threshold:[0,.1,.5]});
    nodes.forEach(n=>observer.observe(n)); return()=>observer.disconnect();
  },[]);
  const go=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setOpen(false)};
  return <>
    <button className="mobile-menu" aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}>{open?'关闭':'目录'}</button>
    <aside className={`sidebar ${open?'open':''}`}><div className="brand"><span>US · 2026</span><strong>创业运营手册</strong><small>计划始于 2026.07.23</small></div><nav id="main-nav" aria-label="页面章节">{navItems.map(([id,label],i)=><button key={id} className={active===id?'active':''} onClick={()=>go(id)}><span>{String(i+1).padStart(2,'0')}</span>{label}</button>)}</nav><div className="side-foot">先验证，再投入</div></aside>
  </>;
}
