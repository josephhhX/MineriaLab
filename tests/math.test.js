import {test} from 'node:test'
import assert from 'node:assert/strict'
import {binomial,entropy,pearson,metrics,validAnswer,validStep} from '../src/utils/math.js'
import {calculate} from '../src/utils/calculator.js'
test('binomial y entropía',()=>{assert.ok(Math.abs(binomial(10,.5,5)-.24609375)<1e-12);assert.equal(entropy([5,5]),1);assert.equal(entropy([10,0]),0)})
test('correlación y métricas',()=>{assert.ok(Math.abs(pearson([1,2,3],[2,4,6]).r-1)<1e-12);const m=metrics(40,50,10,20);assert.equal(m.precision,.8);assert.equal(m.recall,40/60);assert.equal(m.accuracy,.75)})
test('validación y calculadora',()=>{assert.equal(validAnswer('',0),false);assert.equal(validAnswer('1,23',1.234,2),true);assert.equal(validAnswer('abc',0),false);assert.equal(calculate('sqrt(9)+2^3'),11);assert.throws(()=>calculate('1/0'))})
import {generate,topics,defaults} from '../src/generators/exercises.js'
test('generadores producen respuestas finitas con distintas configuraciones',()=>{for(const topic of topics){for(let i=0;i<50;i++){const ex=generate(topic.id,{...defaults,rows:i%27+4,variables:i%4+2,categories:i%3+2,classes:i%2+2,laplace:i%2===0});assert.ok(ex.steps.length>0);for(const s of ex.steps)assert.ok(s.type==='choice'?s.answers.length>0:Number.isFinite(s.answer),`${topic.id}: ${s.label}`)}}})
import {pearsonFormulas,matrixFormulas,bayesFormulas,binomialFormulas} from '../src/generators/formulas.js'
const collectSlots=nodes=>nodes.flatMap(n=>n.type==='slot'?[n]:n.type==='fraction'?[...collectSlots(n.top),...collectSlots(n.bottom)]:n.type==='root'?collectSlots(n.body):n.type==='power'?[...collectSlots(n.base),...collectSlots(n.exponent)]:[])
test('las casillas de las fórmulas corresponden a los datos generados',()=>{
 const q=pearson([1,2,3],[2,4,6]);const formulas=pearsonFormulas([1,2,3],[2,4,6],q)
 assert.deepEqual(collectSlots(formulas[0].parts).map(s=>s.value),[6,3])
 assert.deepEqual(collectSlots(formulas[4].parts).map(s=>s.value),[q.num,q.den])
 const m=metrics(40,50,10,20);const precision=matrixFormulas(40,50,10,20,m,5)[2]
 assert.deepEqual(collectSlots(precision.parts).map(s=>s.value),[40,40,10])
 const b=bayesFormulas([['V1','C1'],['V2','C2'],['V1','C1'],['V2','C2']],['C1','C2'],[2,2],['V1'],2,true)
 assert.deepEqual(collectSlots(b[2].parts).map(s=>s.value),[2,4,2,2])
 const more=binomialFormulas(10,.5,4,'más de',3,5)[2]
 assert.ok(more.description.includes('k = 5'));assert.ok(collectSlots(more.parts).some(s=>s.label==='valor k'&&s.value===5))
})
test('Naive Bayes usa atributos legibles y frecuencias consistentes en cada configuración',()=>{
 for(const classes of [2,3,4])for(const categories of [2,3,4,5])for(const laplace of [false,true]){
  const ex=generate('bayes',{...defaults,rows:12,variables:4,categories,classes,laplace})
  assert.deepEqual(ex.headers,['Historial de pago','Nivel de ingresos','Flujo de caja','Nivel de deuda','Resultado del pago'])
  assert.equal(ex.rows.length,12)
  const outcomes=[...new Set(ex.rows.map(row=>row[4]))];assert.equal(outcomes.length,classes)
  for(let j=0;j<classes;j++){
   const label=ex.steps[j].label.slice('Probabilidad previa P('.length,-1)
   const count=ex.rows.filter(row=>row[4]===label).length
   assert.equal(ex.steps[j].answer,count/12)
   const scoreStep=ex.steps[classes+j],slots=collectSlots(scoreStep.formula.parts)
   const actual=[count,12]
   for(let k=0;k<4;k++){
    const slot=slots[2+k*2],value=slot.label.split(': ')[1].split(', en ')[0]
    actual.push(ex.rows.filter(row=>row[4]===label&&row[k]===value).length,count)
   }
   assert.deepEqual(slots.map(slot=>slot.value),actual)
   let expected=count/12
   for(let k=0;k<4;k++)expected*=(actual[2+k*2]+(laplace?1:0))/(count+(laplace?categories:0))
   assert.ok(Math.abs(scoreStep.answer-expected)<1e-14)
  }
  const choice=ex.steps.at(-1)
  assert.equal(validStep('',choice),false)
  for(const answer of choice.answers)assert.equal(validStep(answer,choice),true)
  for(const option of choice.options.filter(o=>!choice.answers.includes(o)))assert.equal(validStep(option,choice),false)
 }
})
