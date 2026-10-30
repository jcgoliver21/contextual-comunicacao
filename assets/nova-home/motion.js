'use strict';
// Progressive enhancement: content is visible unless a short entry animation is running.
(()=>{
  if(!('IntersectionObserver' in window))return;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const targets=[...document.querySelectorAll('[data-reveal]')];
  const seen=new WeakSet();
  const active=new Set();
  let observer=null;

  function showImmediately(element){
    seen.add(element);
    observer?.unobserve(element);
    element.classList.remove('is-entering');
    active.delete(element);
  }
  function stop(){
    observer?.disconnect();
    observer=null;
    for(const element of active)element.classList.remove('is-entering');
    active.clear();
  }
  function revealAnchor(){
    let id;
    try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
    const destination=id&&document.getElementById(id);
    if(!destination)return;
    for(const element of targets){
      if(destination.contains(element)||element.contains(destination))showImmediately(element);
    }
  }
  function start(){
    if(preference.matches||observer)return;
    observer=new IntersectionObserver(entries=>{
      if(!observer||preference.matches)return;
      for(const {target:element,isIntersecting} of entries){
        if(!isIntersecting||seen.has(element))continue;
        seen.add(element);
        observer?.unobserve(element);
        if(preference.matches||element.matches(':focus-within'))continue;
        active.add(element);
        element.classList.add('is-entering');
      }
    },{rootMargin:'0px 0px 48px 0px',threshold:0});
    revealAnchor();
    for(const element of targets){
      if(seen.has(element))continue;
      const box=element.getBoundingClientRect();
      // Keep the initial viewport and restored scroll position immediately readable.
      if(box.height>0&&box.top<innerHeight){seen.add(element);continue;}
      observer.observe(element);
    }
  }
  function finished(event){
    if(event.animationName!=='contextual-enter')return;
    event.target.classList.remove('is-entering');
    active.delete(event.target);
  }
  document.addEventListener('animationend',finished);
  document.addEventListener('animationcancel',finished);
  document.addEventListener('focusin',event=>{
    const element=event.target.closest('[data-reveal]');
    if(element)showImmediately(element);
  });
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link)return;
    let url;
    try{url=new URL(link.href);}catch{return;}
    if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
    let destination;
    try{destination=document.getElementById(decodeURIComponent(url.hash.slice(1)));}catch{return;}
    if(destination){
      for(const element of targets){
        if(destination.contains(element)||element.contains(destination))showImmediately(element);
      }
    }
  });
  addEventListener('hashchange',revealAnchor);
  addEventListener('beforeprint',stop);
  addEventListener('afterprint',start);
  preference.addEventListener('change',()=>preference.matches?stop():start());
  start();
})();
