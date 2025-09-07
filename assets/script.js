
async function loadUpcoming(limit=3){
  try{
    const res = await fetch('/data/events.json',{cache:'no-store'});
    const events = await res.json();
    const now = new Date();
    const upcoming = events
      .map(e=>({...e, date: new Date(e.datetime)}))
      .filter(e=>e.date>=now)
      .sort((a,b)=>a.date-b.date)
      .slice(0, limit);
    const list = document.getElementById('upcoming-list');
    if(!list) return;
    if(upcoming.length===0){ list.innerHTML = '<li class="event"><span>No events announced yet. Join the list for the next location drop.</span><span class="badge">Soon™</span></li>'; return;}
    list.innerHTML = upcoming.map(e=>`
      <li class="event">
        <div>
          <div style="font-weight:900">${new Intl.DateTimeFormat(undefined,{weekday:'short', month:'short', day:'numeric'}).format(e.date)} — ${e.city}</div>
          <div style="opacity:.88">${e.venue} · ${e.title}</div>
        </div>
        <div style="display:flex; gap:8px; align-items:center">
          ${e.ticket_url?`<a class="btn" href="${e.ticket_url}" target="_blank" rel="noopener">RSVP</a>`:''}
          ${e.ics?`<a class="badge" href="${e.ics}" download>Add to Calendar</a>`:''}
        </div>
      </li>
    `).join('');
  }catch(err){ console.error(err); }
}
async function loadAllEvents(){
  try{
    const res = await fetch('/data/events.json',{cache:'no-store'});
    const events = await res.json();
    const byYear = {};
    for(const e of events){
      const d = new Date(e.datetime);
      const y = d.getFullYear();
      byYear[y] ||= [];
      byYear[y].push({...e, date:d});
    }
    for(const y in byYear){ byYear[y].sort((a,b)=>a.date-b.date); }
    const years = Object.keys(byYear).sort((a,b)=>b-a);
    const mount = document.getElementById('events-mount');
    if(!mount) return;
    mount.innerHTML = years.map(y=>`
      <h3>${y}</h3>
      <ul class="clean">
        ${byYear[y].map(e=>`
          <li class="event">
            <div>
              <div style="font-weight:900">${new Intl.DateTimeFormat(undefined,{weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}).format(e.date)} — ${e.city}</div>
              <div style="opacity:.88">${e.venue} · ${e.title}</div>
            </div>
            <div style="display:flex; gap:8px; align-items:center">
              ${e.album_url?`<a class="badge" href="${e.album_url}" target="_blank" rel="noopener">Photos</a>`:''}
              ${e.recap_url?`<a class="badge" href="${e.recap_url}" target="_blank" rel="noopener">Recap</a>`:''}
            </div>
          </li>
        `).join('')}
      </ul>
    `).join('');
  }catch(e){ console.error(e); }
}
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('upcoming-list')) loadUpcoming();
  if(document.getElementById('events-mount')) loadAllEvents();
});


// === EVIL EMPIRE V2 JS ===
function initLightbox(){
  const backdrop = document.createElement('div');
  backdrop.className = 'lightbox-backdrop';
  const img = document.createElement('img');
  backdrop.appendChild(img);
  backdrop.addEventListener('click', ()=> backdrop.classList.remove('active'));
  document.body.appendChild(backdrop);
  document.querySelectorAll('.gallery img').forEach(el=>{
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', ()=>{
      img.src = el.src;
      backdrop.classList.add('active');
    });
  });
}

function initReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  els.forEach(el=> io.observe(el));
}

document.addEventListener('DOMContentLoaded', ()=>{
  initLightbox();
  initReveal();
});
