import{j as a}from"./app-JxI1Wk8V.js";import{L as p}from"./loader-circle-DsEpsruw.js";function g({type:s="button",variant:o="primary",size:i="md",isLoading:e=!1,disabled:d=!1,children:m,className:b="",...c}){const l="inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2",r={sm:"px-3 py-1.5 text-xs rounded-lg gap-1.5",md:"px-4 py-2 text-sm rounded-xl gap-2",lg:"px-5 py-2.5 text-base rounded-xl gap-2.5"},t={primary:"bg-brand-primary text-white hover:bg-brand-primary-hover focus:ring-brand-primary shadow-sm",secondary:"bg-white border border-border-subtle text-text-primary hover:bg-bg-surface-muted focus:ring-brand-primary","tonal-green":"bg-brand-subtle text-brand-primary hover:bg-emerald-100 focus:ring-brand-primary","tonal-danger":"bg-finance-expense-subtle text-finance-expense-text hover:bg-red-100 focus:ring-finance-expense",ghost:"text-text-secondary hover:text-text-primary hover:bg-bg-surface-muted"},n=d||e;return a.jsxs("button",{type:s,disabled:n,className:`
                ${l}
                ${r[i]||r.md}
                ${t[o]||t.primary}
                ${n?"opacity-60 cursor-not-allowed":""}
                ${b}
            `,...c,children:[e&&a.jsx(p,{className:"w-4 h-4 animate-spin shrink-0"}),m]})}export{g as B};
