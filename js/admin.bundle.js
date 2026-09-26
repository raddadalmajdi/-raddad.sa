import{A as e,M as t,O as n,T as r,a as i,c as a,i as o,k as s,l as c,n as l,o as u,r as d,s as f,t as p,u as m}from"./chunks/ui-CLlSxiwh.js";import{n as h,r as g}from"./chunks/ideas-BFd3UqDK.js";import{a as _,i as v,n as y}from"./chunks/tickets-BHBQ2Ydm.js";var b=t((()=>{r(),c(),g(),v(),o();function t(e,t,n){if(!t.length){e.innerHTML=`<p class="muted">لا توجد تذاكر.</p>`;return}e.innerHTML=t.map(e=>{let t=n?`<select data-ticket-status data-id="${l(e.id)}" aria-label="حالة التذكرة">
                    <option value="open" ${e.status===`open`?`selected`:``}>مفتوحة</option>
                    <option value="in_progress" ${e.status===`in_progress`?`selected`:``}>قيد التنفيذ</option>
                    <option value="closed" ${e.status===`closed`?`selected`:``}>مغلقة</option>
                   </select>`:`<span>${f(e.status)}</span>`;return`
            <article class="ticket-card">
                <div class="ticket-card__head">
                    <strong>${l(e.title)}</strong>
                    <span class="ticket-pill ticket-pill--${l(e.priority)}">${i(e.priority)}</span>
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
        </article>`).join(``)}async function x(e,n){let[r,i]=await Promise.all([y(e),h(e)]);t(document.querySelector(`[data-admin-tickets]`),r,n),b(document.querySelector(`[data-admin-ideas]`),i),document.querySelector(`[data-stats-tickets]`).textContent=String(r.length),document.querySelector(`[data-stats-ideas]`).textContent=String(i.length),document.querySelector(`[data-stats-open]`).textContent=String(r.filter(e=>e.status!==`closed`).length)}function S(){let t=a(),r=document.querySelector(`[data-admin-login]`),i=document.querySelector(`[data-admin-dashboard]`),o=document.querySelector(`[data-config-status]`),c=document.getElementById(`admin-login-form`),l=document.querySelector(`[data-logout]`);if(!t){o&&(o.textContent=`Firebase غير مهيأ. راجع js/firebase-config.js`,o.className=`status-banner status-banner--warn`);return}let{auth:d,db:f}=t;c?.addEventListener(`submit`,async t=>{t.preventDefault();let n=new FormData(c),r=String(n.get(`email`)||``).trim(),i=String(n.get(`password`)||``);try{if(await s(d,r,i),!m(r)){await e(d),u(c,`هذا الحساب لا يملك صلاحية الأدمن.`,`error`);return}u(c,`تم تسجيل الدخول.`,`success`)}catch(e){u(c,p(e),`error`)}}),n(d,async e=>{let t=e&&m(e.email);if(l&&(l.hidden=!t),!t){r.hidden=!1,i.hidden=!0;return}r.hidden=!0,i.hidden=!1,o&&(o.textContent=`لوحة الأدمن — ${e.email}`,o.className=`status-banner status-banner--ok`),await x(f,!0)}),document.addEventListener(`change`,async e=>{let t=e.target;if(!(t instanceof HTMLSelectElement)||!t.matches(`[data-ticket-status]`))return;let n=t.getAttribute(`data-id`);if(n)try{await _(f,n,t.value),await x(f,!0)}catch(e){alert(e.message||`تعذر تحديث حالة التذكرة.`)}}),l?.addEventListener(`click`,async()=>{await e(d),window.location.reload()})}S()}));export default b();