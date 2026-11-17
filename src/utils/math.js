export const mean = a => a.reduce((s,v)=>s+v,0)/a.length
export const entropy = counts => { const n=counts.reduce((a,b)=>a+b,0); return n ? Math.abs(counts.filter(Boolean).reduce((s,c)=>{const p=c/n;return s+p*Math.log2(p)},0)) : 0 }
export const binomial = (n,p,k) => { if(k<0||k>n)return 0; let c=1; for(let i=1;i<=k;i++) c=c*(n-i+1)/i; return c*p**k*(1-p)**(n-k) }
export const pearson = (x,y) => {const mx=mean(x),my=mean(y);const dx=x.map(v=>v-mx),dy=y.map(v=>v-my);const num=dx.reduce((s,v,i)=>s+v*dy[i],0);const den=Math.sqrt(dx.reduce((s,v)=>s+v*v,0)*dy.reduce((s,v)=>s+v*v,0));return {mx,my,num,den,r:num/den,dx,dy}}
export const metrics = (tp,tn,fp,fn) => {const div=(a,b)=>b?a/b:0;const precision=div(tp,tp+fp),recall=div(tp,tp+fn);return {accuracy:div(tp+tn,tp+tn+fp+fn),precision,recall,specificity:div(tn,tn+fp),f1:div(2*precision*recall,precision+recall)}}
export const validAnswer = (input, expected, decimals=2) => {if(typeof input!=='string'||!input.trim())return false; const value=Number(input.trim().replace(',','.')); return Number.isFinite(value)&&Math.abs(value-expected)<=(0.5*10**(-decimals)+1e-10)}

