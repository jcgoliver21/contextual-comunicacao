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
const blogSearch=document.querySelector('#article-search');
if(blogSearch){
  const cards=[...document.querySelectorAll('[data-article-card]')];
  const page=Number(document.querySelector('[data-archive-page]').dataset.archivePage);
  const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  blogSearch.addEventListener('input',()=>{const query=normalize(blogSearch.value.trim());let count=0;cards.forEach(card=>{card.hidden=query?!normalize(card.dataset.search).includes(query):Number(card.dataset.page)!==page;if(!card.hidden)count++;});document.querySelector('#archive-results').textContent=`${count} ${count===1?'artigo encontrado':'artigos encontrados'}.`;document.querySelector('#archive-empty').hidden=count>0;document.querySelectorAll('.pagination').forEach(item=>item.hidden=!!query);});
}
const sectorFilter=document.querySelector('#client-sector');
if(sectorFilter)sectorFilter.addEventListener('change',()=>{let count=0;document.querySelectorAll('[data-client-sector]').forEach(group=>{group.hidden=!!sectorFilter.value&&group.id!==sectorFilter.value;if(!group.hidden)count++;});document.querySelector('#client-status').textContent=`${count} ${count===1?'segmento exibido':'segmentos exibidos'}.`;});
const gallery=document.querySelector('.gallery-dialog');
if(gallery){
  const items=[...document.querySelectorAll('a[data-gallery]')];let selected=0;
  function displayImage(index){selected=(index+items.length)%items.length;const item=items[selected];gallery.querySelector('img').src=item.href;gallery.querySelector('img').alt=item.querySelector('img')?.alt||'Imagem do portfólio';gallery.querySelector('[data-gallery-caption]').textContent=`${selected+1} / ${items.length} — ${item.querySelector('img')?.alt||'Portfólio Contextual'}`;gallery.querySelector('[data-gallery-original]').href=item.href;}
  items.forEach((item,index)=>item.addEventListener('click',event=>{event.preventDefault();displayImage(index);gallery.showModal();document.body.classList.add('dialog-open');}));
  gallery.querySelector('.gallery-close').addEventListener('click',()=>gallery.close());
  gallery.querySelector('.gallery-prev').addEventListener('click',()=>displayImage(selected-1));gallery.querySelector('.gallery-next').addEventListener('click',()=>displayImage(selected+1));
  gallery.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();displayImage(selected+(event.key==='ArrowRight'?1:-1));}});
  gallery.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
}
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.video;if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;const iframe=document.createElement('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;iframe.title='Vídeo do portfólio da Contextual';iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.allowFullscreen=true;button.replaceWith(iframe);}));
const briefing=document.querySelector('#briefing-form');
if(briefing){
  const select=briefing.querySelector('#interesse');const preset=new URLSearchParams(location.search).get('interesse');if(preset&&[...select.options].some(option=>option.value===preset))select.value=preset;
  let message='';
  briefing.addEventListener('submit',event=>{event.preventDefault();if(!briefing.reportValidity())return;const data=new FormData(briefing);message=`Olá, Contextual! Gostaria de conversar sobre um projeto.\n\nNome: ${data.get('nome')}\nE-mail: ${data.get('email')}\nEmpresa: ${data.get('empresa')||''}\nInteresse: ${data.get('interesse')}\n\nDesafio:\n${data.get('mensagem')||''}\n\nAutorizei o contato sobre esta solicitação.`;briefing.querySelector('.form-feedback').hidden=false;briefing.querySelector('#form-status').textContent='Briefing preparado. Conclua o envio no seu aplicativo de e-mail ou copie a mensagem.';location.href=`mailto:carla@contextualcomunicacao.com.br?subject=${encodeURIComponent('Vamos conversar — '+data.get('interesse'))}&body=${encodeURIComponent(message)}`;});
  briefing.querySelector('#copy-briefing').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message);briefing.querySelector('#form-status').textContent='Briefing copiado. Envie para carla@contextualcomunicacao.com.br.';}catch{let fallback=briefing.querySelector('.form-copy-fallback');if(!fallback){fallback=document.createElement('textarea');fallback.className='form-copy-fallback';fallback.readOnly=true;fallback.setAttribute('aria-label','Briefing preparado para copiar');briefing.querySelector('.form-feedback').append(fallback);}fallback.value=message;fallback.focus();fallback.select();briefing.querySelector('#form-status').textContent='Selecione e copie a mensagem abaixo para enviar por e-mail.';}});
}
