import{A as e,_ as t,b as n,c as r,f as i,g as a,h as o,l as s,p as c,u as l,v as u}from"./init-CXMTxBMa.js";import{a as d,i as f,n as p,r as m,s as h}from"./ui-urVsgb-z.js";async function g(e,r,i){let a=`TK-`+Date.now().toString(36).toUpperCase(),o=await s(t(e,`tickets`),{uid:r.uid,email:r.email,title:i.title,body:i.body,priority:i.priority,status:`open`,publicId:a,createdAt:n(),updatedAt:n()});return await s(t(e,`tickets`,o.id,`messages`),{text:i.body,authorRole:`client`,authorUid:r.uid,authorEmail:r.email,createdAt:n()}),{id:o.id,publicId:a}}async function _(e,n){let r=c(t(e,`tickets`,n,`messages`),i(`createdAt`,`asc`));return(await l(r)).docs.map(e=>({id:e.id,...e.data()}))}async function v(e,r,i,a,c){let l=String(a||``).trim();if(!l)throw Error(`اكتب نص الرد قبل الإرسال.`);await s(t(e,`tickets`,r,`messages`),{text:l,authorRole:c,authorUid:i.uid,authorEmail:i.email||``,createdAt:n()});let d={updatedAt:n()};c===`admin`?(d.lastReplyBy=`admin`,d.lastReplyAt=n()):(d.lastReplyBy=`client`,d.lastReplyAt=n()),await o(u(e,`tickets`,r),d)}async function y(e,n){let r=c(t(e,`tickets`),a(`uid`,`==`,n)),i=(await l(r)).docs.map(e=>({id:e.id,...e.data()}));return i.sort((e,t)=>{let n=e.updatedAt?.toMillis?.()||e.createdAt?.toMillis?.()||0;return(t.updatedAt?.toMillis?.()||t.createdAt?.toMillis?.()||0)-n}),i}async function b(e){let n=(await l(t(e,`tickets`))).docs.map(e=>({id:e.id,...e.data()}));return n.sort((e,t)=>{let n=e.updatedAt?.toMillis?.()||e.createdAt?.toMillis?.()||0;return(t.updatedAt?.toMillis?.()||t.createdAt?.toMillis?.()||0)-n}),n}async function x(e,t){return await Promise.all(t.map(async t=>{let n=await _(e,t.id);return{...t,messages:n}}))}async function S(e,t,r){await o(u(e,`tickets`,t),{status:r,updatedAt:n()})}var C=e((()=>{r()}));function w(e,t){let n=e.length?e:t.body?[{text:t.body,authorRole:`client`,createdAt:t.createdAt}]:[];return n.length?n.map(e=>{let t=e.authorRole===`admin`;return`
        <div class="ticket-msg ${t?`ticket-msg--admin`:`ticket-msg--client`}">
            <div class="ticket-msg__meta">
                <strong>${t?`الدعم · رداد`:`أنت`}</strong>
                <time>${p(m(e.createdAt))}</time>
            </div>
            <p>${p(e.text)}</p>
        </div>`}).join(``):`<p class="muted ticket-thread__empty">لا توجد رسائل بعد.</p>`}function T(e,t={}){let{canManage:n=!1,canReply:r=!1,messages:i=[]}=t,a=n?`<select data-ticket-status data-id="${p(e.id)}" aria-label="حالة التذكرة">
            <option value="open" ${e.status===`open`?`selected`:``}>مفتوحة</option>
            <option value="in_progress" ${e.status===`in_progress`?`selected`:``}>قيد التنفيذ</option>
            <option value="closed" ${e.status===`closed`?`selected`:``}>مغلقة</option>
           </select>`:`<span>${h(e.status)}</span>`,o=r&&e.status!==`closed`?`
        <form class="ticket-reply-form" data-ticket-reply data-ticket-id="${p(e.id)}">
            <label class="sr-only" for="reply-${p(e.id)}">رد على التذكرة ${p(e.publicId||e.id)}</label>
            <textarea id="reply-${p(e.id)}" name="reply" rows="3" placeholder="اكتب ردك هنا… (رقم التذكرة: ${p(e.publicId||e.id)})" required></textarea>
            <button class="btn-secondary" type="submit">إرسال الرد</button>
            <p class="form-message" hidden></p>
        </form>`:e.status===`closed`?`<p class="muted ticket-thread__closed">التذكرة مغلقة — لا يمكن إضافة ردود جديدة.</p>`:``;return`
    <article class="ticket-card" data-ticket-card="${p(e.id)}">
        <div class="ticket-card__head">
            <strong>${p(e.title)}</strong>
            <span class="ticket-pill ticket-pill--${p(e.priority)}">${d(e.priority)}</span>
        </div>
        ${n?`<p class="muted">${p(e.email||``)}</p>`:``}
        <footer class="ticket-card__meta">
            <span class="ticket-id">#${p(e.publicId||e.id)}</span>
            ${a}
            <time>${p(m(e.updatedAt||e.createdAt))}</time>
        </footer>
        <div class="ticket-thread">
            <p class="ticket-thread__title">المحادثة على التذكرة</p>
            ${w(i,e)}
        </div>
        ${o}
    </article>`}var E=e((()=>{f()}));export{b as a,C as c,g as i,S as l,T as n,x as o,v as r,y as s,E as t};