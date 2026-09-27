import{A as e,M as t,O as n,T as r,a as i,c as a,i as o,k as s,l as c,n as l,o as u,r as d,s as f,t as p,u as m}from"./chunks/ui-DR22I8bK.js";import{n as h,r as g}from"./chunks/ideas-PbIhy6wz.js";import{a as _,i as v,n as y}from"./chunks/tickets-DhuAG3t6.js";var b=t((()=>{r(),c(),g(),v(),o();var t=25e3;function b(e,t,n){return Promise.race([e,new Promise((e,r)=>{setTimeout(()=>r(Error(n)),t)})])}function x(e,t){let n=e?.querySelector(`button[type="submit"]`);n&&(n.disabled=t,n.classList.toggle(`is-loading`,t),n.setAttribute(`aria-busy`,t?`true`:`false`))}function S(e,t,n,r){u(e,n,r);let i=e?.querySelector(`.form-message`);i&&(i.setAttribute(`role`,`alert`),i.scrollIntoView({behavior:`smooth`,block:`nearest`})),t&&(t.textContent=n,t.className=r===`error`?`status-banner status-banner--warn`:`status-banner status-banner--ok`)}function C(e,t,n){if(!t.length){e.innerHTML=`<p class="muted">لا توجد تذاكر.</p>`;return}e.innerHTML=t.map(e=>{let t=n?`<select data-ticket-status data-id="${l(e.id)}" aria-label="حالة التذكرة">
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
            </article>`}).join(``)}function w(e,t){if(!t.length){e.innerHTML=`<p class="muted">لا توجد طلبات أفكار.</p>`;return}e.innerHTML=t.map(e=>`
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
        </article>`).join(``)}async function T(e,t){let[n,r]=await Promise.all([y(e),h(e)]);C(document.querySelector(`[data-admin-tickets]`),n,t),w(document.querySelector(`[data-admin-ideas]`),r),document.querySelector(`[data-stats-tickets]`).textContent=String(n.length),document.querySelector(`[data-stats-ideas]`).textContent=String(r.length),document.querySelector(`[data-stats-open]`).textContent=String(n.filter(e=>e.status!==`closed`).length)}function E(){let r=a(),i=document.querySelector(`[data-admin-login]`),o=document.querySelector(`[data-admin-dashboard]`),c=document.querySelector(`[data-config-status]`),l=document.getElementById(`admin-login-form`),u=document.querySelector(`[data-logout]`),d=document.querySelector(`[data-admin-welcome]`);if(!r){c&&(c.textContent=`Firebase غير مهيأ. راجع js/firebase-config.js`,c.className=`status-banner status-banner--warn`);return}let{auth:f,db:h}=r;c&&(c.textContent=`جاهز — أدخل كلمة المرور ثم اضغط دخول`,c.className=`status-banner status-banner--ok`),l?.addEventListener(`submit`,async n=>{n.preventDefault();let r=new FormData(l),i=String(r.get(`email`)||``).trim().toLowerCase(),a=String(r.get(`password`)||``);if(!a){S(l,c,`أدخل كلمة المرور.`,`error`);return}if(!m(i)){S(l,c,`هذا البريد غير مصرّح كأدمن. استخدم raddad@raddad.sa.`,`error`);return}x(l,!0),c&&(c.textContent=`جاري التحقق من الحساب…`,c.className=`status-banner status-banner--ok`);try{let n=(await b(s(f,i,a),t,`انتهت مهلة الاتصال. تحقق من الإنترنت أو أعد المحاولة.`)).user?.email||i;if(!m(n)){await e(f),S(l,c,`هذا الحساب لا يملك صلاحية الأدمن.`,`error`);return}S(l,c,`تم الدخول بنجاح — جاري فتح اللوحة…`,`success`)}catch(e){let t=e&&e.message&&!e.code?e.message:p(e);S(l,c,t,`error`)}finally{x(l,!1)}}),n(f,e=>{if(!(e&&m(e.email))){i.hidden=!1,o.hidden=!0,c&&!e&&(c.textContent=`جاهز — أدخل كلمة المرور ثم اضغط دخول`,c.className=`status-banner status-banner--ok`),e&&!m(e.email)&&S(l,c,`أنت مسجّل بحساب عميل. سجّل الخروج من لوحة العميل أو استخدم raddad@raddad.sa هنا.`,`error`);return}i.hidden=!0,o.hidden=!1,d&&(d.textContent=`مرحبًا، ${e.email}`),c&&(c.textContent=`تم الدخول — جاري تحميل البيانات…`,c.className=`status-banner status-banner--ok`),T(h,!0).then(()=>{c&&(c.textContent=`لوحة الأدمن — ${e.email}`,c.className=`status-banner status-banner--ok`)}).catch(e=>{c&&(c.textContent=`تم الدخول لكن تعذر تحميل البيانات. تأكد من Firestore ونطاق raddad.sa في Firebase.`,c.className=`status-banner status-banner--warn`),console.error(e)})}),document.addEventListener(`change`,async e=>{let t=e.target;if(!(t instanceof HTMLSelectElement)||!t.matches(`[data-ticket-status]`))return;let n=t.getAttribute(`data-id`);if(n)try{await _(h,n,t.value),await T(h,!0)}catch(e){alert(e.message||`تعذر تحديث حالة التذكرة.`)}}),u?.addEventListener(`click`,async()=>{await e(f),window.location.reload()})}E()}));export default b();