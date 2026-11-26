/* TurkNet Live: browser-only quick navigation. Android WebView is excluded by default. */
(()=>{'use strict';
const ua=navigator.userAgent||'';
if(/Android/i.test(ua)&&/;\s*wv[);]/i.test(ua))return;
if(document.getElementById('tn-site-quicknav'))return;
const style=document.createElement('style');
style.textContent=`
#tn-site-quicknav{position:fixed;z-index:900;bottom:calc(12px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;gap:clamp(3px,1vw,12px);width:max-content;max-width:calc(100% - 24px);padding:8px 12px;border-radius:22px;background:rgba(37,39,44,.89);border:1px solid rgba(255,255,255,.23);box-shadow:0 8px 28px rgba(0,0,0,.22);direction:rtl;font-family:Tahoma,Arial,sans-serif;transition:opacity .2s ease,transform .2s ease;will-change:transform}#tn-site-quicknav.tn-nav-hidden{opacity:0;transform:translate(-50%,calc(100% + 32px));pointer-events:none}
#tn-site-quicknav a{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:clamp(54px,13vw,84px);min-height:48px;padding:5px 8px;color:#fff!important;text-decoration:none!important;border-radius:14px;font-size:clamp(10px,2.5vw,13px);font-weight:700;line-height:1.4;white-space:nowrap}
#tn-site-quicknav a:hover,#tn-site-quicknav a:focus-visible,#tn-site-quicknav a[aria-current=page]{background:rgba(255,255,255,.17);outline-offset:2px}
#tn-site-quicknav .tn-nav-icon{font-size:20px;line-height:1.2;display:block;margin-bottom:2px}
@media(max-width:390px){#tn-site-quicknav{padding:6px 5px;gap:1px}#tn-site-quicknav a{min-width:52px;padding:5px}}
`;
document.head.appendChild(style);
try{const last=sessionStorage.getItem('tn-current-page');if(last&&last!==location.pathname)sessionStorage.setItem('tn-previous-page',last);sessionStorage.setItem('tn-current-page',location.pathname)}catch(e){}
const mount=()=>{
 if(document.getElementById('tn-site-quicknav'))return;
 const nav=document.createElement('nav');nav.id='tn-site-quicknav';nav.setAttribute('aria-label','التنقل السريع في الموقع');
 const items=[['⌂','الرئيسية','/'],['≡','الأسعار','/tariffs.html'],['✦','الخدمات','/support.html'],['☰','المزيد','/about.html'],['↩','رجوع','#tn-back']];
 const current=location.pathname.replace(/\/$/,'')||'/';
 for(const [symbol,label,href] of items){const a=document.createElement('a');a.href=href;if(href==='#tn-back'){a.addEventListener('click',event=>{event.preventDefault();let sameSite=false;try{sameSite=Boolean(document.referrer&&new URL(document.referrer).origin===location.origin)}catch(e){}if(sameSite&&history.length>1){history.back();return}let previous=null;try{previous=sessionStorage.getItem('tn-previous-page')}catch(e){}if(previous&&previous!==location.pathname&&previous.startsWith('/')&&!previous.startsWith('//')){location.assign(previous)}else if(location.pathname!=='/'){location.assign('/')}})}a.setAttribute('aria-label',label);if(current===href)a.setAttribute('aria-current','page');const ico=document.createElement('span');ico.className='tn-nav-icon';ico.setAttribute('aria-hidden','true');ico.textContent=symbol;const t=document.createElement('span');t.textContent=label;a.append(ico,t);nav.appendChild(a)}
 document.body.appendChild(nav);
 document.body.style.paddingBottom='calc(94px + env(safe-area-inset-bottom,0px))';
 // Keep reading content clear: hide navigation on downward scrolling, restore on upward scrolling.
 let lastY=window.scrollY, scheduled=false;
 window.addEventListener('scroll',()=>{
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   const y=window.scrollY, delta=y-lastY;
   if(y<70||y+window.innerHeight>=document.documentElement.scrollHeight-90){nav.classList.remove('tn-nav-hidden')}
   else if(delta>7){nav.classList.add('tn-nav-hidden')}
   else if(delta< -7){nav.classList.remove('tn-nav-hidden')}
   lastY=y;scheduled=false;
  });
 },{passive:true});
 nav.addEventListener('focusin',()=>nav.classList.remove('tn-nav-hidden'));
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();