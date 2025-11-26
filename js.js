(function(){
  const thumbs=Array.from(document.querySelectorAll('.thumb'));
  const lightbox=document.getElementById('lightbox');
  const lbImage=document.getElementById('lbImage');
  const lbTitle=document.getElementById('lbTitle');
  const lbDesc=document.getElementById('lbDesc');
  const lbClose=document.getElementById('lbClose');
  const moreBtn=document.getElementById('moreBtn');

  function createPreviewFromThumb(thumb){
    const imgEl=thumb.querySelector('img');
    if(imgEl){
      const preview=new Image();
      preview.className='lightbox-preview-img';
      preview.alt=imgEl.alt||'';
      const large=thumb.dataset.large||imgEl.src;
      preview.src=large;
      preview.addEventListener('error',function onErr(){
        preview.removeEventListener('error',onErr);
        preview.src=imgEl.src;
      });
      return preview;
    }
    const svg=thumb.querySelector('svg');
    if(svg){
      const clone=svg.cloneNode(true);
      clone.setAttribute('width','100%');
      clone.setAttribute('height','100%');
      clone.style.maxHeight='460px';
      clone.style.objectFit='contain';
      return clone;
    }
    return document.createTextNode('');
  }

  function openLightbox(thumb){
    lbImage.innerHTML='';
    const title=thumb.dataset.title||thumb.querySelector('.thumb-caption')?.textContent||'';
    const desc=thumb.dataset.desc||'';
    const preview=createPreviewFromThumb(thumb);
    lbImage.appendChild(preview);
    lbTitle.textContent=title;
    lbDesc.textContent=desc;
    lightbox.setAttribute('aria-hidden','false');
    lbClose.focus();
    document.addEventListener('keydown',onKeyDown);
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbImage.innerHTML='';
    lbTitle.textContent='';
    lbDesc.textContent='';
    document.removeEventListener('keydown',onKeyDown);
  }

  function onKeyDown(e){
    if(e.key==='Escape') closeLightbox();
  }

  thumbs.forEach(t=>{
    t.addEventListener('click',()=>openLightbox(t));
    t.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLightbox(t); }
    });
  });

  if(lbClose) lbClose.addEventListener('click',closeLightbox);
  if(lightbox) lightbox.addEventListener('click',e=>{ if(e.target===lightbox) closeLightbox(); });
  if(moreBtn) moreBtn.addEventListener('click',()=>{ const gallery=document.querySelector('.gallery'); if(gallery) gallery.scrollIntoView({behavior:'smooth',block:'start'}); });
  thumbs.forEach(t=>{ t.setAttribute('role','button'); t.setAttribute('aria-pressed','false'); });

  const galleryThumbs=Array.from(document.querySelectorAll('.gallery-thumb'));
  const galleryModalEl=document.getElementById('galleryModal');
  const galleryInner=document.getElementById('galleryInner');

  function buildCarousel(startIndex){
    galleryInner.innerHTML='';
    const items=Array.from(document.querySelectorAll('#studentGallery .gallery-thumb'));
    items.forEach((imgEl,i)=>{
      const div=document.createElement('div');
      div.className='carousel-item';
      if(i===startIndex) div.classList.add('active');
      const img=document.createElement('img');
      img.src=imgEl.src;
      img.alt=imgEl.alt||'';
      img.className='d-block w-100';
      div.appendChild(img);
      galleryInner.appendChild(div);
    });
    const carouselEl=document.getElementById('galleryCarousel');
    return new bootstrap.Carousel(carouselEl,{interval:false});
  }

  galleryThumbs.forEach((gt)=>{
    gt.addEventListener('click',()=>{
      const items=Array.from(document.querySelectorAll('#studentGallery .gallery-thumb'));
      const idx=items.indexOf(gt);
      buildCarousel(idx);
      const gm=new bootstrap.Modal(galleryModalEl);
      gm.show();
    });
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      const openModals=document.querySelectorAll('.modal.show');
      openModals.forEach(m=>{bootstrap.Modal.getInstance(m)?.hide();});
    }
  });
})();