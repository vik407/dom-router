!function(t,s){"object"==typeof exports&&"undefined"!=typeof module?s(exports):"function"==typeof define&&define.amd?define(["exports"],s):s((t="undefined"!=typeof globalThis?globalThis:t||self).domRouter={})}(this,(function(t){"use strict";const s="",e=/.*\#/,i=window.requestAnimationFrame;class o{constructor(t){this.hash=t.hash,this.element=t.element,this.trigger=t.trigger,this.timestamp=(new Date).toISOString()}}class r{constructor({active:t=!0,callback:s=function(){},css:e={current:"dr-current",hidden:"dr-hidden"},ctx:i=document.body,start:o=null,delimiter:r="/",logging:h=!1,stickyPos:n=!0,stickyRoute:l=!0,stop:c=!0,storage:a="session",storageKey:d="lastRoute"}={}){this.active=t,this.callback=s,this.css=e,this.ctx=i,this.delimiter=r,this.history=[],this.logging=h,this.routes=[],this.stickyPos=n,this.stickyRoute=l,this.storage="session"===a?sessionStorage:localStorage,this.storageKey=d,this.stop=c,this.start=this.stickyRoute&&this.storage.getItem(this.storageKey)||o}current(){return this.history[this.history.length-1]}handler(){const t=this.history.length>0&&(this.current().hash||s).replace(e,s)||null,r=location.hash.includes("#")?location.hash.replace(e,s):null;if(this.active&&this.valid(r))if(this.routes.includes(r)){const e=document.body.scrollTop,h=t?t.split(this.delimiter):[],n=r.split(this.delimiter),l=[];let c=s;for(const t of h)c+=`${c.length>0?`${this.delimiter}`:s}${t}`,l.push(...this.select(`a[href="#${c}"]`));i((()=>{let t,s;for(const t of l)t.classList.remove(this.css.current);for(const e of n.keys()){const i=e+1,o=h.length>=i,r=o?this.select(`#${h.slice(0,i).join(" #")}`):void 0,l=o?this.select(`a[href='#${h.slice(0,i).join(this.delimiter)}']`):void 0;t=this.select(`#${n.slice(0,i).join(" #")}`),s=this.select(`a[href='#${n.slice(0,i).join(this.delimiter)}']`),this.load(l,r,s,t)}this.stickyRoute&&this.storage.setItem(this.storageKey,r),this.stickyPos&&(document.body.scrollTop=e);const i=function(t={element:null,hash:"",trigger:null}){return new o(t)}({element:t,hash:r,trigger:s});this.log(i),this.callback(i)}))}else this.route(this.routes.filter((t=>t.includes(r)))[0]||this.start);return this}load(t=[],s=[],e=[],i=[]){for(const s of t)s.classList.remove(this.css.current);if(s.length>0&&s.id!==i.id)for(const t of s)t.classList.add(this.css.hidden);for(const t of e)t.classList.add(this.css.current);if(s.length>0&&s.id!==i.id)for(const t of s)t.classList.add(this.css.hidden);return this}log(t){return this.history.push(this.logging?t:{hash:t.hash}),this}popstate(t){return this.handler(t),this}process(){const t=document.location.hash.replace("#",s);this.scan(this.start),this.ctx.classList.contains(this.css.hidden)||(t.length>0&&this.routes.includes(t)?this.handler():this.route(this.start))}route(t=""){return document.location.hash=t,this}select(t){return Array.from(this.ctx.querySelectorAll.call(this.ctx,t)).filter((t=>null!==t))}scan(t=""){const i=null===t?s:t;return this.routes=Array.from(new Set(this.select("a[href*='#']").map((t=>t.href.replace(e,s))).filter((t=>t!==s)))),i.length>0&&!this.routes.includes(i)&&this.routes.push(i),this.start=i||this.routes[0]||null,this}sweep(t,s){return i((()=>{Array.from(t.parentNode.childNodes).filter((s=>1===s.nodeType&&s.id&&s.id!==t.id)).forEach((t=>t.classList.add(s))),t.classList.remove(s)})),this}valid(t=""){return t===s||!1===/=/.test(t)}}t.router=function(t){const s=new r(t);return s.popstate=s.popstate.bind(s),"addEventListener"in window?window.addEventListener("popstate",s.popstate,!1):window.onpopstate=s.popstate,s.active&&s.process(),s},Object.defineProperty(t,"__esModule",{value:!0})}));
