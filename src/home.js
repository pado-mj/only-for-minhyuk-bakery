let sort='new';
const table=document.querySelector('#table');
const SEOUL_OFFSET=9*60*60*1000;
let locale=localStorage.getItem('minhyuk-locale')||'ko';

const COPY={
  ko:{tagline:'민혁이의 생일 테이블을 케이크와 마음으로 채워주세요.',until:'민혁이 생일까지',light:'생일이 되면 베이커리가 환하게 밝혀져요. ✦',birthday:'HAPPY MINHYUK DAY!',lit:'베이커리의 불이 모두 켜졌어요',wish:'소원을 빌어주세요 — 모든 촛불이 민혁이를 위해 빛나고 있어요. ✦',cakes:'케이크',today:'오늘',countries:'개국',make:'케이크 만들기',table:'BIRTHDAY TABLE',new:'NEW',viewed:'MOST VIEWED',random:'RANDOM',hint:'케이크와 편지를 천천히 둘러보세요 ♡'},
  en:{tagline:"Let's fill his birthday table with cakes and wishes.",until:"UNTIL MINHYUK’S BIRTHDAY",light:'The bakery will light up on his birthday. ✦',birthday:'HAPPY MINHYUK DAY!',lit:'THE BAKERY IS ALL LIT UP',wish:'Make a wish — every candle is shining for Minhyuk. ✦',cakes:'CAKES',today:'TODAY',countries:'COUNTRIES',make:'MAKE A CAKE',table:'BIRTHDAY TABLE',new:'NEW',viewed:'MOST VIEWED',random:'RANDOM',hint:'Scroll through the cakes and wishes ♡'},
  ja:{tagline:'ミニョクの誕生日テーブルをケーキとメッセージでいっぱいにしよう。',until:'ミニョクの誕生日まで',light:'誕生日になるとベーカリーが明るく灯ります。✦',birthday:'HAPPY MINHYUK DAY!',lit:'ベーカリーの灯りがすべて点きました',wish:'願いごとをしてね — すべてのキャンドルがミニョクのために輝いています。✦',cakes:'CAKES',today:'TODAY',countries:'COUNTRIES',make:'ケーキを作る',table:'BIRTHDAY TABLE',new:'NEW',viewed:'MOST VIEWED',random:'RANDOM',hint:'ケーキとメッセージをゆっくり見てね ♡'}
};
const t=()=>COPY[locale]||COPY.ko;
let lastStats={total:0,today:0,countries:0};

function birthdayState(){
  const now=new Date(); const seoulNow=new Date(now.getTime()+SEOUL_OFFSET);
  const year=seoulNow.getUTCFullYear(),month=seoulNow.getUTCMonth(),day=seoulNow.getUTCDate();
  const isBirthday=month===10&&day===3; let targetYear=year;
  if(month>10||(month===10&&day>3)) targetYear=year+1;
  return {now:now.getTime(),target:Date.UTC(targetYear,10,2,15,0,0),isBirthday};
}
function applyCopy(){
  document.documentElement.lang=locale==='ja'?'ja':locale==='en'?'en':'ko';
  document.querySelectorAll('[data-locale]').forEach(b=>b.classList.toggle('active',b.dataset.locale===locale));
  document.querySelector('#tagline').textContent=t().tagline;
  document.querySelector('#makeCake').textContent=t().make;
  document.querySelector('#tableTitle').textContent=t().table;
  document.querySelector('#scrollHint').textContent=t().hint;
  const sorts=document.querySelectorAll('[data-sort]'); if(sorts[0])sorts[0].textContent=t().new;if(sorts[1])sorts[1].textContent=t().viewed;
  document.querySelector('#random').textContent=t().random;
  renderStats(); updateBirthday();
}
function renderStats(){
  document.querySelector('#total').textContent=`${lastStats.total} ${t().cakes} ♡`;
  document.querySelector('#today').textContent=`+${lastStats.today} ${t().today}`;
  document.querySelector('#countries').textContent=locale==='ko'?`${lastStats.countries}${t().countries}`:`${lastStats.countries} ${t().countries}`;
}
function updateBirthday(){
  const {now,target,isBirthday}=birthdayState(); const box=document.querySelector('#birthdayCountdown'),time=document.querySelector('#countdownTime'),label=document.querySelector('#countdownLabel'),note=document.querySelector('#countdownNote');
  document.body.classList.toggle('birthday-lit',isBirthday); box?.classList.toggle('is-birthday',isBirthday);
  if(isBirthday){time.textContent=t().birthday;label.textContent=t().lit;note.textContent=t().wish;return;}
  const diff=Math.max(0,target-now),days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),mins=Math.floor(diff%3600000/60000),secs=Math.floor(diff%60000/1000);
  time.textContent=`D-${days} · ${String(hours).padStart(2,'0')} : ${String(mins).padStart(2,'0')} : ${String(secs).padStart(2,'0')}`;label.textContent=t().until;note.textContent=t().light;
}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
async function load(){
  const r=await fetch(`/api/cakes?sort=${sort}`); const d=await r.json(); lastStats=d.stats||lastStats;renderStats();table.innerHTML='';
  d.cakes.forEach(c=>{const a=document.createElement('a');a.href=`/cake/${c.public_id}`;a.className='cake-list-card';a.innerHTML=`<div class="cake-thumb"><img src="${esc(c.final_image_url)}" alt="cake by ${esc(c.nickname)}"></div><div class="cake-copy"><div class="cake-meta"><strong>${esc(c.nickname)}</strong>${c.country?`<span>${esc(c.country)}</span>`:''}</div><p>${esc(c.letter)}</p><small>CAKE #${esc(c.public_number||'')}</small></div>`;table.append(a)});
}
document.querySelectorAll('[data-locale]').forEach(b=>b.onclick=()=>{locale=b.dataset.locale;localStorage.setItem('minhyuk-locale',locale);applyCopy()});
document.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{sort=b.dataset.sort;document.querySelectorAll('[data-sort]').forEach(x=>x.classList.toggle('active',x===b));load()});
document.querySelector('#random').onclick=async()=>{const r=await fetch('/api/cakes?sort=random&limit=1');const d=await r.json();if(d.cakes[0])location.href=`/cake/${d.cakes[0].public_id}`};
applyCopy();updateBirthday();setInterval(updateBirthday,1000);load();
