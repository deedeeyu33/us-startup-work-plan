import React, { useMemo, useState } from 'react';
import { customerTypes, funnelStages, scoreFields } from '../data/planData';
import { scoreCustomer, scoreLabel, uid } from '../lib/workPlan';
import { Card, Empty, Modal, Tag } from './Common';

const blank=()=>({id:uid('crm'),company:'',website:'',state:'',city:'',type:customerTypes[0],contact:'',title:'',email:'',phone:'',source:'',scene:'',method:'',pain:'',buyers:'',timing:'',stage:'目标企业',nextStep:'',nextDate:'',reason:'',scores:Object.fromEntries(scoreFields.map(x=>[x,0])),createdAt:new Date().toISOString()});
export default function CRMWorkbench({customers,setCustomers}) {
  const [editing,setEditing]=useState(null),[query,setQuery]=useState(''),[filter,setFilter]=useState('全部');
  const rows=useMemo(()=>customers.filter(c=>(filter==='全部'||c.stage===filter)&&`${c.company} ${c.contact} ${c.state} ${c.city}`.toLowerCase().includes(query.toLowerCase())),[customers,query,filter]);
  const saveCustomer=e=>{e.preventDefault(); if(!editing.company.trim())return; const item={...editing,updatedAt:new Date().toISOString()}; setCustomers(prev=>prev.some(c=>c.id===item.id)?prev.map(c=>c.id===item.id?item:c):[item,...prev]);setEditing(null)};
  const remove=c=>{if(confirm(`删除“${c.company}”的CRM记录？此操作可通过备份恢复。`))setCustomers(v=>v.filter(x=>x.id!==c.id))};
  return <Card className="workbench-card"><div className="workbench-head"><div><span className="kicker">本地客户工作台</span><h3>CRM 与资格评分</h3></div><button className="primary" onClick={()=>setEditing(blank())}>新增客户</button></div>
    <div className="toolbar"><input aria-label="搜索客户" placeholder="搜索公司、联系人或地区" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="按阶段筛选" value={filter} onChange={e=>setFilter(e.target.value)}><option>全部</option>{funnelStages.map(x=><option key={x}>{x}</option>)}</select></div>
    {!rows.length?<Empty>{customers.length?'没有符合筛选条件的客户。':'尚无客户记录。先录入第一家目标企业，首页漏斗会自动更新。'}</Empty>:<div className="table-scroll"><table><thead><tr><th>公司 / 地区</th><th>联系人</th><th>阶段</th><th>评分</th><th>下一步</th><th></th></tr></thead><tbody>{rows.map(c=>{const score=scoreCustomer(c);return <tr key={c.id}><td><strong>{c.company}</strong><small>{[c.city,c.state].filter(Boolean).join(', ')||'地区待确认'} · {c.type}</small></td><td>{c.contact||'待确认'}<small>{c.title}</small></td><td><Tag tone={['成交'].includes(c.stage)?'green':['失败','暂缓'].includes(c.stage)?'muted':'gold'}>{c.stage}</Tag></td><td><strong>{score}/14</strong><small>{scoreLabel(score)}</small></td><td>{c.nextStep||'待设置'}<small>{c.nextDate}</small></td><td className="row-actions"><button onClick={()=>setEditing({...c,scores:{...c.scores}})}>编辑</button><button className="danger-link" onClick={()=>remove(c)}>删除</button></td></tr>})}</tbody></table></div>}
    {editing&&<Modal title={customers.some(c=>c.id===editing.id)?'编辑客户':'新增客户'} onClose={()=>setEditing(null)}><form className="form-grid" onSubmit={saveCustomer}>
      <label>公司名称*<input required value={editing.company} onChange={e=>setEditing({...editing,company:e.target.value})}/></label><label>网站<input type="url" value={editing.website} onChange={e=>setEditing({...editing,website:e.target.value})}/></label>
      <label>州<input value={editing.state} onChange={e=>setEditing({...editing,state:e.target.value})}/></label><label>城市<input value={editing.city} onChange={e=>setEditing({...editing,city:e.target.value})}/></label>
      <label>客户类型<select value={editing.type} onChange={e=>setEditing({...editing,type:e.target.value})}>{customerTypes.map(x=><option key={x}>{x}</option>)}</select></label><label>CRM阶段<select value={editing.stage} onChange={e=>setEditing({...editing,stage:e.target.value})}>{funnelStages.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>联系人<input value={editing.contact} onChange={e=>setEditing({...editing,contact:e.target.value})}/></label><label>职位<input value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})}/></label>
      <label>邮件<input type="email" value={editing.email} onChange={e=>setEditing({...editing,email:e.target.value})}/></label><label>电话<input value={editing.phone} onChange={e=>setEditing({...editing,phone:e.target.value})}/></label>
      <label>线索来源<input value={editing.source} onChange={e=>setEditing({...editing,source:e.target.value})}/></label><label>清洗场景<input value={editing.scene} onChange={e=>setEditing({...editing,scene:e.target.value})}/></label>
      <label>当前方法<textarea value={editing.method} onChange={e=>setEditing({...editing,method:e.target.value})}/></label><label>主要痛点<textarea value={editing.pain} onChange={e=>setEditing({...editing,pain:e.target.value})}/></label>
      <label>采购参与人<input value={editing.buyers} onChange={e=>setEditing({...editing,buyers:e.target.value})}/></label><label>预计时间<input value={editing.timing} onChange={e=>setEditing({...editing,timing:e.target.value})}/></label>
      <label>下一步<input value={editing.nextStep} onChange={e=>setEditing({...editing,nextStep:e.target.value})}/></label><label>下一步日期<input type="date" value={editing.nextDate} onChange={e=>setEditing({...editing,nextDate:e.target.value})}/></label>
      <label className="full">暂缓/失败原因<textarea value={editing.reason} onChange={e=>setEditing({...editing,reason:e.target.value})}/></label>
      <fieldset className="full score-grid"><legend>资格评分（每项0—2分）</legend>{scoreFields.map(field=><label key={field}>{field}<select value={editing.scores[field]||0} onChange={e=>setEditing({...editing,scores:{...editing.scores,[field]:Number(e.target.value)}})}><option value="0">0 · 未确认/较弱</option><option value="1">1 · 中等</option><option value="2">2 · 明确/较强</option></select></label>)}</fieldset>
      <div className="form-actions full"><button type="button" onClick={()=>setEditing(null)}>取消</button><button className="primary" type="submit">保存客户</button></div>
    </form></Modal>}
  </Card>;
}
