'use strict';
// Homepage carousel: one timer, manual controls, and automatic interaction pauses.
const heroCarousel=document.querySelector('.hero-carousel');
if(heroCarousel){
  const slides=[...heroCarousel.querySelectorAll('.hero-slide')];
  const dots=[...heroCarousel.querySelectorAll('[data-slide]')];
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0;
  let hovered=false;
  let focusInside=false;
  let inView=true;
  let timer;
  function schedule(){
    clearTimeout(timer);
    const running=!motion.matches&&!hovered&&!focusInside&&inView&&!document.hidden&&!document.querySelector('dialog[open]');
    heroCarousel.dataset.rotation=running?'running':'paused';
    if(running)timer=setTimeout(()=>{show(current+1,false);schedule();},8000);
  }
  function show(index,manual){
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===current);slide.setAttribute('aria-hidden',String(i!==current));slide.inert=i!==current;});
    dots.forEach((dot,i)=>{if(i===current)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
    heroCarousel.querySelector('[data-slide-current]').textContent=String(current+1).padStart(2,'0');
    if(manual){heroCarousel.querySelector('#banner-status').textContent=`Banner ${slides[current].getAttribute('aria-label')}`;schedule();}
  }
  heroCarousel.querySelector('.hero-previous').addEventListener('click',()=>show(current-1,true));
  heroCarousel.querySelector('.hero-next').addEventListener('click',()=>show(current+1,true));
  dots.forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.slide),true)));
  heroCarousel.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1),true);}});
  heroCarousel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;schedule();}});
  heroCarousel.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse'){hovered=false;schedule();}});
  heroCarousel.addEventListener('focusin',()=>{focusInside=true;schedule();});
  heroCarousel.addEventListener('focusout',event=>{if(!heroCarousel.contains(event.relatedTarget)){focusInside=false;schedule();}});
  document.addEventListener('visibilitychange',schedule);
  document.querySelectorAll('.product-dialog').forEach(dialog=>dialog.addEventListener('close',schedule));
  motion.addEventListener('change',schedule);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(heroCarousel);
  let touchStart=null;
  heroCarousel.querySelector('.hero-slides').addEventListener('pointerdown',event=>{if(event.pointerType==='touch'&&!event.target.closest('a,button'))touchStart={x:event.clientX,y:event.clientY};},{passive:true});
  heroCarousel.querySelector('.hero-slides').addEventListener('pointerup',event=>{if(!touchStart)return;const dx=event.clientX-touchStart.x;const dy=event.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(current+(dx<0?1:-1),true);},{passive:true});
  heroCarousel.querySelector('.hero-slides').addEventListener('pointercancel',()=>{touchStart=null;});
  schedule();
}
const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.site-nav');
const closeMenu=()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('is-open');};
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
matchMedia('(min-width: 1061px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.querySelectorAll('.service-toggle').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));document.getElementById(button.getAttribute('aria-controls')).hidden=!open;}));
document.querySelectorAll('[data-dialog]').forEach(button=>button.addEventListener('click',()=>{const dialog=document.getElementById(button.dataset.dialog);dialog.showModal();document.body.classList.add('dialog-open');}));
document.querySelectorAll('.product-dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});});
const interest=document.querySelector('#interesse');
document.querySelectorAll('[data-interest]').forEach(button=>button.addEventListener('click',()=>{const dialog=button.closest('dialog');dialog?.close();interest.value=button.dataset.interest;document.querySelector('#contato').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});requestAnimationFrame(()=>document.querySelector('#nome').focus({preventScroll:true}));}));
const filters=[...document.querySelectorAll('[data-filter]')];
const cases=[...document.querySelectorAll('[data-category]')];
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));let count=0;cases.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});document.querySelector('#filter-status').textContent=count===1?'1 trabalho nesta seleção.':`${count} trabalhos nesta seleção.`;}));
const form=document.querySelector('#briefing-form');
let preparedBriefing='';
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);preparedBriefing=`Olá, Contextual! Gostaria de conversar sobre um projeto.\n\nNome: ${String(data.get('nome')||'').trim()}\nE-mail: ${String(data.get('email')||'').trim()}\nEmpresa: ${String(data.get('empresa')||'').trim()}\nInteresse: ${String(data.get('interesse')||'').trim()}\n\nDesafio:\n${String(data.get('mensagem')||'').trim()}\n\nAutorizei o contato sobre esta solicitação.`;document.querySelector('.form-feedback').hidden=false;document.querySelector('#form-status').textContent='Briefing preparado. Conclua o envio no seu aplicativo de e-mail ou copie o texto para enviar à Contextual.';const subject=`Vamos conversar — ${String(data.get('interesse')||'Novo projeto')}`;window.location.href=`mailto:carla@contextualcomunicacao.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedBriefing)}`;});
document.querySelector('#copy-briefing').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(preparedBriefing);document.querySelector('#form-status').textContent='Briefing copiado. Envie para carla@contextualcomunicacao.com.br no seu aplicativo de e-mail.';}catch{document.querySelector('#form-status').textContent='Não foi possível copiar automaticamente. Use o aplicativo de e-mail ou escreva para carla@contextualcomunicacao.com.br.';}});
