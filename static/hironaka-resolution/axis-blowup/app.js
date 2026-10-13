(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const state = { s: 0.5, theta: 35, rho: 1.1 };
  let animation = null;
  const ns = 'http://www.w3.org/2000/svg';
  const clean = x => (Math.abs(x) < 0.005 ? 0 : x).toFixed(2);
  const project = (s, x, y) => [260 + 68 * s + 30 * x, 193 - 15 * s + 25 * x - 69 * y];
  const make = (parent, tag, attrs, text) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    if (text !== undefined) el.textContent = text;
    parent.appendChild(el);
    return el;
  };
  const path = (parent, points, cls, close = false) => make(parent, 'path', {
    d: points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + (close ? ' Z' : ''), class: cls,
  });
  const label = (parent, p, text, cls = '') => make(parent, 'text', { x:p[0], y:p[1], class:cls }, text);
  const dot = (parent, p, radius, cls) => make(parent, 'circle', {cx:p[0], cy:p[1], r:radius, class:cls});

  function drawSpace(c, sn) {
    const g = byId('spaceDrawing');
    g.replaceChildren();
    path(g, [-1,1].map(k => project(0,k*2,0)), 'structure');
    path(g, [-1,1].map(k => project(0,0,k*1.8)), 'structure');
    label(g, project(0,2.2,0), 'z₁');
    label(g, project(0,0,1.95), 'z₂');
    const s = state.s;
    path(g, [[-1.7,-1.7],[1.7,-1.7],[1.7,1.7],[-1.7,1.7]].map(([x,y])=>project(s,x,y)), 'normal-plane', true);
    [-1,0,1].forEach(t => {
      path(g, [project(s,t,-1.7),project(s,t,1.7)], 'normal-grid');
      path(g, [project(s,-1.7,t),project(s,1.7,t)], 'normal-grid');
    });
    path(g, [project(-2.8,0,0),project(2.8,0,0)], 'center-axis');
    label(g, [42,319], 'C: the s-axis');
    path(g, [[119,308],project(-1.65,0,0)], 'structure');
    for (let t=-2;t<=2;t++) {
      const p = project(t,0,0);
      path(g, [[p[0],p[1]-4],[p[0],p[1]+4]], 'center-axis');
      label(g,[p[0]-5,p[1]+22],String(t),'small-label');
    }
    const base=project(s,0,0), point=project(s,state.rho*c,state.rho*sn);
    path(g, [project(s,-1.9*c,-1.9*sn),project(s,1.9*c,1.9*sn)], 'direction');
    path(g, [base,point], 'displacement');
    if (state.rho===0) dot(g,base,18,'halo');
    dot(g,base,5,'base-point');
    dot(g,point,8,'selected-point');
    label(g, [28,30], 'Dashed line: chosen normal direction','small-label');
    label(g, [28,350], state.rho===0 ? 'All directions reach the same point on C.' : 'Orange segment: signed normal displacement ρ.','small-label');
  }

  function drawCylinder() {
    const g=byId('cylinderDrawing');
    g.replaceChildren();
    // A fundamental domain: theta runs between two distinct cut faces.
    // Only their identification reverses rho; s is never reflected.
    const start=-Math.PI/2+.36, sweep=2*Math.PI-.72;
    const polar=(s,theta,t)=>{
      const phi=start+sweep*theta/180, r=1+.36*t;
      return [260+64*s+62*r*Math.cos(phi),174-10*s-80*r*Math.sin(phi)];
    };
    const curve=(s,t)=>Array.from({length:81},(_,i)=>polar(s,180*i/80,t));
    const annulus=s=>[...curve(s,1),...curve(s,-1).reverse()];
    const shape=(points,fill,opacity=1,stroke='none')=>{
      const el=path(g,points,'',true);
      el.setAttribute('fill',fill);el.setAttribute('fill-opacity',opacity);
      el.setAttribute('stroke',stroke);el.setAttribute('stroke-width','1');
      return el;
    };
    // Translucent outer and inner walls expose the moving cross-section.
    for(const t of [-1,1])for(let i=0;i<80;i++) {
      const a=180*i/80,b=180*(i+1)/80;
      shape([polar(-2.15,a,t),polar(2.15,a,t),polar(2.15,b,t),polar(-2.15,b,t)],'var(--teal)',t===1?.10:.07);
    }
    for(const s of [-2.15,2.15])shape(annulus(s),'var(--teal)',.16,'#91b7b0');
    for(const theta of [0,180]) {
      shape([polar(-2.15,theta,-1),polar(2.15,theta,-1),polar(2.15,theta,1),polar(-2.15,theta,1)],'#c6bba5',.22,'#b7ab93');
    }
    shape(annulus(state.s),'#e8b85b',.58,'#bd974a');
    const center=path(g,curve(state.s,0),'direction');
    center.setAttribute('stroke-width','2');
    // The two edges of this cross-section are joined with reversed width.
    const gold='#a96c00',purple='#7951a3';
    for(const [theta,t,color] of [[0,.78,gold],[180,-.78,gold],[0,-.78,purple],[180,.78,purple]]) {
      const p=polar(state.s,theta,t);
      make(g,'circle',{cx:p[0],cy:p[1],r:4.5,fill:color,stroke:'var(--card)','stroke-width':1.5});
    }
    for(const t of [-.78,.78]) {
      const a=polar(state.s,0,t), b=polar(state.s,180,-t);
      make(g,'path',{d:`M ${a[0]} ${a[1]} C ${a[0]+15} ${a[1]+28}, ${b[0]-15} ${b[1]+28}, ${b[0]} ${b[1]}`,class:'glue-arrow'});
    }
    const base=polar(state.s,state.theta,0),p=polar(state.s,state.theta,Math.tanh(state.rho));
    path(g,[polar(state.s,state.theta,-1),polar(state.s,state.theta,1)],'structure');
    path(g,[base,p],'displacement');
    dot(g,base,4,'base-point');dot(g,p,7,'selected-point');
    label(g,[24,28],'Cut faces: match gold to gold, purple to purple','small-label');
    label(g,[24,321],'At the cut: reverse ρ, keep s fixed.','small-label');
    label(g,[24,345],'After gluing, this slice is the Möbius strip →','small-label');
    byId('cylinderSvg').dataset.selectedS=clean(state.s);
    byId('cylinderSvg').dataset.displacement=String(Math.tanh(state.rho));
  }

  const geometry=window.AxisBlowupGeometry;
  const canvas=byId('mobiusSlice'), ctx=canvas.getContext('2d');
  const camera={yaw:-0.65,pitch:0.95};
  let circuitFinished=false;
  function rotate([x,y,z]) {
    const a=x*Math.cos(camera.yaw)-y*Math.sin(camera.yaw);
    const b=x*Math.sin(camera.yaw)+y*Math.cos(camera.yaw);
    return [a,b*Math.cos(camera.pitch)-z*Math.sin(camera.pitch),b*Math.sin(camera.pitch)+z*Math.cos(camera.pitch)];
  }
  function drawFiber() {
    const width=canvas.getBoundingClientRect().width;
    if(!width)return;
    const ratio=width/520, dpr=Math.min(devicePixelRatio||1,2);
    const pw=Math.round(width*dpr), ph=Math.round(width*370/520*dpr);
    if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
    ctx.setTransform(dpr*ratio,0,0,dpr*ratio,0,0);
    ctx.clearRect(0,0,520,370);
    const style=getComputedStyle(document.documentElement);
    const muted=style.getPropertyValue('--muted').trim();
    const teal=style.getPropertyValue('--teal').trim(), orange=style.getPropertyValue('--orange').trim();
    const paper=style.getPropertyValue('--card').trim();
    const project3=p=>{const [x,y,z]=rotate(p);return {x:260+85*x,y:177-85*y,z};};
    const items=[], triangles=[];
    const addLine=(a,b,color,width)=>items.push({kind:'line',points:[a,b],depth:(a.z+b.z)/2+.005,color,width});
    for(let i=0;i<112;i++)for(let j=0;j<18;j++) {
      const a=180*i/112,b=180*(i+1)/112;
      const lo=geometry.halfWidth*(-1+2*j/18),hi=geometry.halfWidth*(-1+2*(j+1)/18);
      const raw=[geometry.surface(a,lo),geometry.surface(b,lo),geometry.surface(b,hi),geometry.surface(a,hi)];
      const pts=raw.map(project3);
      const rotated=raw.map(rotate), u=rotated[1].map((v,k)=>v-rotated[0][k]),v=rotated[3].map((v,k)=>v-rotated[0][k]);
      const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      const light=Math.abs((normal[0]*.25+normal[1]*.45+normal[2]*.85)/Math.hypot(...normal));
      const edge=Math.abs((lo+hi)/(2*geometry.halfWidth));
      const alpha=.98*(1-Math.pow(edge,18));
      items.push({kind:'face',points:pts,depth:pts.reduce((s,p)=>s+p.z,0)/4,color:`hsla(42,55%,${48+26*light}%,${alpha})`});
      triangles.push([pts[0],pts[1],pts[2]],[pts[0],pts[2],pts[3]]);
    }
    for(let i=0;i<224;i++)addLine(project3(geometry.surface(180*i/224,0)),project3(geometry.surface(180*(i+1)/224,0)),teal,3);
    addLine(project3(geometry.surface(0,-.66)),project3(geometry.surface(0,.66)),'#89785d',1.5);
    for(const [t,color] of [[.78,'#a96c00'],[-.78,'#7951a3']]) {
      const p=project3(geometry.surface(0,t*geometry.halfWidth));
      items.push({kind:'dot',points:[p],depth:p.z+.025,color});
    }
    const span=.66;
    for(let i=0;i<48;i++)addLine(project3(geometry.surface(state.theta,-span+2*span*i/48)),project3(geometry.surface(state.theta,-span+2*span*(i+1)/48)),paper,1.5);
    const compressed=geometry.halfWidth*Math.tanh(state.rho);
    for(let i=0;i<32;i++)addLine(project3(geometry.surface(state.theta,compressed*i/32)),project3(geometry.surface(state.theta,compressed*(i+1)/32)),orange,3);
    items.sort((a,b)=>a.depth-b.depth);
    items.forEach(item=>{
      ctx.beginPath();ctx.moveTo(item.points[0].x,item.points[0].y);
      item.points.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
      if(item.kind==='dot'){ctx.arc(item.points[0].x,item.points[0].y,4.5,0,2*Math.PI);ctx.fillStyle=item.color;ctx.fill();ctx.strokeStyle=paper;ctx.lineWidth=1.5;ctx.stroke();}
      else if(item.kind==='face'){ctx.closePath();ctx.fillStyle=item.color;ctx.fill();}
      else{ctx.strokeStyle=item.color;ctx.lineWidth=item.width;ctx.stroke();}
    });
    const selected=project3(geometry.point(state.theta,state.rho));
    const hidden=triangles.some(([a,b,c])=>{
      const det=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);
      if(Math.abs(det)<1e-8)return false;
      const u=((b.y-c.y)*(selected.x-c.x)+(c.x-b.x)*(selected.y-c.y))/det;
      const v=((c.y-a.y)*(selected.x-c.x)+(a.x-c.x)*(selected.y-c.y))/det;
      const w=1-u-v;
      return u>=0&&v>=0&&w>=0&&u*a.z+v*b.z+w*c.z>selected.z+.035;
    });
    // Keep the point locatable when occluded, with an explicit far-side label.
    ctx.globalAlpha=hidden?.65:1;
    ctx.beginPath();ctx.arc(selected.x,selected.y,8,0,2*Math.PI);ctx.fillStyle=orange;ctx.fill();
    ctx.lineWidth=2;ctx.strokeStyle=paper;ctx.setLineDash(hidden?[3,3]:[]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
    canvas.dataset.point=JSON.stringify(geometry.point(state.theta,state.rho));
    canvas.dataset.selectedS=clean(state.s);
    canvas.dataset.occluded=String(hidden);
    const fontSize=parseFloat(style.getPropertyValue('--diagram-font-size'));
    ctx.font=`${style.getPropertyValue('--diagram-font-weight').trim()} ${fontSize/ratio}px ${style.getPropertyValue('--sans').trim()}`;
    ctx.fillStyle=muted;
    ctx.fillText(hidden?'Orange point on far side (shown through)':'Colored dots mark the joined edges',28,29);
    ctx.fillText('Which copy? Position along the axis',28,315);
    ctx.strokeStyle=style.getPropertyValue('--line').trim();ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(80,340);ctx.lineTo(440,340);ctx.stroke();
    ctx.textAlign='center';
    [-2,-1,0,1,2].forEach(s=>{const x=260+80*s;ctx.fillText(String(s),x,365);ctx.beginPath();ctx.moveTo(x,335);ctx.lineTo(x,345);ctx.stroke();});
    ctx.beginPath();ctx.arc(260+80*state.s,340,6,0,2*Math.PI);ctx.fillStyle=orange;ctx.fill();ctx.textAlign='left';
  }
  function render() {
    const theta=state.theta*Math.PI/180, c=Math.cos(theta), sn=Math.sin(theta);
    byId('locationOutput').textContent=clean(state.s);
    byId('directionOutput').textContent=`${Math.round(state.theta)}°`;
    byId('radiusOutput').textContent=clean(state.rho);
    byId('locationRange').value=state.s;
    byId('directionRange').value=state.theta;
    byId('radiusRange').value=state.rho;
    byId('approachButton').disabled=state.rho===0;
    const note=circuitFinished ? (state.rho===0 ? 'One circuit around the exceptional circle returns to the same point.' : 'Same normal line, opposite displacement. Follow another circuit to return.') : state.rho===0 ? 'Change θ: the axis point stays fixed while its lift travels around the central circle.' : 'Follow one circuit to see the twist; change s to select another copy.';
    if(byId('stateNote').textContent!==note) byId('stateNote').textContent=note;
    window.FigureMath.render(byId('pointReadout'),`(s,z_1,z_2)=(${clean(state.s)},${clean(state.rho*c)},${clean(state.rho*sn)})`);
    window.FigureMath.render(byId('directionReadout'),`(s,\\theta,\\rho)=(${clean(state.s)},${Math.round(state.theta)}^\\circ,${clean(state.rho)})`);
    drawSpace(c,sn);
    drawCylinder();
    drawFiber();
  }
  function stop() { if(animation!==null) cancelAnimationFrame(animation); animation=null; circuitFinished=false; }
  [['locationRange','s'],['directionRange','theta'],['radiusRange','rho']].forEach(([id,key])=>{
    byId(id).addEventListener('input',e=>{stop();state[key]=Number(e.target.value);render();});
  });
  byId('resetButton').addEventListener('click',()=>{stop();Object.assign(state,{s:.5,theta:35,rho:1.1});Object.assign(camera,{yaw:-.65,pitch:.95});render();});
  byId('circuitButton').addEventListener('click',()=>{
    stop();
    const start=performance.now(), initial={theta:state.theta,rho:state.rho};
    const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:5000;
    function frame(now) {
      const t=duration===0?1:Math.min(1,(now-start)/duration);
      const progress=t*t*(3-2*t);
      Object.assign(state,geometry.representative(initial.theta+180*progress,initial.rho));
      circuitFinished=t===1;
      render();
      animation=t<1?requestAnimationFrame(frame):null;
    }
    animation=requestAnimationFrame(frame);
  });
  let drag=null;
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});
  canvas.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    camera.yaw+=(e.clientX-drag.x)*.009;
    camera.pitch=Math.max(-1.5,Math.min(1.5,camera.pitch+(e.clientY-drag.y)*.009));
    drag={x:e.clientX,y:e.clientY,id:e.pointerId};drawFiber();
  });
  const endDrag=()=>{drag=null;};
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
  canvas.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
    e.preventDefault();
    if(e.key==='ArrowLeft')camera.yaw-=.15;
    if(e.key==='ArrowRight')camera.yaw+=.15;
    if(e.key==='ArrowUp')camera.pitch=Math.min(1.5,camera.pitch+.15);
    if(e.key==='ArrowDown')camera.pitch=Math.max(-1.5,camera.pitch-.15);
    drawFiber();
  });
  byId('approachButton').addEventListener('click',()=>{
    stop();
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) {state.rho=0;render();return;}
    const start=performance.now(), initial=state.rho;
    function frame(now) {
      const t=Math.min(1,(now-start)/1200);
      state.rho=t===1 ? 0 : initial*(1-t)*(1-t);
      render();
      animation=t<1 ? requestAnimationFrame(frame) : null;
    }
    animation=requestAnimationFrame(frame);
  });
  let lastHeight=0;
  function reportHeight() {
    const height=Math.ceil(document.querySelector('.figure-shell').getBoundingClientRect().height);
    if(height!==lastHeight) {lastHeight=height;window.parent.postMessage({type:'interactive-figure-height',height},window.location.origin);}
  }
  new ResizeObserver(reportHeight).observe(document.querySelector('.figure-shell'));
  new ResizeObserver(drawFiber).observe(canvas);
  // SVG viewBox text otherwise shrinks with its panel, unlike canvas labels.
  const labelObserver=new ResizeObserver(entries=>{
    const size=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--diagram-font-size'));
    entries.forEach(({target,contentRect})=>{
      if(contentRect.width)target.style.setProperty('--diagram-scaled-font-size',`${size*520/contentRect.width}px`);
    });
  });
  document.querySelectorAll('.axis-diagram').forEach(svg=>labelObserver.observe(svg));
  window.addEventListener('figure-math-rendered',reportHeight);
  render();
  reportHeight();
})();
