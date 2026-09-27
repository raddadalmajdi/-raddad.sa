import{_ as e,c as t,f as n,g as r,j as i,l as a,m as o,p as s,u as c,v as l,x as u,y as d}from"./init-DsNL47Y1.js";import{a as f,i as p,n as m,r as h,s as g}from"./ui-BVZUMtAZ.js";function _(e){let t=Number(e);if(!Number.isFinite(t)||t<1)throw Error(`رقم التذكرة غير صالح.`);return`R-${String(Math.floor(t)).padStart(6,`0`)}`}var v=i((()=>{}));async function y(e,t,n){let r=d(e,`counters`,`tickets`),i=d(l(e,`tickets`)),{publicId:s}=await o(e,async e=>{let a=await e.get(r),o=(a.exists()&&Number(a.data().seq)||0)+1,s=_(o);return e.set(r,{seq:o},{merge:!0}),e.set(i,{uid:t.uid,email:t.email,title:n.title,body:n.body,priority:n.priority,status:`open`,publicId:s,ticketSeq:o,createdAt:u(),updatedAt:u()}),{publicId:s,ticketSeq:o}});try{await a(l(e,`tickets`,i.id,`messages`),{text:n.body,authorRole:`client`,authorUid:t.uid,authorEmail:t.email,createdAt:u()})}catch(e){console.warn(`createTicket message`,e)}return{id:i.id,publicId:s}}async function b(e,t){try{let r;try{let i=s(l(e,`tickets`,t,`messages`),n(`createdAt`,`asc`));r=await c(i)}catch{r=await c(l(e,`tickets`,t,`messages`))}let i=r.docs.map(e=>({id:e.id,...e.data()}));return i.sort((e,t)=>(e.createdAt?.toMillis?.()||0)-(t.createdAt?.toMillis?.()||0)),i}catch(e){return console.warn(`fetchTicketMessages`,t,e),[]}}async function x(e,t,n,i,o){let s=String(i||``).trim();if(!s)throw Error(`اكتب نص الرد قبل الإرسال.`);await a(l(e,`tickets`,t,`messages`),{text:s,authorRole:o,authorUid:n.uid,authorEmail:n.email||``,createdAt:u()});let c={updatedAt:u()};o===`admin`?(c.lastReplyBy=`admin`,c.lastReplyAt=u()):(c.lastReplyBy=`client`,c.lastReplyAt=u()),await r(d(e,`tickets`,t),c)}async function S(t,n){let r=s(l(t,`tickets`),e(`uid`,`==`,n)),i=(await c(r)).docs.map(e=>({id:e.id,...e.data()}));return i.sort((e,t)=>{let n=e.updatedAt?.toMillis?.()||e.createdAt?.toMillis?.()||0;return(t.updatedAt?.toMillis?.()||t.createdAt?.toMillis?.()||0)-n}),i}async function C(e){let t=(await c(l(e,`tickets`))).docs.map(e=>({id:e.id,...e.data()}));return t.sort((e,t)=>{let n=e.updatedAt?.toMillis?.()||e.createdAt?.toMillis?.()||0;return(t.updatedAt?.toMillis?.()||t.createdAt?.toMillis?.()||0)-n}),t}async function w(e,t){return t.length?Promise.all(t.map(async t=>{let n=await b(e,t.id);return{...t,messages:n}})):[]}async function T(e,t,n){await r(d(e,`tickets`,t),{status:n,updatedAt:u()})}var E=i((()=>{t(),v()}));function D(e,t){let n=e.length?e:t.body?[{text:t.body,authorRole:`client`,createdAt:t.createdAt}]:[];return n.length?n.map(e=>{let t=e.authorRole===`admin`;return`
        <div class="ticket-msg ${t?`ticket-msg--admin`:`ticket-msg--client`}">
            <div class="ticket-msg__meta">
                <strong>${t?`الدعم · رداد`:`أنت`}</strong>
                <time>${m(h(e.createdAt))}</time>
            </div>
            <p>${m(e.text)}</p>
        </div>`}).join(``):`<p class="muted ticket-thread__empty">لا توجد رسائل بعد.</p>`}function O(e,t={}){let{canManage:n=!1,canReply:r=!1,messages:i=[]}=t,a=n?`<select data-ticket-status data-id="${m(e.id)}" aria-label="حالة التذكرة">
            <option value="open" ${e.status===`open`?`selected`:``}>مفتوحة</option>
            <option value="in_progress" ${e.status===`in_progress`?`selected`:``}>قيد التنفيذ</option>
            <option value="closed" ${e.status===`closed`?`selected`:``}>مغلقة</option>
           </select>`:`<span>${g(e.status)}</span>`,o=r&&e.status!==`closed`?`
        <form class="ticket-reply-form" data-ticket-reply data-ticket-id="${m(e.id)}">
            <label class="sr-only" for="reply-${m(e.id)}">رد على التذكرة ${m(e.publicId||e.id)}</label>
            <textarea id="reply-${m(e.id)}" name="reply" rows="3" placeholder="اكتب ردك هنا… (رقم التذكرة: ${m(e.publicId||e.id)})" required></textarea>
            <button class="btn-secondary" type="submit">إرسال الرد</button>
            <p class="form-message" hidden></p>
        </form>`:e.status===`closed`?`<p class="muted ticket-thread__closed">التذكرة مغلقة — لا يمكن إضافة ردود جديدة.</p>`:``;return`
    <article class="ticket-card" data-ticket-card="${m(e.id)}">
        <div class="ticket-card__head">
            <strong>${m(e.title)}</strong>
            <span class="ticket-pill ticket-pill--${m(e.priority)}">${f(e.priority)}</span>
        </div>
        ${n?`<p class="muted">${m(e.email||``)}</p>`:``}
        <footer class="ticket-card__meta">
            <span class="ticket-id">#${m(e.publicId||e.id)}</span>
            ${a}
            <time>${m(h(e.updatedAt||e.createdAt))}</time>
        </footer>
        <div class="ticket-thread">
            <p class="ticket-thread__title">المحادثة على التذكرة</p>
            ${D(i,e)}
        </div>
        ${o}
    </article>`}var k=i((()=>{p()}));export{C as a,E as c,y as i,T as l,O as n,w as o,x as r,S as s,k as t};