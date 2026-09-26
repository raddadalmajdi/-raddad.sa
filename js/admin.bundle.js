import{A as e,C as t,D as n,E as r,O as i,a,c as o,i as s,l as c,n as l,o as u,r as d,s as f,t as p,u as m}from"./chunks/ui-DzDLz73E.js";import{n as h,r as g}from"./chunks/ideas-B3QoI6nm.js";import{a as _,i as v,n as y}from"./chunks/tickets-jahSgcDJ.js";var b=e((()=>{t(),c(),g(),v(),s();function e(e,t,n){if(!t.length){e.innerHTML=`<p class="muted">لا توجد تذاكر.</p>`;return}e.innerHTML=t.map(e=>{let t=n?`<select data-ticket-status data-id="${l(e.id)}" aria-label="حالة التذكرة">
                    <option value="open" ${e.status===`open`?`selected`:``}>مفتوحة</option>
                    <option value="in_progress" ${e.status===`in_progress`?`selected`:``}>قيد التنفيذ</option>
                    <option value="closed" ${e.status===`closed`?`selected`:``}>مغلقة</option>
                   </select>`:`<span>${f(e.status)}</span>`;return`
            <article class="ticket-card">
                <div class="ticket-card__head">
                    <strong>${l(e.title)}</strong>
                    <span class="ticket-pill ticket-pill--${l(e.priority)}">${a(e.priority)}</span>
                </div>
                <p class="muted">${l(e.email||``)}</p>
                <p>${l(e.body)}</p>
                <footer>
                    <span>#${l(e.publicId||e.id)}</span>
                    ${t}
                    <time>${l(d(e.createdAt))}</time>
                </footer>
            </article>`}).join(``)}function b(e,t){if(!t.length){e.innerHTML=`<p class="muted">لا توجد طلبات أفكار.</p>`;return}e.innerHTML=t.map(e=>`
        <article class="ticket-card">
            <div class="ticket-card__head">
                <strong>${l(e.app_name||`فكرة تطبيق`)}</strong>
                <span class="ticket-pill ticket-pill--normal">${l(e.platform||`غير محدد`)}</span>
            </div>
            <p class="muted">${l(e.name)} — ${l(e.email)} — ${l(e.phone||``)}</p>
            <p>${l(e.description)}</p>
            <footer>
                <span>الميزانية: ${l(e.budget||`—`)}</span>
                <time>${l(d(e.createdAt))}</time>
            </footer>
        </article>`).join(``)}async function x(t,n){let[r,i]=await Promise.all([y(t),h(t)]);e(document.querySelector(`[data-admin-tickets]`),r,n),b(document.querySelector(`[data-admin-ideas]`),i),document.querySelector(`[data-stats-tickets]`).textContent=String(r.length),document.querySelector(`[data-stats-ideas]`).textContent=String(i.length),document.querySelector(`[data-stats-open]`).textContent=String(r.filter(e=>e.status!==`closed`).length)}function S(){let e=o(),t=document.querySelector(`[data-admin-login]`),a=document.querySelector(`[data-admin-dashboard]`),s=document.querySelector(`[data-config-status]`),c=document.getElementById(`admin-login-form`),l=document.querySelector(`[data-logout]`);if(!e){s&&(s.textContent=`Firebase غير مهيأ. راجع js/firebase-config.js`,s.className=`status-banner status-banner--warn`);return}let{auth:d,db:f}=e;c?.addEventListener(`submit`,async e=>{e.preventDefault();let t=new FormData(c),r=String(t.get(`email`)||``).trim(),a=String(t.get(`password`)||``);try{if(await n(d,r,a),!m(r)){await i(d),u(c,`هذا الحساب لا يملك صلاحية الأدمن.`,`error`);return}u(c,`تم تسجيل الدخول.`,`success`)}catch(e){u(c,p(e),`error`)}}),r(d,async e=>{let n=e&&m(e.email);if(l&&(l.hidden=!n),!n){t.hidden=!1,a.hidden=!0;return}t.hidden=!0,a.hidden=!1,s&&(s.textContent=`لوحة الأدمن — ${e.email}`,s.className=`status-banner status-banner--ok`),await x(f,!0)}),document.addEventListener(`change`,async e=>{let t=e.target;if(!(t instanceof HTMLSelectElement)||!t.matches(`[data-ticket-status]`))return;let n=t.getAttribute(`data-id`);if(n)try{await _(f,n,t.value),await x(f,!0)}catch(e){alert(e.message||`تعذر تحديث حالة التذكرة.`)}}),l?.addEventListener(`click`,async()=>{await i(d),window.location.reload()})}S()}));export default b();