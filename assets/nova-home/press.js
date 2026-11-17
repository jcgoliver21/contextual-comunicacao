'use strict';
(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.press-section').forEach(section=>{
    const track=section.querySelector('.press-track');
    const previous=section.querySelector('[data-press-prev]');
    const next=section.querySelector('[data-press-next]');
    const position=section.querySelector('[data-press-position]');
    const cards=[...track.children];
    let frame=0;
    function update(){
      const viewport=track.getBoundingClientRect();
      const shown=cards.map((card,i)=>({i,box:card.getBoundingClientRect()})).filter(({box})=>box.right>viewport.left+24&&box.left<viewport.right-24);
      if(shown.length){const first=shown[0].i+1,last=shown.at(-1).i+1;const label=(first===last?first:`${first}–${last}`)+` de ${cards.length}`;if(position.textContent!==label)position.textContent=label;}
      previous.disabled=track.scrollLeft<=2;
      next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;
      section.classList.toggle('press-all-visible',track.scrollWidth<=track.clientWidth+2);
      frame=0;
    }
    function move(direction){
      const step=(cards[1]?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth)||track.clientWidth;
      const count=Math.max(1,Math.floor((track.clientWidth+24)/step));
      track.scrollBy({left:direction*step*count,behavior:reduced.matches?'instant':'smooth'});
    }
    previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    track.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
    track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}if(event.key==='Home'||event.key==='End'){event.preventDefault();track.scrollTo({left:event.key==='Home'?0:track.scrollWidth,behavior:reduced.matches?'instant':'smooth'});}});
    new ResizeObserver(update).observe(track);
    update();
  });
  const dialog=document.querySelector('.press-video-dialog');
  const holder=dialog.querySelector('[data-press-player]');
  document.querySelectorAll('[data-press-video]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.pressVideo;if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
    document.querySelector('#press-video-title').textContent=button.dataset.videoTitle;
    dialog.querySelector('[data-press-video-link]').href='https://www.youtube.com/watch?v='+id;
    const iframe=document.createElement('iframe');iframe.title=button.dataset.videoTitle;iframe.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.allowFullscreen=true;holder.replaceChildren(iframe);dialog.showModal();document.body.classList.add('dialog-open');
  }));
  dialog.querySelector('[data-press-video-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{holder.replaceChildren();document.body.classList.remove('dialog-open');});
})();
