import React, { useEffect, useRef, useState } from 'react';

export function Section({id,eyebrow,title,children,className=''}) {
  return <section id={id} className={`content-section ${className}`}><div className="section-heading"><span>{eyebrow}</span><h2>{title}</h2></div>{children}</section>;
}
export function Card({children,className=''}) { return <article className={`card ${className}`}>{children}</article>; }
export function Tag({children,tone=''}) { return <span className={`tag ${tone}`}>{children}</span>; }
export function Progress({value,label}) { return <div className="progress-wrap" aria-label={`${label || '完成度'} ${value}%`}><div className="progress-meta"><span>{label || '完成度'}</span><strong>{value}%</strong></div><div className="progress"><span style={{width:`${value}%`}} /></div></div>; }
export function Checklist({items,checked,onToggle,prefix=''}) { return <ul className="checklist">{items.map((item,i)=><li key={`${prefix}${i}`}><label><input type="checkbox" checked={!!checked[`${prefix}${i}`]} onChange={()=>onToggle(`${prefix}${i}`)} /><span>{item}</span></label></li>)}</ul>; }
export function Modal({title,children,onClose}) {
  const ref=useRef(null);
  useEffect(()=>{ref.current?.focus(); const key=e=>e.key==='Escape'&&onClose(); document.addEventListener('keydown',key); return()=>document.removeEventListener('keydown',key)},[onClose]);
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal" role="dialog" aria-modal="true" aria-label={title} tabIndex="-1" ref={ref}><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="关闭">×</button></div>{children}</div></div>;
}
export function Toast({message}) { return message ? <div className="toast" role="status">{message}</div> : null; }
export function Empty({children}) { return <div className="empty">{children}</div>; }
export function useToast() { const [toast,setToast]=useState(''); const show=m=>{setToast(m); window.clearTimeout(show.t); show.t=window.setTimeout(()=>setToast(''),2200)}; return [toast,show]; }
