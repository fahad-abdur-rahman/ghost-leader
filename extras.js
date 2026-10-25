/* extras.js — language switch (EN / বাংলা), back-to-top button, hero typing line, background warm-up.
   Plain script (no modules). Loaded at the end of <body> on every public page.
   Edit the Bangla text in the DICT section below. Admin-written text that is not in DICT stays as written. */
(function () {
  'use strict';
  var root = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LANG = get('fa-lang') === 'bn' ? 'bn' : 'en';

  /* ================= Islamic geometric pattern (8-pointed star), kept very light ================= */
  function geoSvg(c) {
    return "<svg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84' fill='none' stroke='" + c + "' stroke-width='1.1'>" +
      "<rect x='17' y='17' width='50' height='50'/><path d='M42 6.6L77.4 42L42 77.4L6.6 42Z'/><circle cx='42' cy='42' r='6'/>" +
      "<circle cx='0' cy='0' r='2.5'/><circle cx='84' cy='0' r='2.5'/><circle cx='0' cy='84' r='2.5'/><circle cx='84' cy='84' r='2.5'/></svg>";
  }
  var GEO_G = 'data:image/svg+xml,' + encodeURIComponent(geoSvg('#287A50'));
  var GRAIN = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>");
  var GEO_L = 'data:image/svg+xml,' + encodeURIComponent(geoSvg('#7FDDB0'));

  /* ================= styles ================= */
  var css = [
    '.fa-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    '.langbtn{font:700 .78rem/1 "Plus Jakarta Sans","Hind Siliguri",system-ui,sans-serif;letter-spacing:0;cursor:pointer;color:var(--text)}',
    /* Islamic touch: pattern, greeting, guiding thought */
    '.geo{position:absolute;inset:0;pointer-events:none;background-image:url("' + GEO_G + '");background-size:84px 84px;opacity:.1;-webkit-mask-image:radial-gradient(ellipse 80% 75% at 50% 35%,#000 15%,transparent 78%);mask-image:radial-gradient(ellipse 80% 75% at 50% 35%,#000 15%,transparent 78%)}',
    'html[data-theme="dark"] .geo{background-image:url("' + GEO_L + '");opacity:.11}',
    '.geo.dk{background-image:url("' + GEO_L + '")!important;opacity:.09;z-index:0}',
    '.band>.geo,.contact>.geo{position:absolute}',
    '.aurora.has-geo::before{display:none}',
    '.salam{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:.84rem;font-weight:600;color:var(--green-text);margin:0 0 14px}',
    '.salam-ar{font-family:"Amiri","Noto Naskh Arabic","Scheherazade New",serif;font-size:1.3rem;line-height:1.2;font-weight:700}',
    '.salam .dot{font-size:.55rem;color:var(--green)}',
    '.aq{position:relative;overflow:hidden;margin:0 auto;max-width:720px;padding:40px 24px 34px;text-align:center;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius,22px);box-shadow:var(--shadow)}',
    '.aq>*{position:relative;z-index:1}',
    '.aq>.geo{position:absolute;z-index:0;opacity:.1}',
    '.aq .orn{display:flex;align-items:center;justify-content:center;gap:14px;color:var(--green-text);margin-bottom:12px;font-size:.9rem}',
    '.aq .orn i{flex:0 1 90px;height:1px;background:linear-gradient(90deg,transparent,var(--green))}',
    '.aq .orn i:last-child{background:linear-gradient(270deg,transparent,var(--green))}',
    '.aq-ar{margin:10px 0 6px;font-family:"Amiri","Noto Naskh Arabic","Scheherazade New",serif;font-size:clamp(1.5rem,5.6vw,2.2rem);line-height:2;font-weight:700;color:var(--text)}',
    '.aq-tr{max-width:560px;margin:6px auto 0;color:var(--muted);font-size:1.02rem}',
    '.aq figcaption{margin-top:12px;font-size:.8rem;font-weight:600;letter-spacing:.04em;color:var(--green-text)}',
    /* PREMIUM layer */
    '::selection{background:color-mix(in srgb,var(--green) 28%,transparent);color:inherit}',
    'html{scrollbar-color:color-mix(in srgb,var(--green) 55%,transparent) transparent;scrollbar-width:thin}',
    'body::after{content:"";position:fixed;inset:0;z-index:2147483000;pointer-events:none;opacity:.035;background-image:url("' + GRAIN + '");background-size:160px 160px}',
    'html[data-theme="dark"] body::after{opacity:.05}',
    'header nav{transition:box-shadow .35s,background .35s,border-color .35s,transform .45s cubic-bezier(.2,.8,.2,1)}',
    'html.fa-scrolled header nav{box-shadow:0 1px 2px rgba(28,30,31,.06),0 14px 40px rgba(28,30,31,.14);border-color:color-mix(in srgb,var(--green) 22%,var(--border))}',
    '.card{position:relative;transition:transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s,border-color .35s}',
    '.card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%),color-mix(in srgb,var(--green-2) 20%,transparent),transparent 62%)}',
    '@media(hover:hover){.card:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--green) 40%,var(--border));box-shadow:var(--shadow-lg,var(--shadow))}.card:hover::before{opacity:1}}',
    '.card.fa-glow::before{opacity:1}',
    '.btn.primary{position:relative;overflow:hidden;isolation:isolate}',
    '.btn.primary::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;z-index:-1;background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transform:skewX(-20deg);transition:left .7s cubic-bezier(.2,.8,.2,1)}',
    '@media(hover:hover){.btn.primary:hover::after{left:130%}}',
    '.btn:active,.ibtn:active,.chip:active,.filter:active{transform:scale(.97)}',
    '.eyebrow{background:linear-gradient(90deg,var(--green-text),var(--green-2));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
    '.photo{position:relative}',
    'img{-webkit-user-drag:none}',
    '@media(prefers-reduced-motion:reduce){.card,.card:hover{transform:none!important}.btn.primary::after{display:none}}',
    /* FX layer: premium motion */
    '@keyframes faIn{from{opacity:0}to{opacity:1}}',
    'body{animation:faIn .6s ease both}',
    '.reveal{filter:blur(5px)}',
    '.reveal.show{filter:none}',
    '.stats .stat:nth-child(2){--d:.08s}.stats .stat:nth-child(3){--d:.16s}.stats .stat:nth-child(4){--d:.24s}',
    '#hero-title span{background:linear-gradient(100deg,var(--green-text) 20%,var(--green-2) 45%,#9BE8C2 55%,var(--green-text) 80%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:faShine 6s ease-in-out 1.2s infinite}',
    '@keyframes faShine{0%,55%{background-position:100% 0}100%{background-position:-60% 0}}',
    '.fa-spot{position:fixed;left:0;top:0;width:520px;height:520px;margin:-260px 0 0 -260px;z-index:0;pointer-events:none;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--green-2) 13%,transparent),transparent 65%);opacity:0;transition:opacity .4s;will-change:transform}',
    '.fa-spot.on{opacity:1}',
    '.photo{transition:transform .25s ease-out;will-change:transform;transform-style:preserve-3d}',
    '.aurora .blob{will-change:transform}',
    '.fa-mag{transition:transform .25s cubic-bezier(.2,.8,.2,1)}',
    '@media(prefers-reduced-motion:reduce){body{animation:none}.reveal{filter:none}#hero-title span{animation:none;-webkit-text-fill-color:currentColor;background:none;color:var(--green-text)}.fa-spot{display:none}}',
    /* notice bar */
    '.notice{position:relative;z-index:60;display:flex;align-items:center;gap:12px;padding:9px 46px 9px 0;overflow:hidden;background:var(--green);color:#fff;font-size:.86rem;font-weight:500;line-height:1.45;text-align:center}',
    '.notice .nt{flex:1;overflow:hidden;white-space:nowrap;-webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)}',
    '.notice .nm{display:inline-flex;align-items:center;will-change:transform;animation:faMarq var(--dur,18s) linear infinite}',
    '.notice .nm>span{display:inline-flex;align-items:center;gap:12px;padding-right:56px}',
    '.notice:hover .nm,.notice:active .nm{animation-play-state:paused}',
    '@keyframes faMarq{to{transform:translateX(-50%)}}',
    '@media(prefers-reduced-motion:reduce){.notice .nm{animation:none}.notice .nm>span+span{display:none}.notice .nt{overflow:auto;white-space:normal;text-align:center}}',
    '.notice a{color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:3px;white-space:nowrap}',
    '.notice button{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:0;border-radius:8px;background:transparent;color:#fff;font-size:1.2rem;line-height:1;cursor:pointer}',
    '.notice button:hover{background:rgba(255,255,255,.18)}',
    /* back to top */
    '.totop{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));width:48px;height:48px;border-radius:16px;border:1px solid var(--border);background:var(--surface);color:var(--green-text);box-shadow:var(--shadow-lg,0 10px 30px rgba(0,0,0,.15));display:grid;place-items:center;cursor:pointer;z-index:55;opacity:0;visibility:hidden;transform:translateY(14px) scale(.9);transition:opacity .3s,transform .3s cubic-bezier(.2,.8,.2,1),visibility .3s}',
    '.totop.show{opacity:1;visibility:visible;transform:none}',
    '.totop:hover{transform:translateY(-3px)}',
    '.totop svg{grid-area:1/1}',
    '.totop .ring{width:48px;height:48px;transform:rotate(-90deg)}',
    '.totop .rt,.totop .rp{fill:none;stroke-width:2.5}',
    '.totop .rt{stroke:var(--border)}',
    '.totop .rp{stroke:var(--green);stroke-linecap:round;transition:stroke-dashoffset .1s linear}',
    '.totop .ar{width:20px;height:20px}',
    /* typing line */
    '.typed{font-family:"Plus Jakarta Sans","Inter",sans-serif;font-weight:600;font-size:1.02rem;color:var(--green-text);min-height:1.9em;margin:-2px 0 10px;display:flex;align-items:center;flex-wrap:wrap}',
    '.typed .tc{display:inline-block;width:2px;height:1.2em;margin-left:3px;background:var(--green-text);animation:faBlink 1s steps(1) infinite}',
    '@keyframes faBlink{50%{opacity:0}}',
    /* Bangla typography: Bengali glyph font, no negative letter-spacing (it breaks conjuncts) */
    'html[lang="bn"] body,html[lang="bn"] :is(h1,h2,h3,h4,.logo,.btn,.filter,.dl,.dr-h,.eyebrow,.stat b,.stat span,.chip,.typed,.motto,button,input,textarea,.in-tag,.in-role){font-family:"Hind Siliguri","Inter",system-ui,sans-serif}',
    'html[lang="bn"] *{letter-spacing:normal!important}',
    'html[lang="bn"] body{line-height:1.8}',
    'html[lang="bn"] :is(h1,h2,h3){line-height:1.3}',
    'html[lang="bn"] .motto{font-size:1.35rem;font-weight:600}',
    '@media(prefers-reduced-motion:reduce){.totop{transition:opacity .2s}.typed .tc{animation:none;opacity:0}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'fa-extras-css'; st.textContent = css; document.head.appendChild(st);

  /* ================= DICT (English -> বাংলা) ================= */
  var D = {
    /* navigation & shared */
    'Skip to main content': 'মূল অংশে যান',
    'Home': 'হোম', 'About': 'পরিচিতি', 'Education': 'শিক্ষা', 'Skills': 'দক্ষতা',
    'Quote of the Day': 'আজকের উক্তি', '↻ Another quote': '↻ আরেকটি উক্তি', 'Ghost Leader': 'Ghost Leader',
    'Lite mode: On': 'লাইট মোড: চালু', 'Lite mode: Off': 'লাইট মোড: বন্ধ',
    'Blog': 'ব্লগ', 'Articles & Updates': 'লেখা ও আপডেট', 'Thoughts, stories and updates from my journey as a youth leader and founder.': 'যুব নেতা ও প্রতিষ্ঠাতা হিসেবে আমার পথচলার ভাবনা, গল্প ও আপডেট।', 'Read more →': 'আরও পড়ুন →', '← All posts': '← সব লেখা', 'No posts yet. Please check back soon.': 'এখনো কোনো লেখা নেই। শীঘ্রই আবার দেখুন।', 'Loading posts…': 'লেখা লোড হচ্ছে…', 'Post not found': 'লেখাটি পাওয়া যায়নি', 'Back to all posts': 'সব লেখায় ফিরে যান',
    'Organizations': 'সংগঠনসমূহ', 'Organisations': 'সংগঠনসমূহ',
    'All organizations': 'সব সংগঠন', 'All organisations': 'সব সংগঠন', 'All Organizations': 'সব সংগঠন',
    'Other organizations': 'অন্যান্য সংগঠন',
    'Projects': 'প্রকল্প', 'Achievements': 'অর্জন', 'Contact': 'যোগাযোগ',
    'Explore': 'ঘুরে দেখুন', 'Connect': 'সংযোগ', 'Email': 'ইমেইল',
    'Youth Leader & Founder — Ideas into Impact.': 'যুব নেতা ও প্রতিষ্ঠাতা — ভাবনা থেকে প্রভাব।',
    'Better Youth, Better Tomorrow': 'উন্নত যুবসমাজ · উন্নত আগামী', 'Better Youth · Better Tomorrow': 'উন্নত যুবসমাজ · উন্নত আগামী',
    'Ideas into Impact.': 'ভাবনা থেকে প্রভাব।',
    'Youth Leader · Founder · Chairman': 'যুব নেতা · প্রতিষ্ঠাতা · চেয়ারম্যান',
    'Fahad Abdur Rahman': 'ফাহাদ আব্দুর রহমান',
    'Fahad Abdur': 'ফাহাদ আব্দুর', 'Rahman': 'রহমান',
    'Fahad Abdur Rahman. All rights reserved.': 'ফাহাদ আব্দুর রহমান। সর্বস্বত্ব সংরক্ষিত।',
    'Back to top': 'উপরে ফিরে যান',
    'Assalamu Alaikum · Welcome': 'আসসালামু আলাইকুম · স্বাগতম',
    'A Guiding Thought': 'একটি পথনির্দেশক ভাবনা',
    '“Indeed, Allah will not change the condition of a people until they change what is in themselves.”': '“নিশ্চয়ই আল্লাহ কোনো জাতির অবস্থা পরিবর্তন করেন না, যতক্ষণ না তারা নিজেরা নিজেদের অবস্থা পরিবর্তন করে।”',
    'Surah Ar-Ra’d · 13:11': 'সূরা আর-রা’দ · ১৩:১১',

    /* hero */
    'Founder & Chairman · Youth Leader': 'প্রতিষ্ঠাতা ও চেয়ারম্যান · যুব নেতা',
    'I am a youth leader, organization builder, and passionate about creating opportunities for the next generation.': 'আমি একজন যুব নেতা ও সংগঠক, আর আগামী প্রজন্মের জন্য সুযোগ তৈরির কাজে নিবেদিত।',
    'Explore My Journey': 'আমার পথচলা দেখুন',
    'Contact Me': 'যোগাযোগ করুন',
    'Founder & Chairman': 'প্রতিষ্ঠাতা ও চেয়ারম্যান',
    'Youth Leader': 'যুব নেতা',
    'Better': 'উন্নত', 'Youth,': 'যুবসমাজ,', 'Tomorrow': 'আগামী',
    '(Founder & Chairman)': '(প্রতিষ্ঠাতা ও চেয়ারম্যান)',
    'Years of': 'বছরের', 'Leadership Experience': 'নেতৃত্বের অভিজ্ঞতা',
    '& Initiatives': 'ও উদ্যোগ',
    'Commitment': 'অঙ্গীকার', 'to Youth Development': 'যুব উন্নয়নে',
    'Organizations (Founder & Chairman)': 'সংগঠন (প্রতিষ্ঠাতা ও চেয়ারম্যান)',
    'Years of Leadership Experience': 'বছরের নেতৃত্বের অভিজ্ঞতা',
    'Projects & Initiatives': 'প্রকল্প ও উদ্যোগ',
    'Commitment to Youth Development': 'যুব উন্নয়নে অঙ্গীকার',
    'Leadership': 'নেতৃত্ব', 'Collaboration': 'সহযোগিতা', 'Innovation': 'উদ্ভাবন',
    'Youth Development': 'যুব উন্নয়ন', 'Opportunity': 'সুযোগ',

    /* sections */
    'My Organizations': 'আমার সংগঠনসমূহ',
    'Building People · Creating Opportunities · Shaping the Future': 'মানুষ গড়ি · সুযোগ তৈরি করি · ভবিষ্যৎ গড়ি',
    'Where Talent Meets Opportunity': 'যেখানে প্রতিভা পায় সুযোগ',
    'Learn · Connect · Grow': 'শিখুন · যুক্ত হোন · এগিয়ে যান',
    'Where Vision Meets Action': 'যেখানে স্বপ্ন মেলে বাস্তব কাজে',
    'About Me': 'আমার সম্পর্কে',
    'Fahad Abdur Rahman is a passionate youth leader, organization builder, and a firm believer in the power of education, collaboration, and innovation.': 'ফাহাদ আব্দুর রহমান একজন নিবেদিত যুব নেতা ও সংগঠক। শিক্ষা, সহযোগিতা ও উদ্ভাবনের শক্তিতে তাঁর দৃঢ় বিশ্বাস।',
    'He builds platforms and communities where young people can learn, connect, and turn their ideas into real impact.': 'তিনি এমন প্ল্যাটফর্ম ও কমিউনিটি গড়েন, যেখানে তরুণরা শিখতে, যুক্ত হতে এবং নিজেদের ভাবনাকে বাস্তব প্রভাবে রূপ দিতে পারে।',
    'Learn More': 'আরও জানুন',
    'Skills & Expertise': 'দক্ষতা ও অভিজ্ঞতা',
    'Communication': 'যোগাযোগ দক্ষতা', 'Content Creation': 'কনটেন্ট তৈরি', 'Web Design': 'ওয়েব ডিজাইন',
    'Event Management': 'ইভেন্ট ব্যবস্থাপনা', 'Problem Solving': 'সমস্যা সমাধান',
    'YEAR – YEAR': 'সাল – সাল', 'YEAR': 'সাল',
    'Institution name': 'প্রতিষ্ঠানের নাম', 'Previous institution': 'পূর্ববর্তী প্রতিষ্ঠান',
    'Your class / degree / group. Edit this line.': 'আপনার শ্রেণি / ডিগ্রি / বিভাগ। এই লাইনটি বদলে নিন।',
    'Short note about what you studied or achieved.': 'কী পড়েছেন বা কী অর্জন করেছেন, তার সংক্ষিপ্ত বিবরণ।',
    'Achievement title': 'অর্জনের শিরোনাম', 'Another milestone': 'আরেকটি মাইলফলক',
    'One line about what it was and why it mattered.': 'এটি কী ছিল এবং কেন গুরুত্বপূর্ণ, তা এক লাইনে লিখুন।',
    'Award, recognition, or a project you led.': 'পুরস্কার, স্বীকৃতি বা আপনার নেতৃত্বে করা কোনো প্রকল্প।',
    'Latest Projects': 'সাম্প্রতিক প্রকল্প',
    'All': 'সব', 'Organization': 'সংগঠন', 'Website': 'ওয়েবসাইট', 'Event': 'ইভেন্ট', 'Other': 'অন্যান্য',
    'Sample entry': 'নমুনা এন্ট্রি',
    'Web Development': 'ওয়েব ডেভেলপমেন্ট',
    'Website · Web Development': 'ওয়েবসাইট · ওয়েব ডেভেলপমেন্ট',
    'Organization · Founder & Chairman': 'সংগঠন · প্রতিষ্ঠাতা ও চেয়ারম্যান',
    'No projects in this category yet.': 'এই ক্যাটাগরিতে এখনো কোনো প্রকল্প নেই।',
    "Let's Work Together": 'চলুন একসাথে কাজ করি',
    'Have a project, collaboration or just want to say hello? Feel free to reach out!': 'কোনো প্রকল্প, সহযোগিতা বা শুধু কথা বলতে চান? নির্দ্বিধায় যোগাযোগ করুন!',
    'Send Message': 'মেসেজ পাঠান',
    'Joypurhat, Bangladesh': 'জয়পুরহাট, বাংলাদেশ',

    /* about page */
    '/ About': '/ পরিচিতি',
    'About Fahad Abdur Rahman': 'ফাহাদ আব্দুর রহমান সম্পর্কে',
    'Youth Leader · Founder & Chairman': 'যুব নেতা · প্রতিষ্ঠাতা ও চেয়ারম্যান',
    'Youth leader, organization builder and founder & chairman from Joypurhat, Bangladesh.': 'যুব নেতা, সংগঠক এবং প্রতিষ্ঠাতা ও চেয়ারম্যান — জয়পুরহাট, বাংলাদেশ।',
    'Get in Touch': 'যোগাযোগ করুন',
    'Biography': 'জীবনী', 'Who I am': 'আমি কে', 'At a glance': 'এক নজরে', 'In numbers': 'সংখ্যায়',
    'What I have built': 'যা গড়েছি',
    "Let's work together": 'চলুন একসাথে কাজ করি',
    'Have a project, collaboration or just want to say hello?': 'কোনো প্রকল্প, সহযোগিতা বা শুধু কথা বলতে চান?',

    /* contact page */
    '/ Contact': '/ যোগাযোগ',
    'Get in touch': 'যোগাযোগ করুন',
    'Have a project, collaboration or just want to say hello? Send a message below and I will get back to you.': 'কোনো প্রকল্প, সহযোগিতা বা শুধু কথা বলতে চান? নিচে মেসেজ পাঠান, আমি উত্তর দেব।',
    'Send a message': 'মেসেজ পাঠান',
    'Your name': 'আপনার নাম', 'Your email': 'আপনার ইমেইল', 'Message': 'মেসেজ',
    'Other ways to reach me': 'আমার সাথে যোগাযোগের অন্য উপায়',
    'Location': 'অবস্থান', 'Follow': 'অনুসরণ করুন', 'Email me directly': 'সরাসরি ইমেইল করুন',
    'Thank you! Your message has been sent.': 'ধন্যবাদ! আপনার মেসেজ পাঠানো হয়েছে।',
    'Please enter your name.': 'আপনার নাম লিখুন।',
    'Please enter a valid email address.': 'সঠিক ইমেইল ঠিকানা দিন।',
    'Please write a few more words (at least 10 characters).': 'আরও কিছু লিখুন (কমপক্ষে ১০ অক্ষর)।',
    'Please wait a minute before sending another message.': 'আরেকটি মেসেজ পাঠানোর আগে এক মিনিট অপেক্ষা করুন।',
    'Sending…': 'পাঠানো হচ্ছে…',
    'The form is not available right now.': 'ফর্মটি এখন কাজ করছে না।',
    'Sorry, your message could not be sent.': 'দুঃখিত, মেসেজটি পাঠানো যায়নি।',

    /* organization pages */
    'Founded by Fahad Abdur Rahman': 'প্রতিষ্ঠাতা: ফাহাদ আব্দুর রহমান',
    'Visit website': 'ওয়েবসাইট দেখুন',
    'Focus': 'মূল লক্ষ্য', 'What it stands for': 'যে আদর্শে এগোয়',
    'Youth leader and organization builder from Joypurhat, Bangladesh.': 'যুব নেতা ও সংগঠক — জয়পুরহাট, বাংলাদেশ।',
    'About Fahad': 'ফাহাদ সম্পর্কে', 'More': 'আরও',
    'Organization not found': 'সংগঠনটি পাওয়া যায়নি',

    'TalentVerse Bangladesh is a youth-focused organization founded and chaired by Fahad Abdur Rahman, built on one idea: talent should meet opportunity.': 'TalentVerse Bangladesh একটি যুব-কেন্দ্রিক সংগঠন, যার প্রতিষ্ঠাতা ও চেয়ারম্যান ফাহাদ আব্দুর রহমান। এর মূল ভাবনা একটাই: প্রতিভা যেন সুযোগের দেখা পায়।',
    'TalentVerse Bangladesh brings young people and opportunities closer together. Under the leadership of its founder and chairman, Fahad Abdur Rahman, the organization works to help young people in Bangladesh discover, develop and showcase their abilities.': 'TalentVerse Bangladesh তরুণদের সাথে সুযোগের দূরত্ব কমিয়ে আনে। প্রতিষ্ঠাতা ও চেয়ারম্যান ফাহাদ আব্দুর রহমানের নেতৃত্বে সংগঠনটি বাংলাদেশের তরুণদের নিজের সক্ষমতা খুঁজে পেতে, বিকশিত করতে এবং তুলে ধরতে সহায়তা করে।',
    'It is one of the three youth organizations built by Fahad Abdur Rahman, alongside NexEra Youth Network and Visionary Youth Alliance, all guided by the belief in "Better Youth, Better Tomorrow".': 'ফাহাদ আব্দুর রহমানের গড়া তিনটি যুব সংগঠনের একটি এটি। অন্য দুটি NexEra Youth Network ও Visionary Youth Alliance। সবগুলোর মূল বিশ্বাস: “উন্নত যুবসমাজ, উন্নত আগামী”।',
    'Talent': 'প্রতিভা', 'Impact': 'প্রভাব',
    'Recognizing and nurturing the skills and potential of young people across Bangladesh.': 'বাংলাদেশের তরুণদের দক্ষতা ও সম্ভাবনাকে চিনে নেওয়া এবং বিকশিত করা।',
    'Connecting young talent with platforms, programs and people who can help it grow.': 'তরুণ প্রতিভাকে এমন প্ল্যাটফর্ম, কর্মসূচি ও মানুষের সাথে যুক্ত করা, যারা তাদের বেড়ে উঠতে সাহায্য করতে পারে।',
    'Turning individual ability into real, visible contributions to society.': 'ব্যক্তির সক্ষমতাকে সমাজের জন্য বাস্তব, দৃশ্যমান অবদানে রূপ দেওয়া।',

    'NexEra Youth Network is a youth organization founded and chaired by Fahad Abdur Rahman, centered on learning, connection and growth.': 'NexEra Youth Network একটি যুব সংগঠন, যার প্রতিষ্ঠাতা ও চেয়ারম্যান ফাহাদ আব্দুর রহমান। শেখা, যুক্ত হওয়া ও এগিয়ে যাওয়াই এর কেন্দ্রবিন্দু।',
    'NexEra Youth Network is a community for young people who want to learn, meet like-minded peers and grow together. It was founded by Fahad Abdur Rahman, who serves as its founder and chairman.': 'NexEra Youth Network তরুণদের এমন একটি কমিউনিটি, যারা শিখতে, সমমনাদের সাথে পরিচিত হতে এবং একসাথে এগোতে চায়। এর প্রতিষ্ঠাতা ও চেয়ারম্যান ফাহাদ আব্দুর রহমান।',
    'It is one of the three youth organizations built by Fahad Abdur Rahman, alongside TalentVerse Bangladesh and Visionary Youth Alliance, all guided by the belief in "Better Youth, Better Tomorrow".': 'ফাহাদ আব্দুর রহমানের গড়া তিনটি যুব সংগঠনের একটি এটি। অন্য দুটি TalentVerse Bangladesh ও Visionary Youth Alliance। সবগুলোর মূল বিশ্বাস: “উন্নত যুবসমাজ, উন্নত আগামী”।',
    'Learn': 'শিখুন', 'Grow': 'এগিয়ে যান',
    'Creating spaces where young people can pick up new knowledge and skills.': 'তরুণরা যেন নতুন জ্ঞান ও দক্ষতা অর্জন করতে পারে, এমন পরিবেশ তৈরি করা।',
    'Bringing young people together to share ideas, support each other and collaborate.': 'তরুণদের একত্র করা, যাতে তারা ভাবনা বিনিময় করে, একে অপরকে সহায়তা করে ও একসাথে কাজ করে।',
    'Helping members turn what they learn into personal and community progress.': 'সদস্যরা যা শেখে, তা যেন ব্যক্তিগত ও সামাজিক অগ্রগতিতে রূপ নেয়, সে সহায়তা করা।',

    'Visionary Youth Alliance is a youth organization founded and chaired by Fahad Abdur Rahman, built around turning vision into action.': 'Visionary Youth Alliance একটি যুব সংগঠন, যার প্রতিষ্ঠাতা ও চেয়ারম্যান ফাহাদ আব্দুর রহমান। স্বপ্নকে কাজে রূপ দেওয়াই এর মূল ভাবনা।',
    'Visionary Youth Alliance unites young people who have ideas for a better future and the drive to act on them. It was founded by Fahad Abdur Rahman, who serves as its founder and chairman.': 'Visionary Youth Alliance সেইসব তরুণকে একত্র করে, যাদের একটি ভালো ভবিষ্যতের ভাবনা আছে এবং সেটা বাস্তবায়নের তাগিদও আছে। এর প্রতিষ্ঠাতা ও চেয়ারম্যান ফাহাদ আব্দুর রহমান।',
    'It is one of the three youth organizations built by Fahad Abdur Rahman, alongside TalentVerse Bangladesh and NexEra Youth Network, all guided by the belief in "Better Youth, Better Tomorrow".': 'ফাহাদ আব্দুর রহমানের গড়া তিনটি যুব সংগঠনের একটি এটি। অন্য দুটি TalentVerse Bangladesh ও NexEra Youth Network। সবগুলোর মূল বিশ্বাস: “উন্নত যুবসমাজ, উন্নত আগামী”।',
    'Vision': 'স্বপ্ন', 'Action': 'কাজ', 'Alliance': 'জোট',
    'Encouraging young people to imagine a better tomorrow for their communities.': 'তরুণরা যেন নিজেদের সমাজের জন্য একটি ভালো আগামীর স্বপ্ন দেখে, সে অনুপ্রেরণা দেওয়া।',
    'Turning ideas into real projects, programs and initiatives.': 'ভাবনাকে বাস্তব প্রকল্প, কর্মসূচি ও উদ্যোগে রূপ দেওয়া।',
    'Bringing young changemakers together so they achieve more as a team.': 'পরিবর্তনের কারিগর তরুণদের একত্র করা, যাতে তারা দল হিসেবে আরও বেশি অর্জন করতে পারে।',

    /* 404 page */
    'Page not found': 'পেজটি পাওয়া যায়নি',
    'The page you are looking for does not exist or may have been moved.': 'আপনি যে পেজটি খুঁজছেন সেটি নেই, অথবা সরিয়ে নেওয়া হয়েছে।',
    'Back to Home': 'হোমে ফিরে যান',
    'Or go to': 'অথবা যান',

    /* accessibility labels */
    "Loading Fahad Abdur Rahman's website": 'ফাহাদ আব্দুর রহমানের ওয়েবসাইট লোড হচ্ছে',
    'Main navigation': 'প্রধান মেনু',
    'Fahad Abdur Rahman — home': 'ফাহাদ আব্দুর রহমান — হোম',
    'Switch to dark mode': 'ডার্ক মোডে যান', 'Switch to light mode': 'লাইট মোডে যান',
    'Open menu': 'মেনু খুলুন', 'Close menu': 'মেনু বন্ধ করুন', 'Site menu': 'সাইট মেনু',
    'Portrait of Fahad Abdur Rahman, youth leader and founder of TalentVerse Bangladesh': 'যুব নেতা ও TalentVerse Bangladesh-এর প্রতিষ্ঠাতা ফাহাদ আব্দুর রহমানের প্রতিকৃতি',
    'Filter projects by category': 'ক্যাটাগরি অনুযায়ী প্রকল্প ফিল্টার করুন',
    'LinkedIn (opens in a new tab)': 'LinkedIn (নতুন ট্যাবে খুলবে)',
    'Facebook (opens in a new tab)': 'Facebook (নতুন ট্যাবে খুলবে)',
    'GitHub (opens in a new tab)': 'GitHub (নতুন ট্যাবে খুলবে)',
    'X / Twitter (opens in a new tab)': 'X / Twitter (নতুন ট্যাবে খুলবে)',
    'YouTube (opens in a new tab)': 'YouTube (নতুন ট্যাবে খুলবে)',
    'Contact form and details': 'যোগাযোগ ফর্ম ও তথ্য', 'Contact details': 'যোগাযোগের তথ্য'
  };
  var PLACES = [[/Joypurhat/g, 'জয়পুরহাট'], [/Bangladesh/g, 'বাংলাদেশ'], [/Chattogram/g, 'চট্টগ্রাম'], [/Dhaka/g, 'ঢাকা']];
  function place(s) { PLACES.forEach(function (p) { s = s.replace(p[0], p[1]); }); return s; }
  var RULES = [
    [/^(\d+) projects? shown$/, function (m) { return m[1] + 'টি প্রকল্প দেখানো হচ্ছে'; }],
    [/^(\d+\+?) organi[sz]ations$/, function (m) { return m[1] + ' সংগঠন'; }],
    [/^(\d+\+?) years$/, function (m) { return m[1] + ' বছর'; }],
    [/^Youth leader, organization builder and founder & chairman from (.+?)\.?$/, function (m) { return 'যুব নেতা, সংগঠক এবং প্রতিষ্ঠাতা ও চেয়ারম্যান — ' + place(m[1]) + '।'; }],
    [/^Youth leader and organization builder from (.+?)\.?$/, function (m) { return 'যুব নেতা ও সংগঠক — ' + place(m[1]) + '।'; }],
    [/^(Website|Organization|Event|Other) · (.+)$/, function (m) { var c = D[m[1]] || m[1]; var s = D[m[2]]; return c + ' · ' + (s || m[2]); }]
  ];
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function tr(key) {
    if (Object.prototype.hasOwnProperty.call(D, key)) return D[key];
    for (var i = 0; i < RULES.length; i++) { var m = RULES[i][0].exec(key); if (m) return RULES[i][1](m); }
    return null;
  }
  /* the person's name stays in English on the Bangla site (to show the name in Bangla, delete this function's body: just `return t;`) */
  function keepName(t) {
    return t.replace(/\u09ab\u09be\u09b9\u09be\u09a6/g, 'Fahad')
            .replace(/\u0986\u09ac\u09cd\u09a6\u09c1\u09b0/g, 'Abdur')
            .replace(/\u09b0\u09b9\u09ae\u09be\u09a8(\u09c7\u09b0|\u098f\u09b0|\u0995\u09c7|\u09b0)?/g, function (m, sfx) { return 'Rahman' + (sfx ? '-' + (sfx === '\u09c7\u09b0' ? '\u098f\u09b0' : sfx) : ''); });
  }
  /* translate a raw string, keeping its leading/trailing spaces; returns raw when there is no translation */
  function xl(raw) {
    var k = norm(raw); if (!k) return raw;
    var t = tr(k); if (t == null) return raw;
    t = keepName(t);
    var m = /^(\s*)[\s\S]*?(\s*)$/.exec(raw);
    return m[1] + t + m[2];
  }
  /* store keeps the original English so we can switch back; if the page rewrites the text meanwhile, that becomes the new original */
  function apply(store, key, cur, setFn) {
    var rec = store[key], o;                 /* rec = { o: original English, w: what we last wrote } */
    o = (rec && cur === rec.w) ? rec.o : cur; /* untouched since we wrote it -> keep the original; otherwise the page changed it */
    var want = LANG === 'bn' ? xl(o) : o;
    if (want !== o) store[key] = { o: o, w: want }; else delete store[key];
    if (want !== cur) setFn(want);
  }
  var ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
  var SKIP = 'script,style,noscript,textarea,[data-no-i18n],.in-name';
  function procText(n) {
    var p = n.parentNode; if (!p || p.nodeType !== 1) return;
    if (p.closest && p.closest(SKIP)) return;
    apply(n.__fa || (n.__fa = {}), 't', n.nodeValue, function (v) { n.nodeValue = v; });
  }
  function procAttr(e, a) {
    var cur = e.getAttribute(a); if (cur == null) return;
    if (e.closest && e.closest(SKIP)) return;
    apply(e.__fa || (e.__fa = {}), a, cur, function (v) { e.setAttribute(a, v); });
  }
  function walk(node) {
    if (!node) return;
    if (node.nodeType === 3) { procText(node); return; }
    if (node.nodeType !== 1) return;
    if (node.closest && node.closest(SKIP)) return;
    var els = [node].concat([].slice.call(node.querySelectorAll('[aria-label],[title],[placeholder],[alt]')));
    els.forEach(function (e) { ATTRS.forEach(function (a) { if (e.hasAttribute && e.hasAttribute(a)) procAttr(e, a); }); });
    var tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null), list = [];
    while (tw.nextNode()) list.push(tw.currentNode);
    list.forEach(procText);
  }
  var mo = null;
  function startObs() {
    if (mo) return;
    mo = new MutationObserver(function (recs) {
      recs.forEach(function (r) {
        if (r.type === 'characterData') procText(r.target);
        else if (r.type === 'attributes') procAttr(r.target, r.attributeName);
        else [].forEach.call(r.addedNodes, walk);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function stopObs() { if (mo) { mo.disconnect(); mo = null; } }

  var bnFontLoaded = false;
  function loadBnFont() {
    if (bnFontLoaded) return; bnFontLoaded = true;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }

  /* ================= language button ================= */
  var langBtn = null;
  function paintBtn() {
    if (!langBtn) return;
    langBtn.textContent = LANG === 'bn' ? 'EN' : 'বাং';
    langBtn.setAttribute('aria-label', LANG === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন');
    langBtn.title = LANG === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন';
  }
  function mountToggle() {
    var tools = document.querySelector('.tools'); if (!tools) return;
    langBtn = document.createElement('button');
    langBtn.type = 'button'; langBtn.className = 'ibtn langbtn'; langBtn.id = 'langBtn';
    langBtn.setAttribute('data-no-i18n', '');
    tools.insertBefore(langBtn, tools.firstChild);
    langBtn.addEventListener('click', function () { setLang(LANG === 'bn' ? 'en' : 'bn'); });
    paintBtn();
  }
  function setLang(l) {
    LANG = l; put('fa-lang', l);
    try { window.faTrack && window.faTrack('language_change', { to_lang: l }); } catch (e) {}
    root.setAttribute('lang', l === 'bn' ? 'bn' : 'en');
    if (l === 'bn') { loadBnFont(); startObs(); } else { stopObs(); }
    walk(document.body);
    paintBtn();
    typingRestart();
    try { mountNotice(); } catch (e) {}
  }

  /* ================= back to top ================= */
  function mountTop() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'totop'; b.id = 'toTop'; b.setAttribute('aria-label', 'Back to top');
    b.innerHTML = '<svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle class="rt" cx="24" cy="24" r="21"/><circle class="rp" cx="24" cy="24" r="21"/></svg>' +
      '<svg class="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(b);
    var rp = b.querySelector('.rp'), C = 2 * Math.PI * 21, ticking = false;
    rp.style.strokeDasharray = C;
    function upd() {
      ticking = false;
      var h = root.scrollHeight - innerHeight, y = window.pageYOffset || root.scrollTop;
      b.classList.toggle('show', y > 480);
      rp.style.strokeDashoffset = C * (1 - (h > 0 ? Math.min(y / h, 1) : 0));
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    addEventListener('resize', upd);
    upd();
    b.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var skip = document.querySelector('.skip'); if (skip) { /* keep keyboard users near the top */ skip.focus({ preventScroll: true }); skip.blur(); }
    });
  }

  /* ================= hero typing line ================= */
  var PH = {
    en: ['Youth Leader', 'Organization Builder', 'Founder & Chairman', 'Content Creator'],
    bn: ['যুব নেতা', 'সংগঠক', 'প্রতিষ্ঠাতা ও চেয়ারম্যান', 'কনটেন্ট ক্রিয়েটর']
  };
  var seg = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  function graphemes(s) {
    if (seg) return Array.from(seg.segment(s), function (x) { return x.segment; });
    return Array.from(s);
  }
  var T = { el: null, tt: null, tc: null, sr: null, timer: null, pi: 0, n: 0, del: false, started: false };
  function typingStep() {
    clearTimeout(T.timer);
    if (document.hidden) { T.timer = setTimeout(typingStep, 600); return; }
    var list = PH[LANG], g = graphemes(list[T.pi]);
    if (!T.del) {
      T.n++; T.tt.textContent = g.slice(0, T.n).join('');
      if (T.n >= g.length) { T.del = true; T.timer = setTimeout(typingStep, 1600); return; }
      T.timer = setTimeout(typingStep, 65 + Math.random() * 45);
    } else {
      T.n--; T.tt.textContent = g.slice(0, T.n).join('');
      if (T.n <= 0) { T.del = false; T.pi = (T.pi + 1) % list.length; T.timer = setTimeout(typingStep, 350); return; }
      T.timer = setTimeout(typingStep, 32);
    }
  }
  function typingRestart() {
    if (!T.el) return;
    clearTimeout(T.timer);
    var list = PH[LANG];
    T.sr.textContent = list.join(', ');
    T.pi = 0; T.n = 0; T.del = false;
    if (reduce) { T.tt.textContent = list.join(' · '); return; }
    if (!T.started) { T.tt.textContent = list[0]; return; }   /* intro still on screen: show a static first phrase */
    T.tt.textContent = '';
    typingStep();
  }
  function whenIntroDone(cb) {
    if (!root.classList.contains('intro-on')) { cb(); return; }
    var fired = false;
    function go() { if (fired) return; fired = true; mo2.disconnect(); setTimeout(cb, 700); }
    var mo2 = new MutationObserver(function () { if (!root.classList.contains('intro-on')) go(); });
    mo2.observe(root, { attributes: true, attributeFilter: ['class'] });
    setTimeout(go, 9000);
  }
  function mountTyping() {
    var sub = document.getElementById('heroSub'); if (!sub) return;
    var p = document.createElement('p');
    p.className = 'typed'; p.setAttribute('data-no-i18n', '');
    p.innerHTML = '<span class="fa-sr"></span><span class="tt" aria-hidden="true"></span><span class="tc" aria-hidden="true"></span>';
    sub.parentNode.insertBefore(p, sub.nextSibling);
    T.el = p; T.sr = p.querySelector('.fa-sr'); T.tt = p.querySelector('.tt'); T.tc = p.querySelector('.tc');
    typingRestart();
    whenIntroDone(function () { T.started = true; typingRestart(); });
  }

  /* ================= warm-up: fetch the other pages quietly after this one has finished loading ================= */
  function warm() {
    try { if (navigator.connection && navigator.connection.saveData) return; } catch (e) {}
    var here = location.pathname.split('/').pop() || 'index.html', seen = {};
    [].forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href');
      if (!/^[a-z0-9-]+\.html$/i.test(h) || h === 'admin.html' || h === '404.html' || h === here || seen[h]) return;
      seen[h] = 1;
      var l = document.createElement('link'); l.rel = 'prefetch'; l.href = h; l.as = 'document';
      document.head.appendChild(l);
    });
  }
  function idle(fn) { (window.requestIdleCallback || function (f) { setTimeout(f, 300); })(fn, { timeout: 2500 }); }

  /* ================= PREMIUM: nav state on scroll + soft glow that follows the finger/cursor ================= */
  function mountPremium() {
    var ticking = false;
    function sc() { root.classList.toggle('fa-scrolled', (window.scrollY || 0) > 24); ticking = false; }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(sc); } }, { passive: true });
    sc();
    var last = null;
    function move(e) {
      var t = e.target && e.target.closest ? e.target.closest('.card') : null;
      if (last && last !== t) last.classList.remove('fa-glow');
      last = t; if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
      if (e.pointerType !== 'mouse') t.classList.add('fa-glow');
    }
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', move, { passive: true });
    document.addEventListener('pointerup', function () { if (last) setTimeout(function () { last && last.classList.remove('fa-glow'); }, 450); }, { passive: true });
  }

  /* ================= FX: spotlight, parallax, tilt, magnetic buttons ================= */
  function mountFx() {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || root.classList.contains('lite')) return;
    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    var photo = document.querySelector('.photo'), blobs = [].slice.call(document.querySelectorAll('.aurora .blob'));
    /* scroll parallax (all devices) */
    var raf = 0;
    function par() {
      raf = 0; var y = window.scrollY || 0; if (y > 1400) return;
      blobs.forEach(function (b, i) { b.style.translate = '0 ' + (y * (i ? -.1 : .14)).toFixed(1) + 'px'; });
    }
    if (blobs.length) addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(par); }, { passive: true });
    if (!fine) return;
    /* cursor spotlight */
    var sp = document.createElement('div'); sp.className = 'fa-spot'; sp.setAttribute('aria-hidden', 'true'); document.body.appendChild(sp);
    var tx = 0, ty = 0, cx = 0, cy = 0, run = false;
    function loop() { cx += (tx - cx) * .16; cy += (ty - cy) * .16; sp.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)'; if (Math.abs(tx - cx) + Math.abs(ty - cy) > .5) requestAnimationFrame(loop); else run = false; }
    document.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY; sp.classList.add('on'); if (!run) { run = true; requestAnimationFrame(loop); }
      if (photo) {
        var r = photo.getBoundingClientRect();
        if (e.clientX > r.left - 80 && e.clientX < r.right + 80 && e.clientY > r.top - 80 && e.clientY < r.bottom + 80) {
          var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          photo.style.transform = 'perspective(900px) rotateY(' + (px * 9).toFixed(2) + 'deg) rotateX(' + (-py * 7).toFixed(2) + 'deg)';
        } else photo.style.transform = '';
      }
    }, { passive: true });
    document.addEventListener('pointerleave', function () { sp.classList.remove('on'); if (photo) photo.style.transform = ''; });
    /* magnetic primary buttons */
    [].forEach.call(document.querySelectorAll('.btn.primary'), function (b) {
      b.classList.add('fa-mag');
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .14).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + 'px)'; });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ================= notice bar (text comes from Admin > Site texts) ================= */
  function mountNotice() {
    var old = document.getElementById('faNotice'); if (old) old.remove();
    var n = null; try { n = JSON.parse(localStorage.getItem('fa-notice') || 'null'); } catch (e) {}
    if (!n) return;
    var tx = (LANG === 'bn' && n.tb) ? n.tb : n.t, lb = (LANG === 'bn' && n.bb) ? n.bb : n.b;
    if (!tx) return;
    var key = n.t + '|' + n.l;
    try { if (sessionStorage.getItem('fa-notice-x') === key) return; } catch (e) {}
    var bar = document.createElement('div'); bar.className = 'notice'; bar.id = 'faNotice'; bar.setAttribute('role', 'status');
    var nt = document.createElement('div'); nt.className = 'nt';
    var nm = document.createElement('div'); nm.className = 'nm';
    function unit(clone) {
      var u = document.createElement('span'); if (clone) u.setAttribute('aria-hidden', 'true');
      var t = document.createElement('span'); t.textContent = tx; u.appendChild(t);
      if (/^https?:\/\//i.test(n.l)) {
        var a = document.createElement('a'); a.href = n.l; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = lb || (LANG === 'bn' ? 'বিস্তারিত' : 'Learn more');
        if (clone) a.tabIndex = -1; u.appendChild(a);
      }
      u.appendChild(Object.assign(document.createElement('span'), { textContent: '✦', className: 'sep' }));
      return u;
    }
    /* repeat the message enough times that two identical halves always fill the bar, then slide by exactly one half */
    var a1 = unit(false); nm.appendChild(a1); nt.appendChild(nm); bar.appendChild(nt);
    var x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.textContent = '×';
    x.addEventListener('click', function () { try { sessionStorage.setItem('fa-notice-x', key); } catch (e) {} bar.remove(); });
    bar.appendChild(x);
    document.body.insertBefore(bar, document.body.firstChild);
    var w = a1.offsetWidth || 300, need = Math.max(1, Math.ceil((nt.offsetWidth || 360) / w));
    for (var i = 1; i < need; i++) nm.appendChild(unit(true));
    var half = nm.children.length; for (var j = 0; j < half; j++) nm.appendChild(nm.children[j].cloneNode(true));
    nm.style.setProperty('--dur', Math.max(10, (nm.scrollWidth / 2) / 55) + 's');
  }
  window.faNotice = mountNotice;

  /* ================= pattern overlays ================= */
  function addGeo(el, cls) {
    if (el.querySelector(':scope > .geo')) return;
    var g = document.createElement('div'); g.className = 'geo' + (cls ? ' ' + cls : ''); g.setAttribute('aria-hidden', 'true');
    el.insertBefore(g, el.firstChild);
  }
  function mountGeo() {
    [].forEach.call(document.querySelectorAll('.aurora'), function (a) { addGeo(a); a.classList.add('has-geo'); });
    [].forEach.call(document.querySelectorAll('.band,.contact'), function (a) { addGeo(a, 'dk'); });
    [].forEach.call(document.querySelectorAll('.aq'), function (a) { addGeo(a); });
  }

  /* ================= start ================= */
  function init() {
    mountGeo();
    mountNotice();
    mountPremium();
    mountFx();
    mountToggle();
    mountTop();
    mountTyping();
    if (LANG === 'bn') { root.setAttribute('lang', 'bn'); loadBnFont(); walk(document.body); startObs(); typingRestart(); }
    if (document.readyState === 'complete') idle(warm); else addEventListener('load', function () { idle(warm); });
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
