// Las casillas representan datos o resultados intermedios, no la respuesta final.
const t = value => ({type:'text', value})
const slot = (label, value) => ({type:'slot', label, value})
const fraction = (top, bottom) => ({type:'fraction', top, bottom})
const root = body => ({type:'root', body})
const power = (base, exponent) => ({type:'power', base, exponent})
const formula = (symbol, parts, description) => ({symbol, parts, description})

export function binomialFormulas(n,p,x,type,lo,hi){
 const range = type==='exactamente' ? `k = ${x}` : type==='a lo mucho' ? `k = 0 hasta ${x}` : type==='al menos' ? `k = ${x} hasta ${n}` : type==='más de' ? `k = ${x+1} hasta ${n}` : type==='menos de' ? `k = 0 hasta ${x-1}` : `k = ${lo} hasta ${hi}`
 const k=type==='exactamente'?x:type==='a lo mucho'||type==='menos de'?0:type==='al menos'?x:type==='más de'?x+1:lo
 return [null,null,formula('P(X = k)',[t('C('),slot('número de ensayos n',n),t(', '),slot('valor k',k),t(') · '),power([slot('probabilidad de éxito p',p)],[slot('valor k',k)]),t(' · '),power([t('(1 − '),slot('probabilidad de éxito p',p),t(')')],[slot('número de ensayos n',n),t(' − '),slot('valor k',k)])],`Empieza con k = ${k}. Para la probabilidad pedida utiliza ${range}: calcula un término para cada k y súmalos. C(n, k) cuenta las combinaciones posibles.`)]
}
export function pearsonFormulas(x,y,q){
 const sx=q.dx.reduce((s,v)=>s+v*v,0),sy=q.dy.reduce((s,v)=>s+v*v,0)
 return [formula('x̄',[fraction([slot('suma de X',x.reduce((a,b)=>a+b,0))],[slot('número de pares',x.length)])],'Suma todos los valores de X y divídelos entre el número de pares.'),formula('ȳ',[fraction([slot('suma de Y',y.reduce((a,b)=>a+b,0))],[slot('número de pares',y.length)])],'Haz lo mismo con los valores de Y.'),formula('Numerador',[t('Σ (x − x̄)(y − ȳ)')],'Para cada fila, multiplica las dos desviaciones y suma los productos.'),formula('Denominador',[root([slot('suma de cuadrados de X',sx),t(' × '),slot('suma de cuadrados de Y',sy)])],'Suma cada columna de cuadrados, multiplica ambas sumas y calcula la raíz.'),formula('r',[fraction([slot('numerador',q.num)],[slot('denominador',q.den)])],'Usa los resultados de los pasos anteriores. Conserva cifras adicionales antes de redondear.')]
}
export function bayesFormulas(records,labels,counts,target,cats,laplace){
 const size=records.length,v=target.length
 return [...labels.map((l,j)=>formula(`P(${l})`,[fraction([slot(`frecuencia de ${l}`,counts[j])],[slot('total de registros',size)])],'Cuenta los registros de esta clase y divídelos entre el total.')),...labels.map((l,j)=>{const parts=[fraction([slot(`frecuencia de ${l}`,counts[j])],[slot('total de registros',size)])];target.forEach((value,i)=>{const f=records.filter(r=>r[v]===l&&r[i]===value).length;parts.push(t(' × '),fraction(laplace?[slot(`frecuencia de A${i+1}=${value} en ${l}`,f),t(' + 1')]:[slot(`frecuencia de A${i+1}=${value} en ${l}`,f)],laplace?[slot(`frecuencia de ${l}`,counts[j]),t(` + ${cats}`)]:[slot(`frecuencia de ${l}`,counts[j])]))});return formula(`Puntaje ${l}`,parts,laplace?'En cada fracción suma 1 a la frecuencia y el número de categorías al denominador.':'Cada fracción compara la frecuencia de la categoría dentro de la clase con el total de esa clase.')})]
}
export function treeFormulas(counts,size,base,gains){
 const parts=[];counts.forEach((count,i)=>{parts.push(t(i?' − ':'− '),fraction([slot(`frecuencia de clase ${i+1}`,count)],[slot('total de registros',size)]),t(' × log₂('),fraction([slot(`frecuencia de clase ${i+1}`,count)],[slot('total de registros',size)]),t(')'))})
 return [formula('H(S)',parts,'Cada fracción es la proporción de una clase. Para una frecuencia cero, su término se toma como cero.'),...gains.map((g,i)=>formula(`Ganancia A${i+1}`,[slot('entropía inicial',base),t(' − '),slot(`entropía ponderada de A${i+1}`,g.weighted)],'La entropía ponderada es la suma de la entropía de cada rama multiplicada por su proporción de registros.'))]
}
export function regressionFormulas(b0,bs,xs,actual,pred){
 return [formula('β₀',[t('término independiente')],'Busca el número que no multiplica a ninguna variable.'),...bs.map((b,i)=>formula(`β${i+1}X${i+1}`,[slot(`coeficiente β${i+1}`,b),t(' × '),slot(`valor X${i+1}`,xs[i])],'Multiplica el coeficiente por el valor de la variable.')),formula('ŷ',[slot('intercepto',b0),...bs.flatMap((b,i)=>[t(' + ('),slot(`coeficiente β${i+1}`,b),t(' × '),slot(`valor X${i+1}`,xs[i]),t(')')])],'Sustituye cada valor y suma las contribuciones. Un coeficiente negativo conserva su signo.'),formula('Residuo',[slot('valor observado Y',actual),t(' − '),slot('predicción ŷ',pred)],'El residuo es el valor observado menos el valor predicho.')]
}
export function matrixFormulas(tp,tn,fp,fn,m,count){
 const f=[formula('Accuracy',[fraction([slot('TP',tp),t(' + '),slot('TN',tn)],[slot('total de observaciones',tp+tn+fp+fn)])],'Proporción total de predicciones correctas.'),formula('Precision',[fraction([slot('TP',tp)],[slot('TP',tp),t(' + '),slot('FP',fp)])],'De todas las predicciones positivas, ¿cuántas eran positivas?'),formula('Recall',[fraction([slot('TP',tp)],[slot('TP',tp),t(' + '),slot('FN',fn)])],'De todos los positivos reales, ¿cuántos detectó el modelo?'),formula('Specificity',[fraction([slot('TN',tn)],[slot('TN',tn),t(' + '),slot('FP',fp)])],'De todos los negativos reales, ¿cuántos identificó correctamente?'),formula('F1',[fraction([t('2 × '),slot('precision',m.precision),t(' × '),slot('recall',m.recall)],[slot('precision',m.precision),t(' + '),slot('recall',m.recall)])],'Combina precision y recall. Conserva cifras adicionales antes de redondear.')]
 return [formula('TP',[t('real positivo ∩ predicho positivo')],'Busca la celda donde coinciden la fila positiva y la columna positiva.'),...f.slice(0,count)]
}
