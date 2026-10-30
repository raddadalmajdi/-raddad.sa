import{n as e}from"./rolldown-runtime-Czjbc987.js";import{C as t,b as n,c as r,d as i,g as a,h as o,l as s,m as c,v as l,x as u,y as d}from"./init-Bg4yXhPS.js";import{a as f,c as p,i as m,n as h,o as g}from"./ui-BfJNoFrq.js";function _(e=new Date){let t=new Intl.DateTimeFormat(`en-CA`,{timeZone:y,year:`numeric`,month:`2-digit`}).formatToParts(e),n=t.find(e=>e.type===`year`)?.value,r=t.find(e=>e.type===`month`)?.value;if(!n||!r)throw Error(`تعذر تحديد شهر التذكرة.`);return`${n}-${r}`}function v(e,t){let n=String(e).match(/^(\d{4})-(\d{2})$/);if(!n)throw Error(`فترة التذكرة غير صالحة.`);let r=Number(t);if(!Number.isFinite(r)||r<1||r>9999)throw Error(`رقم التسلسل الشهري غير صالح.`);return`R-${n[1]}-${n[2]}-${String(Math.floor(r)).padStart(4,`0`)}`}var y,b=e((()=>{y=`Asia/Riyadh`}));async function x(e){let t=String(e?.email||``).trim();if(t||!e?.getIdTokenResult)return t;try{let n=await e.getIdTokenResult();t=String(n.claims?.email||``).trim()}catch{}return t}async function S(e,r,i){let o=_(),c=await x(r);if(!c)throw Error(`تعذر قراءة بريد الحساب. سجّل الخروج ثم ادخل مرة أخرى.`);let l=u(e,`counters`,`ticket-${o}`),d=u(n(e,`tickets`)),{publicId:f}=await a(e,async e=>{let n=await e.get(l),a=n.exists()&&Number(n.data().seq)||0,s=n.exists()?a+1:1,u=v(o,s);return n.exists()?e.update(l,{seq:s}):e.set(l,{seq:s}),e.set(d,{uid:r.uid,email:c,title:i.title,body:i.body,priority:i.priority,status:`open`,publicId:u,ticketPeriod:o,ticketSeq:Math.floor(s),createdAt:t(),updatedAt:t()}),{publicId:u,ticketSeq:s,ticketPeriod:o}});try{await s(n(e,`tickets`,d.id,`messages`),{text:i.body,authorRole:`client`,authorUid:r.uid,authorEmail:c,createdAt:t()})}catch(e){console.warn(`createTicket message`,e)}return{id:d.id,publicId:f}}async function C(e,t){try{let r;try{let a=o(n(e,`tickets`,t,`messages`),c(`createdAt`,`asc`));r=await i(a)}catch{r=await i(n(e,`tickets`,t,`messages`))}let a=r.docs.map(e=>({id:e.id,...e.data()}));return a.sort((e,t)=>(e.createdAt?.toMillis?.()||0)-(t.createdAt?.toMillis?.()||0)),a}catch(e){return console.warn(`fetchTicketMessages`,t,e),[]}}async function w(e,r,i,a,o){let c=String(a||``).trim();if(!c)throw Error(`اكتب نص الرد قبل الإرسال.`);await s(n(e,`tickets`,r,`messages`),{text:c,authorRole:o,authorUid:i.uid,authorEmail:i.email||``,createdAt:t()});let d={updatedAt:t()};o===`admin`?(d.lastReplyBy=`admin`,d.lastReplyAt=t()):(d.lastReplyBy=`client`,d.lastReplyAt=t()),await l(u(e,`tickets`,r),d)}async function T(e,t){let r=o(n(e,`tickets`),d(`uid`,`==`,t)),a=(await i(r)).docs.map(e=>({id:e.id,...e.data()}));return a.sort((e,t)=>{let n=e.updatedAt?.toMillis?.()||e.createdAt?.toMillis?.()||0;return(t.updatedAt?.toMillis?.()||t.createdAt?.toMillis?.()||0)-n}),a}function E(e){return e.createdAt?.toMillis?.()||0}function D(e){return[...e].sort((e,t)=>{let n=E(e),r=E(t);if(r!==n)return r-n;let i=Number(e.ticketSeq)||0;return(Number(t.ticketSeq)||0)-i})}function O(e){return e.lastReplyAt?.toMillis?.()||e.updatedAt?.toMillis?.()||e.createdAt?.toMillis?.()||0}function k(e){let t=e.adminSeenAt?.toMillis?.()||0;return O(e)>t}async function A(e,n){await l(u(e,`tickets`,n),{adminSeenAt:t()})}async function j(e){return D((await i(n(e,`tickets`))).docs.map(e=>({id:e.id,...e.data()})))}async function M(e,t){return t.length?Promise.all(t.map(async t=>{let n=await C(e,t.id);return{...t,messages:n}})):[]}async function N(e,n,r){await l(u(e,`tickets`,n),{status:r,updatedAt:t()})}var P=e((()=>{r(),b()}));function F(e,t){let n=e.length?e:t.body?[{text:t.body,authorRole:`client`,createdAt:t.createdAt}]:[];return n.length?n.map(e=>{let t=e.authorRole===`admin`;return`
        <div class="ticket-msg ${t?`ticket-msg--admin`:`ticket-msg--client`}">
            <div class="ticket-msg__meta">
                <strong>${t?`الدعم · رداد`:`أنت`}</strong>
                <time>${h(m(e.createdAt))}</time>
            </div>
            <p>${h(e.text)}</p>
        </div>`}).join(``):`<p class="muted ticket-thread__empty">لا توجد رسائل بعد.</p>`}function I(e,t={}){let{canManage:n=!1,canReply:r=!1,messages:i=[]}=t,a=n&&k(e),o=a?`<span class="ticket-pill ticket-pill--new" data-ticket-new-badge>جديد</span>`:``,s=n?`<select data-ticket-status data-id="${h(e.id)}" aria-label="حالة التذكرة">
            <option value="open" ${e.status===`open`?`selected`:``}>مفتوحة</option>
            <option value="in_progress" ${e.status===`in_progress`?`selected`:``}>قيد التنفيذ</option>
            <option value="closed" ${e.status===`closed`?`selected`:``}>مغلقة</option>
           </select>`:`<span>${p(e.status)}</span>`,c=r&&e.status!==`closed`?`
        <form class="ticket-reply-form" data-ticket-reply data-ticket-id="${h(e.id)}">
            <label class="sr-only" for="reply-${h(e.id)}">رد على التذكرة ${h(e.publicId||e.id)}</label>
            <textarea id="reply-${h(e.id)}" name="reply" rows="3" placeholder="اكتب ردك هنا… (رقم التذكرة: ${h(e.publicId||e.id)})" required></textarea>
            <button class="btn-secondary" type="submit">إرسال الرد</button>
            <p class="form-message" hidden></p>
        </form>`:e.status===`closed`?`<p class="muted ticket-thread__closed">التذكرة مغلقة — لا يمكن إضافة ردود جديدة.</p>`:``;return`
    <article class="ticket-card${a?` ticket-card--unread`:``}" data-ticket-card="${h(e.id)}">
        <div class="ticket-card__head">
            <strong>${h(e.title)}</strong>
            <span class="ticket-card__badges">
                ${o}
                <span class="ticket-pill ticket-pill--${h(e.priority)}">${g(e.priority)}</span>
            </span>
        </div>
        ${n?`<p class="muted">${h(e.email||``)}</p>`:``}
        <footer class="ticket-card__meta">
            <span class="ticket-id">#${h(e.publicId||e.id)}</span>
            ${s}
            <time>${h(m(e.updatedAt||e.createdAt))}</time>
        </footer>
        <div class="ticket-thread">
            <p class="ticket-thread__title">المحادثة على التذكرة</p>
            ${F(i,e)}
        </div>
        ${c}
    </article>`}var L=e((()=>{P(),f()}));export{j as a,P as c,D as d,N as f,S as i,k as l,I as n,M as o,w as r,T as s,L as t,A as u};