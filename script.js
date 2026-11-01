/* ======================================================================
   Shared header and footer. Edit the menu or the footer HERE, once, and
   every page updates.
   ====================================================================== */
const NAV = [
  ['about.html', 'About'],
  ['research.html', 'Research'],
  ['publications.html', 'Publications'],
  ['team.html', 'Team'],
  ['news.html', 'News'],
  ['join.html', 'Join Us'],
  ['contact.html', 'Contact', 'cta']
];
(function(){
  const page = (location.pathname.split('/').pop() || 'index.html');
  const links = NAV.map(n => '<li><a href="'+n[0]+'"'+(n[2]?' class="cta'+(page===n[0]?' active':'')+'"':(page===n[0]?' class="active"':''))+'>'+n[1]+'</a></li>').join('');
  const h = document.getElementById('site-header');
  if(h) h.innerHTML =
    '<div class="wrap nav">' +
      '<a class="brand" href="index.html"><img src="images/logo.png" alt="GDCL logo"><span>Grid Dynamics &amp; Computation<small>Laboratory</small></span></a>' +
      '<button class="burger" aria-label="Menu" onclick="document.getElementById(\'menu\').classList.toggle(\'open\')">&#9776;</button>' +
      '<nav><ul id="menu">' + links + '</ul></nav>' +
    '</div>';
  const f = document.getElementById('site-footer');
  if(f) f.innerHTML =
    '<div class="wrap">' +
      '<div class="foot">' +
        '<div class="foot-brand">' +
          '<a class="flogo" href="index.html"><img src="images/logo-horizontal.jpg" alt="GDCL - Grid Dynamics and Computation Laboratory"></a>' +
          '<p><b style="color:#fff">Grid Dynamics and Computation Laboratory</b><br>Dept. of Electrical Engineering<br>Indian Institute of Technology Indore<br>Simrol, Indore, Madhya Pradesh, India 453552</p>' +
          '<p><a href="mailto:powerdyn101@gmail.com">powerdyn101@gmail.com</a><br><a href="mailto:lokesh@iiti.ac.in">lokesh@iiti.ac.in</a></p>' +
          '<p><a href="https://maps.app.goo.gl/4NGoZbb5AfSsnvuN9" target="_blank" rel="noopener">Open in Google Maps</a></p>' +
        '</div>' +
        '<div class="foot-links">' +
          '<div><h4>Explore</h4><a href="index.html">Home</a><a href="about.html">About</a><a href="research.html">Research</a><a href="publications.html">Publications</a></div>' +
          '<div><h4>Connect</h4><a href="team.html">Team</a><a href="news.html">News</a><a href="join.html">Join Us</a><a href="contact.html">Contact</a></div>' +
        '</div>' +
      '</div>' +
      '<div class="copy">&copy; <span id="yr"></span> Grid Dynamics and Computation Laboratory, IIT Indore.</div>' +
    '</div>';
  const yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();
  const menu = document.getElementById('menu'); if(menu) menu.addEventListener('click', () => menu.classList.remove('open'));
})();

/* scroll reveal */
const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- hero network animation ---------- */
(function(){
  const c = document.getElementById('gridnet'); if(!c) return;
  const ctx = c.getContext('2d'); let w,h,nodes=[];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    w = c.width = c.offsetWidth; h = c.height = c.offsetHeight;
    const n = Math.max(18, Math.floor(w*h/22000));
    nodes = Array.from({length:n}, () => ({x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const a of nodes){
      if(!reduce){ a.x+=a.vx; a.y+=a.vy; if(a.x<0||a.x>w)a.vx*=-1; if(a.y<0||a.y>h)a.vy*=-1; }
    }
    for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i], b=nodes[j], d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<150){ ctx.strokeStyle='rgba(10,135,200,'+(0.35*(1-d/150))+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    }
    for(const a of nodes){ ctx.fillStyle='rgba(21,165,115,.8)'; ctx.beginPath(); ctx.arc(a.x,a.y,2.4,0,6.283); ctx.fill(); }
    if(!reduce) requestAnimationFrame(draw);
  }
  resize(); draw(); window.addEventListener('resize', ()=>{resize(); if(reduce) draw();});
})();

/* ---------- swing equation demo ----------
   (2H/ws) d2δ/dt2 = Pm - Pmax sin δ - D dδ/dt   (δ in rad, time in s, ws = 2π·50 rad/s)
   Start at the pre-disturbance equilibrium (Pm = 0.5), then step to the chosen Pm at t = 0.5 s. */
(function(){
  const cv = document.getElementById('swing'); if(!cv) return;
  const ctx = cv.getContext('2d');
  const sH=document.getElementById('sH'), sD=document.getElementById('sD'), sP=document.getElementById('sP');
  const vH=document.getElementById('vH'), vD=document.getElementById('vD'), vP=document.getElementById('vP'), st=document.getElementById('status');
  const Pmax=1.5, ws=2*Math.PI*50, P0=0.5, T=8, dt=0.002;

  function simulate(H,D,Pm){
    let d=Math.asin(P0/Pmax), w=0, out=[], unstable=false;
    for(let t=0;t<=T;t+=dt){
      const P = t<0.5 ? P0 : Pm;
      const acc = (ws/(2*H))*(P - Pmax*Math.sin(d) - D*w);
      w += acc*dt; d += w*dt;
      out.push([t,d]);
      if(d>Math.PI){ unstable=true; }
      if(d>4*Math.PI) break;
    }
    return {out, unstable};
  }
  function render(){
    const H=+sH.value, D=+sD.value, Pm=+sP.value;
    vH.textContent=H.toFixed(1); vD.textContent=D.toFixed(1); vP.textContent=Pm.toFixed(2);
    const r=devicePixelRatio||1, W=cv.clientWidth, Hh=cv.clientHeight;
    cv.width=W*r; cv.height=Hh*r; ctx.setTransform(r,0,0,r,0,0);
    ctx.clearRect(0,0,W,Hh);
    const {out,unstable}=simulate(H,D,Pm);
    const ymin=0, ymax=Math.max(Math.PI*1.1, Math.max(...out.map(p=>p[1]))*1.05);
    const pad={l:42,r:12,t:14,b:28};
    const X=t=>pad.l+(t/T)*(W-pad.l-pad.r), Y=d=>Hh-pad.b-((d-ymin)/(ymax-ymin))*(Hh-pad.t-pad.b);
    // grid + axes
    ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.fillStyle='#9fb6d1'; ctx.font='11px sans-serif'; ctx.lineWidth=1;
    for(let k=0;k<=4;k++){ const dd=ymin+(ymax-ymin)*k/4; ctx.beginPath(); ctx.moveTo(pad.l,Y(dd)); ctx.lineTo(W-pad.r,Y(dd)); ctx.stroke(); ctx.fillText((dd*180/Math.PI).toFixed(0)+'°',4,Y(dd)+4); }
    for(let t=0;t<=T;t+=2){ ctx.fillText(t+' s',X(t)-8,Hh-8); }
    // 180 deg line
    ctx.setLineDash([5,4]); ctx.strokeStyle='#B5651D'; ctx.beginPath(); ctx.moveTo(pad.l,Y(Math.PI)); ctx.lineTo(W-pad.r,Y(Math.PI)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#B5651D'; ctx.fillText('180° limit',W-pad.r-60,Y(Math.PI)-5);
    // trace
    const g=ctx.createLinearGradient(pad.l,0,W,0); g.addColorStop(0,'#15A573'); g.addColorStop(1,'#0A87C8');
    ctx.strokeStyle=g; ctx.lineWidth=2.5; ctx.beginPath();
    out.forEach((p,i)=>{ const x=X(p[0]), y=Y(p[1]); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke();
    if(Pm>=Pmax*0.999 || unstable){ st.textContent='Unstable: the rotor angle runs away (loss of synchronism).'; st.style.color='#ff9d6b'; }
    else { st.textContent='Stable: oscillations settle to a new equilibrium at '+(Math.asin(Pm/Pmax)*180/Math.PI).toFixed(1)+'°.'; st.style.color='#5be3b0'; }
  }
  [sH,sD,sP].forEach(s=>s.addEventListener('input',render));
  window.addEventListener('resize',render); render();
})();

/* ---------- publication filter ---------- */
(function(){
  const chips = document.querySelectorAll('#chips .chip');
  const pubs = document.querySelectorAll('.pub');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('on')); c.classList.add('on');
    const f = c.dataset.f;
    pubs.forEach(p => p.classList.toggle('hide', f !== 'all' && p.dataset.type !== f));
  }));
})();
