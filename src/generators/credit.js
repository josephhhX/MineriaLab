// Cada lista define el dominio completo, incluidas categorías que podrían no aparecer en la muestra.
export const creditAttributes = [
 {name:'Historial de pago',values:['Puntual','Con retrasos','Sin historial','Incumplido','En recuperación']},
 {name:'Nivel de ingresos',values:['Alto','Medio','Bajo','Variable','Sin ingresos']},
 {name:'Flujo de caja',values:['Estable','Variable','Insuficiente','Creciente','Decreciente']},
 {name:'Nivel de deuda',values:['Bajo','Medio','Alto','Sin deuda','Muy alto']},
 {name:'Situación laboral',values:['Estable','Temporal','Independiente','Desempleado','Jubilado']},
 {name:'Garantía',values:['Suficiente','Insuficiente','Sin garantía','Compartida','En revisión']},
]
export function creditClasses(count){
 return count===2?['Pagó','No pagó']:['Pagó a tiempo','Pagó con retraso','No pagó','Pago parcial'].slice(0,count)
}
