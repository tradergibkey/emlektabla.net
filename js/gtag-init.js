/* ================================================================
   Emlektabla.net — Google Ads tag + Consent Mode v2
   Tag ID: AW-18339451265
   ================================================================
   Consent Mode defaults to "denied" (GDPR/EEA).
   The cookie banner in the HTML calls grantConsent() or keeps denied.
   ================================================================ */

/* 1. Consent Mode v2 — defaults BEFORE gtag loads */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'ad_storage':           'denied',
  'ad_user_data':         'denied',
  'ad_personalization':   'denied',
  'analytics_storage':    'denied',
  'wait_for_update':      500
});

/* 2. Check if user already consented in a prior visit */
(function(){
  try {
    var c = localStorage.getItem('cookie_consent');
    if (c === 'granted') {
      gtag('consent', 'update', {
        'ad_storage':         'granted',
        'ad_user_data':       'granted',
        'ad_personalization': 'granted',
        'analytics_storage':  'granted'
      });
    }
  } catch(e){}
})();

/* 3. Load gtag.js asynchronously */
(function(){
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18339451265';
  document.head.appendChild(s);
})();

gtag('js', new Date());
gtag('config', 'AW-18339451265');

/* 4. Global consent functions — called by cookie banner */
window.grantConsent = function(){
  gtag('consent', 'update', {
    'ad_storage':         'granted',
    'ad_user_data':       'granted',
    'ad_personalization': 'granted',
    'analytics_storage':  'granted'
  });
  try { localStorage.setItem('cookie_consent', 'granted'); } catch(e){}
  hideBanner();
};

window.denyConsent = function(){
  try { localStorage.setItem('cookie_consent', 'denied'); } catch(e){}
  hideBanner();
};

function hideBanner(){
  var b = document.getElementById('cookie-banner');
  if (b) b.style.display = 'none';
}

/* 5. Auto-hide banner if already answered */
document.addEventListener('DOMContentLoaded', function(){
  try {
    var c = localStorage.getItem('cookie_consent');
    if (c) hideBanner();
  } catch(e){}
});
