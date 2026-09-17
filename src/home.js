let sort='new'; const table=document.querySelector('#table');

const SEOUL_OFFSET=9*60*60*1000;
function birthdayState(){
  const now=new Date();
  const seoulNow=new Date(now.getTime()+SEOUL_OFFSET);
  const year=seoulNow.getUTCFullYear();
  const month=seoulNow.getUTCMonth();
  const day=seoulNow.getUTCDate();
  const isBirthday=month===10&&day===3;
  let targetYear=year;
  if(month>10||(month===10&&day>3)) targetYear=year+1;
  const target=Date.UTC(targetYear,10,2,15,0,0);
  return {now:now.getTime(),target,isBirthday};
}
function updateBirthday(){
  const {now,target,isBirthday}=birthdayState();
  const box=document.querySelector('#birthdayCountdown');
  const time=document.querySelector('#countdownTime');
  const label=document.querySelector('#countdownLabel');
  const note=document.querySelector('#countdownNote');
  document.body.classList.toggle('birthday-lit',isBirthday);
  box?.classList.toggle('is-birthday',isBirthday);
  if(isBirthday){
    time.textContent='HAPPY MINHYUK DAY!';
    label.textContent='THE BAKERY IS ALL LIT UP';
    note.textContent='Make a wish — every candle is shining for Minhyuk. ✦';
    return;
  }
  const diff=Math.max(0,target-now);
  const days=Math.floor(diff/86400000);
  const hours=Math.floor(diff%86400000/3600000);
  const mins=Math.floor(diff%3600000/60000);
  const secs=Math.floor(diff%60000/1000);
  time.textContent=`D-${days} · ${String(hours).padStart(2,'0')} : ${String(mins).padStart(2,'0')} : ${String(secs).padStart(2,'0')}`;
  label.textContent='UNTIL MINHYUK’S BIRTHDAY';
  note.textContent='The bakery will light up on his birthday. ✦';
}
updateBirthday(); setInterval(updateBirthday,1000);

async function load(){const r=await fetch(`/api/cakes?sort=${sort}`); const d=await r.json(); document.querySelector('#total').textContent=`${d.stats.total} CAKES ♡`;document.querySelector('#today').textContent=`+${d.stats.today} TODAY`;document.querySelector('#countries').textContent=`${d.stats.countries} COUNTRIES`;table.querySelectorAll('.cake-card').forEach(x=>x.remove());d.cakes.forEach((c,i)=>{const a=document.createElement('a');a.href=`/cake/${c.public_id}`;a.className='cake-card';const depth=i%10; a.style.top=`${70+i*105}px`;a.style.transform=`translateX(-50%) scale(${.38+Math.min(i,9)*.07})`;a.innerHTML=`<img src="${c.final_image_url}" alt="cake"><p>${esc(c.nickname)}${c.country?' · '+esc(c.country):''}<br>${esc(c.letter.slice(0,55))}${c.letter.length>55?'…':''}</p>`;table.append(a)})}
function esc(s=''){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
document.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{sort=b.dataset.sort;document.querySelectorAll('[data-sort]').forEach(x=>x.classList.toggle('active',x===b));load()});document.querySelector('#random').onclick=async()=>{const r=await fetch('/api/cakes?sort=random&limit=1');const d=await r.json();if(d.cakes[0]) location.href=`/cake/${d.cakes[0].public_id}`};load();
