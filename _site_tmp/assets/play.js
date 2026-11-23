
const steps=['agent → request','validate targets + contract','apply ops atomically','verify post-conditions','emit certificate + journal'];
const box=document.querySelector('.flow'),run=document.getElementById('run'),cert=document.querySelector('.cert'),resp=document.getElementById('resp');
steps.forEach((s,i)=>{const d=document.createElement('div');d.className='fstep';d.innerHTML='<span class="n">'+String(i+1).padStart(2,'0')+'</span>'+s;box.appendChild(d)});
run.addEventListener('click',()=>{
  run.disabled=true;cert.classList.remove('show');resp.textContent='';
  const els=[...document.querySelectorAll('.fstep')];els.forEach(e=>e.classList.remove('on'));
  let i=0;const t=setInterval(()=>{
    els[i].classList.add('on');
    if(++i===els.length){clearInterval(t);setTimeout(()=>{
      cert.classList.add('show');
      resp.textContent=JSON.stringify({ok:true,applied:1,certificate:{touched:["e12"],untouched_changed:[],render_diff_zones:[{page:0,rect:[50,120,300,140]}]},journal_entry:{seq:7,chain_prev:"blake3:0c19…"}},null,2);
      run.disabled=false;run.textContent='re-run transaction';
    },450)}
  },520);
});
