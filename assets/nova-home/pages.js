'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.site-nav');
function closeNavigation(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');navigation.classList.remove('is-open');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');navigation.classList.toggle('is-open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeNavigation));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeNavigation();menuButton.focus();}});
matchMedia('(min-width:1061px)').addEventListener('change',event=>{if(event.matches)closeNavigation();});
const shareButtons=[...document.querySelectorAll('[data-copy-link]')];
shareButtons.forEach(button=>button.addEventListener('click',async()=>{
  const address=document.querySelector('link[rel=canonical]').href;
  const feedback=document.querySelector('#share-status');
  try{await navigator.clipboard.writeText(address);feedback.textContent='Link do artigo copiado.';}
  catch{const fallback=document.querySelector('#share-fallback');fallback.hidden=false;fallback.querySelector('input').value=address;fallback.querySelector('input').focus();fallback.querySelector('input').select();feedback.textContent='Selecione e copie o endereço do artigo abaixo.';}
}));
const readingBody=document.querySelector('.article-body');
const progress=document.querySelector('.reading-progress');
if(readingBody&&progress){
  function updateProgress(){const top=readingBody.getBoundingClientRect().top+scrollY;const distance=Math.max(1,readingBody.offsetHeight-innerHeight*.35);const percent=Math.min(100,Math.max(0,(scrollY-top+innerHeight*.35)/distance*100));progress.style.width=`${percent}%`;}
  addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
  const sections=[...readingBody.querySelectorAll('section[id]')];
  const contentsLinks=[...document.querySelectorAll('.article-toc a')];
  function updateContents(){let active=sections[0]?.id;for(const section of sections){if(section.getBoundingClientRect().top<=innerHeight*.4)active=section.id;}contentsLinks.forEach(link=>{if(link.getAttribute('href')===`#${active}`)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});}
  addEventListener('scroll',updateContents,{passive:true});addEventListener('resize',updateContents);updateContents();
}
