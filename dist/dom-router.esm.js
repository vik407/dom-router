const t=/.*\#/,s=window.requestAnimationFrame;class e{constructor(t){this.hash=t.hash,this.element=t.element,this.trigger=t.trigger,this.timestamp=(new Date).toISOString()}}class i{constructor({active:t=!0,callback:s=function(){},css:e={current:"dr-current",hidden:"dr-hidden"},ctx:i=document.body,start:r=null,delimiter:o="/",logging:h=!1,stickyPos:n=!0,stickyRoute:c=!0,stop:l=!0,storage:a="session",storageKey:d="lastRoute"}={}){this.active=t,this.callback=s,this.css=e,this.ctx=i,this.delimiter=o,this.history=[],this.logging=h,this.routes=[],this.stickyPos=n,this.stickyRoute=c,this.storage="session"===a?sessionStorage:localStorage,this.storageKey=d,this.stop=l,this.start=this.stickyRoute&&this.storage.getItem(this.storageKey)||r}current(){return this.history[this.history.length-1]}handler(){const i=this.history.length>0&&(this.current().hash||"").replace(t,"")||null,r=location.hash.includes("#")?location.hash.replace(t,""):null;if(this.active&&this.valid(r))if(this.routes.includes(r)){const t=document.body.scrollTop,o=i?i.split(this.delimiter):[],h=r.split(this.delimiter),n=[];let c="";for(const t of o)c+=`${c.length>0?`${this.delimiter}`:""}${t}`,n.push(...this.select(`a[href="#${c}"]`));s((()=>{let s,i;for(const t of n)t.classList.remove(this.css.current);for(const t of h.keys()){const e=t+1,r=o.length>=e,n=r?this.select(`#${o.slice(0,e).join(" #")}`):void 0,c=r?this.select(`a[href='#${o.slice(0,e).join(this.delimiter)}']`):void 0;s=this.select(`#${h.slice(0,e).join(" #")}`),i=this.select(`a[href='#${h.slice(0,e).join(this.delimiter)}']`),this.load(c,n,i,s)}this.stickyRoute&&this.storage.setItem(this.storageKey,r),this.stickyPos&&(document.body.scrollTop=t);const c=function(t={element:null,hash:"",trigger:null}){return new e(t)}({element:s,hash:r,trigger:i});this.log(c),this.callback(c)}))}else this.route(this.routes.filter((t=>t.includes(r)))[0]||this.start);return this}load(t=[],s=[],e=[],i=[]){for(const s of t)s.classList.remove(this.css.current);if(s.length>0&&s.id!==i.id)for(const t of s)t.classList.add(this.css.hidden);for(const t of e)t.classList.add(this.css.current);if(s.length>0&&s.id!==i.id)for(const t of s)t.classList.add(this.css.hidden);return this}log(t){return this.history.push(this.logging?t:{hash:t.hash}),this}popstate(t){return this.handler(t),this}process(){const t=document.location.hash.replace("#","");this.scan(this.start),this.ctx.classList.contains(this.css.hidden)||(t.length>0&&this.routes.includes(t)?this.handler():this.route(this.start))}route(t=""){return document.location.hash=t,this}select(t){return Array.from(this.ctx.querySelectorAll.call(this.ctx,t)).filter((t=>null!==t))}scan(s=""){const e=null===s?"":s;return this.routes=Array.from(new Set(this.select("a[href*='#']").map((s=>s.href.replace(t,""))).filter((t=>""!==t)))),e.length>0&&!this.routes.includes(e)&&this.routes.push(e),this.start=e||this.routes[0]||null,this}sweep(t,e){return s((()=>{Array.from(t.parentNode.childNodes).filter((s=>1===s.nodeType&&s.id&&s.id!==t.id)).forEach((t=>t.classList.add(e))),t.classList.remove(e)})),this}valid(t=""){return""===t||!1===/=/.test(t)}}function r(t){const s=new i(t);return s.popstate=s.popstate.bind(s),"addEventListener"in window?window.addEventListener("popstate",s.popstate,!1):window.onpopstate=s.popstate,s.active&&s.process(),s}export{r as router};