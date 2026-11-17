import {useState} from 'react'
import {validAnswer} from '../utils/math'

// Se mantienen rutas estables para identificar cada casilla dentro de la expresión.
function slotsIn(nodes, path='') {
 return nodes.flatMap((node,i)=>{
  const key=`${path}${i}`
  if(node.type==='slot') return [{key,...node}]
  if(node.type==='fraction') return [...slotsIn(node.top,`${key}t`),...slotsIn(node.bottom,`${key}b`)]
  if(node.type==='root') return slotsIn(node.body,`${key}r`)
  if(node.type==='power') return [...slotsIn(node.base,`${key}a`),...slotsIn(node.exponent,`${key}e`)]
  return []
 })
}

export default function Formula({formula,review=false}) {
 const [values,setValues]=useState({})
 const [checked,setChecked]=useState(false)
 const slots=slotsIn(formula.parts)
 const places=4
 const correct=slots.filter(s=>validAnswer(values[s.key]||'',s.value,places)).length
 function render(nodes,path='') {
  return nodes.map((node,i)=>{
   const key=`${path}${i}`
   if(node.type==='text') return <span key={key}>{node.value}</span>
   if(node.type==='slot') return <label className="formula-slot" key={key}><span className="slot-label">{node.label}</span><input inputMode="decimal" aria-label={node.label} placeholder="?" value={review?String(Number(node.value.toFixed(places))):values[key]||''} readOnly={review} onChange={e=>{setValues({...values,[key]:e.target.value});setChecked(false)}} /></label>
   if(node.type==='fraction') return <span className="formula-fraction" key={key}><span>{render(node.top,`${key}t`)}</span><span>{render(node.bottom,`${key}b`)}</span></span>
   if(node.type==='root') return <span className="formula-root" key={key}><span aria-hidden="true">√</span><span className="radicand">{render(node.body,`${key}r`)}</span></span>
   if(node.type==='power') return <span className="formula-power" key={key}><span>{render(node.base,`${key}a`)}</span><sup>{render(node.exponent,`${key}e`)}</sup></span>
   return null
  })
 }
 return <div className="formula-card"><div className="formula-top"><strong>{slots.length?'Sustituye en la fórmula':'Fórmula del paso'}</strong><span>Guía visual</span></div><p>{formula.description}</p><div className="formula-scroll"><div className="formula-expression"><span className="formula-symbol">{formula.symbol} = </span>{render(formula.parts)}</div></div>{slots.length>0&&!review&&<><p className="formula-help">Escribe el valor indicado en cada casilla. Para valores intermedios, usa al menos 4 decimales.</p><div className="formula-actions"><button type="button" onClick={()=>setChecked(true)}>Comprobar sustitución</button>{checked&&<span role="status" className={correct===slots.length?'good':'bad'}>{correct===slots.length?'Todos los valores son correctos.':`${correct} de ${slots.length} casillas correctas. Revisa las etiquetas y los datos.`}</span>}</div></>}{review&&slots.length>0&&<p className="formula-help">Valores sustituidos, redondeados a 4 decimales.</p>}</div>
}
