import{r as S,j as e}from"./app-JxI1Wk8V.js";import{c as k}from"./circle-exclamation-point-yturahM8.js";import{C as v}from"./calendar-BFdiWo7M.js";const p={name:"search",size:24,node:[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]};p.node;const C=k(p),R=S.forwardRef(({variant:t="default",label:n,error:c,helperText:o,suffixAction:a,value:d,onChange:l,onRawChange:i,placeholder:m,disabled:u=!1,className:f="",id:h,type:b="text",...y},g)=>{const x=h||(n?n.toLowerCase().replace(/\s+/g,"-"):void 0),j=s=>{if(!s&&s!==0)return"";const r=String(s).replace(/[^0-9]/g,"");return r?r.replace(/\B(?=(\d{3})+(?!\d))/g,"."):""},N=s=>{const r=s.target.value.replace(/[^0-9]/g,""),I=r?parseInt(r,10):0;i&&i(I),l&&(s.target.value=r,l(s))},w=t==="currency"?j(d):d,$=`
        w-full rounded-xl border text-sm text-text-primary bg-white
        placeholder:text-text-muted transition-all duration-150
        focus:outline-none focus:ring-2
        ${c?"border-finance-expense-text focus:border-finance-expense-text focus:ring-finance-expense-text/20":"border-border-subtle hover:border-[#84928A] focus:border-brand-primary focus:ring-brand-primary/20"}
        ${u?"opacity-60 cursor-not-allowed bg-bg-surface-muted":""}
    `;return e.jsxs("div",{className:"w-full flex flex-col gap-1.5",children:[n&&e.jsx("label",{htmlFor:x,className:"text-xs font-semibold text-text-secondary tracking-wide uppercase",children:n}),e.jsxs("div",{className:"relative flex items-center",children:[t==="search"&&e.jsx("div",{className:"absolute left-3.5 pointer-events-none text-text-muted",children:e.jsx(C,{className:"w-4 h-4"})}),t==="currency"&&e.jsx("div",{className:"absolute left-3.5 pointer-events-none text-sm font-semibold text-text-secondary select-none",children:"Rp"}),e.jsx("input",{ref:g,id:x,type:t==="currency"?"text":b,value:w??"",disabled:u,placeholder:m,onChange:t==="currency"?N:l,className:`
                        ${$}
                        ${t==="currency"?"pl-11 pr-4 tabular-nums font-medium":""}
                        ${t==="search"?"pl-10 pr-4":""}
                        ${t==="date"?"pr-10 pl-4 tabular-nums":""}
                        ${t==="default"?a?"pl-4 pr-11":"px-4":""}
                        py-2.5
                        ${f}
                    `,...y}),a&&e.jsx("div",{className:"absolute right-3 flex items-center",children:a}),t==="date"&&e.jsx("div",{className:"absolute right-3.5 pointer-events-none text-brand-primary",children:e.jsx(v,{className:"w-4 h-4"})})]}),c&&e.jsx("span",{className:"text-xs font-medium text-finance-expense-text flex items-center gap-1 mt-0.5",children:c}),!c&&o&&e.jsx("span",{className:"text-xs text-text-muted mt-0.5",children:o})]})});R.displayName="Input";export{R as I,C as S};
