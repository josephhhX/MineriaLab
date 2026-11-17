import {test} from 'node:test'
import assert from 'node:assert/strict'
import {binomial,entropy,pearson,metrics,validAnswer} from '../src/utils/math.js'
import {calculate} from '../src/utils/calculator.js'
test('binomial y entropía',()=>{assert.ok(Math.abs(binomial(10,.5,5)-.24609375)<1e-12);assert.equal(entropy([5,5]),1);assert.equal(entropy([10,0]),0)})
test('correlación y métricas',()=>{assert.ok(Math.abs(pearson([1,2,3],[2,4,6]).r-1)<1e-12);const m=metrics(40,50,10,20);assert.equal(m.precision,.8);assert.equal(m.recall,40/60);assert.equal(m.accuracy,.75)})
test('validación y calculadora',()=>{assert.equal(validAnswer('',0),false);assert.equal(validAnswer('1,23',1.234,2),true);assert.equal(validAnswer('abc',0),false);assert.equal(calculate('sqrt(9)+2^3'),11);assert.throws(()=>calculate('1/0'))})
import {generate,topics,defaults} from '../src/generators/exercises.js'
test('generadores producen respuestas finitas con distintas configuraciones',()=>{for(const topic of topics){for(let i=0;i<50;i++){const ex=generate(topic.id,{...defaults,rows:i%27+4,variables:i%4+2,categories:i%3+2,classes:i%2+2,laplace:i%2===0});assert.ok(ex.steps.length>0);for(const s of ex.steps)assert.ok(Number.isFinite(s.answer),`${topic.id}: ${s.label}`)}}})
