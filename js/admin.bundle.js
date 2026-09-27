import{A as e,E as t,N as n,a as r,c as i,d as a,i as o,j as s,k as c,l,n as u,o as d,r as f,s as p,t as m,u as h}from"./chunks/ui-suYCZatV.js";import{n as g,r as _}from"./chunks/ideas-c_Okeoym.js";import{a as v,i as y,n as b}from"./chunks/tickets-DerlqSkG.js";var x=n((()=>{t(),l(),_(),y(),o();var n=25e3;function x(e,t,n){return Promise.race([e,new Promise((e,r)=>{setTimeout(()=>r(Error(n)),t)})])}function S(e,t){let n=e?.querySelector(`button[type="submit"]`);n&&(n.disabled=t,n.classList.toggle(`is-loading`,t),n.setAttribute(`aria-busy`,t?`true`:`false`))}function C(e,t,n,r){d(e,n,r);let i=e?.querySelector(`.form-message`);i&&(i.setAttribute(`role`,`alert`),i.scrollIntoView({block:`nearest`})),t&&(t.textContent=n,t.className=r===`error`?`status-banner status-banner--warn`:`status-banner status-banner--ok`)}function w(e,t,n){if(!t.length){e.innerHTML=`<p class="muted">لا توجد تذاكر.</p>`;return}e.innerHTML=t.map(e=>{let t=n?`<select data-ticket-status data-id="${u(e.id)}" aria-label="حالة التذكرة">
                    <option value="open" ${e.status===`open`?`selected`:``}>مفتوحة</option>
                    <option value="in_progress" ${e.status===`in_progress`?`selected`:``}>قيد التنفيذ</option>
                    <option value="closed" ${e.status===`closed`?`selected`:``}>مغلقة</option>
                   </select>`:`<span>${p(e.status)}</span>`;return`
            <article class="ticket-card">
                <div class="ticket-card__head">
                    <strong>${u(e.title)}</strong>
                    <span class="ticket-pill ticket-pill--${u(e.priority)}">${r(e.priority)}</span>
                </div>
                <p class="muted">${u(e.email||``)}</p>
                <p>${u(e.body)}</p>
                <footer>
                    <span>#${u(e.publicId||e.id)}</span>
                    ${t}
                    <time>${u(f(e.createdAt))}</time>
                </footer>
            </article>`}).join(``)}function T(e,t){if(!t.length){e.innerHTML=`<p class="muted">لا توجد طلبات أفكار.</p>`;return}e.innerHTML=t.map(e=>`
        <article class="ticket-card">
            <div class="ticket-card__head">
                <strong>${u(e.app_name||`فكرة تطبيق`)}</strong>
                <span class="ticket-pill ticket-pill--normal">${u(e.platform||`غير محدد`)}</span>
            </div>
            <p class="muted">${u(e.name)} — ${u(e.email)} — ${u(e.phone||``)}</p>
            <p>${u(e.description)}</p>
            <footer>
                <span>الميزانية: ${u(e.budget||`—`)}</span>
                <time>${u(f(e.createdAt))}</time>
            </footer>
        </article>`).join(``)}async function E(e,t){let[n,r]=await Promise.all([b(e),g(e)]);w(document.querySelector(`[data-admin-tickets]`),n,t),T(document.querySelector(`[data-admin-ideas]`),r),document.querySelector(`[data-stats-tickets]`).textContent=String(n.length),document.querySelector(`[data-stats-ideas]`).textContent=String(r.length),document.querySelector(`[data-stats-open]`).textContent=String(n.filter(e=>e.status!==`closed`).length)}async function D(){let t=i(),r=document.querySelector(`[data-admin-login]`),o=document.querySelector(`[data-admin-dashboard]`),l=document.querySelector(`[data-config-status]`),u=document.getElementById(`admin-login-form`),d=document.querySelector(`[data-logout]`),f=document.querySelector(`[data-admin-welcome]`);if(!t){l&&(l.textContent=`Firebase غير مهيأ. راجع js/firebase-config.js`,l.className=`status-banner status-banner--warn`);return}let{auth:p,db:g}=t;try{await a(p)}catch(e){console.warn(`Auth persistence`,e)}l&&(l.textContent=`جاهز — أدخل كلمة المرور ثم اضغط دخول`,l.className=`status-banner status-banner--ok`),u?.addEventListener(`submit`,async t=>{t.preventDefault();let r=new FormData(u),i=String(r.get(`email`)||``).trim().toLowerCase(),a=String(r.get(`password`)||``);if(!a){C(u,l,`أدخل كلمة المرور.`,`error`);return}if(!h(i)){C(u,l,`هذا البريد غير مصرّح كأدمن. استخدم raddad@raddad.sa.`,`error`);return}S(u,!0),l&&(l.textContent=`جاري التحقق من الحساب…`,l.className=`status-banner status-banner--ok`);try{let t=(await x(e(p,i,a),n,`انتهت مهلة الاتصال. تحقق من الإنترنت أو أعد المحاولة.`)).user?.email||i;if(!h(t)){await s(p),C(u,l,`هذا الحساب لا يملك صلاحية الأدمن.`,`error`);return}C(u,l,`تم الدخول بنجاح — جاري فتح اللوحة…`,`success`)}catch(e){let t=e&&e.message&&!e.code?e.message:m(e);C(u,l,t,`error`)}finally{S(u,!1)}}),c(p,e=>{if(!(e&&h(e.email))){r.hidden=!1,o.hidden=!0,l&&!e&&(l.textContent=`جاهز — أدخل كلمة المرور ثم اضغط دخول`,l.className=`status-banner status-banner--ok`),e&&!h(e.email)&&C(u,l,`أنت مسجّل بحساب عميل. سجّل الخروج من لوحة العميل أو استخدم raddad@raddad.sa هنا.`,`error`);return}r.hidden=!0,o.hidden=!1,f&&(f.textContent=`مرحبًا، ${e.email}`),l&&(l.textContent=`تم الدخول — جاري تحميل البيانات…`,l.className=`status-banner status-banner--ok`),E(g,!0).then(()=>{l&&(l.textContent=`لوحة الأدمن — ${e.email}`,l.className=`status-banner status-banner--ok`)}).catch(e=>{l&&(l.textContent=`تم الدخول لكن تعذر تحميل البيانات. تأكد من Firestore ونطاق raddad.sa في Firebase.`,l.className=`status-banner status-banner--warn`),console.error(e)})}),document.addEventListener(`change`,async e=>{let t=e.target;if(!(t instanceof HTMLSelectElement)||!t.matches(`[data-ticket-status]`))return;let n=t.getAttribute(`data-id`);if(n)try{await v(g,n,t.value),await E(g,!0)}catch(e){alert(e.message||`تعذر تحديث حالة التذكرة.`)}}),d?.addEventListener(`click`,async()=>{await s(p),window.location.reload()})}D().catch(e=>{console.error(e);let t=document.querySelector(`[data-config-status]`);t&&(t.textContent=`تعذر تهيئة لوحة الأدمن. جرّب Chrome أو حدّث Safari.`,t.className=`status-banner status-banner--warn`)})}));export default x();