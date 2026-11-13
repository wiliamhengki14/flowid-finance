import{r as g,j as e}from"./app-JxI1Wk8V.js";import{a as w}from"./AuthenticatedLayout-DjbTW0KD.js";const v=g.forwardRef(({options:l=[],variant:c="form-select",label:t,error:r,placeholder:a,value:x,onChange:d,disabled:o=!1,className:m="",id:u,...p},f)=>{const i=u||(t?t.toLowerCase().replace(/\s+/g,"-"):void 0),s=c==="filter-select",h=`
        appearance-none bg-white border text-text-primary transition-all duration-150
        focus:outline-none focus:ring-2 cursor-pointer
        ${r?"border-finance-expense-text focus:border-finance-expense-text focus:ring-finance-expense-text/20":"border-border-subtle hover:border-[#84928A] focus:border-brand-primary focus:ring-brand-primary/20"}
        ${o?"opacity-60 cursor-not-allowed bg-bg-surface-muted":""}
    `,b=s?"py-2 pl-3.5 pr-8 text-xs font-medium rounded-xl shadow-sm":"w-full py-2.5 pl-4 pr-10 text-sm rounded-xl";return e.jsxs("div",{className:`flex flex-col gap-1.5 ${s?"w-auto":"w-full"}`,children:[t&&e.jsx("label",{htmlFor:i,className:"text-xs font-semibold text-text-secondary tracking-wide uppercase",children:t}),e.jsxs("div",{className:"relative inline-flex items-center w-full",children:[e.jsxs("select",{ref:f,id:i,value:x,onChange:d,disabled:o,className:`
                        ${h}
                        ${b}
                        ${m}
                    `,...p,children:[a&&e.jsx("option",{value:"",disabled:!0,className:"text-text-muted",children:a}),l.map(n=>e.jsx("option",{value:n.value,children:n.label},String(n.value)))]}),e.jsx("div",{className:`absolute right-3 pointer-events-none text-text-muted ${s?"right-2.5":"right-3.5"}`,children:e.jsx(w,{className:s?"w-3.5 h-3.5":"w-4 h-4"})})]}),r&&e.jsx("span",{className:"text-xs font-medium text-finance-expense-text mt-0.5",children:r})]})});v.displayName="Select";export{v as S};
