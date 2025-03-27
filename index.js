import{i as c,a as g}from"./assets/vendor-CBLHhzjb.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))d(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&d(u)}).observe(document,{childList:!0,subtree:!0});function t(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerPolicy&&(s.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?s.credentials="include":e.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function d(e){if(e.ep)return;e.ep=!0;const s=t(e);fetch(e.href,s)}})();const p=document.querySelector(".gallery"),h=document.querySelector(".form"),b=document.querySelector("input[name='search-text']"),i=document.querySelector(".load-more"),a=document.querySelector(".loader"),w="33475610-696620aeee3e1938961deeefe",L="https://pixabay.com/api/";let n=1,l="",m=0;i.style.display="none";a.style.display="none";async function y(o,r){try{const t=await g.get(L,{params:{key:w,q:o,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:15,page:r}});return m=t.data.totalHits,t.data.hits}catch(t){return console.error("Error fetching images:",t),c.error({title:"Error",message:"Failed to fetch images. Please try again later.",position:"topRight",timeout:5e3}),[]}}function f(o){const r=o.map(t=>`
      <li class="gallery-item">
        <a href="${t.largeImageURL}" target="_blank">
          <img src="${t.webformatURL}" alt="${t.tags}" width="300"/>
        </a>
        <div class="info">
          <p><b>Likes:</b> ${t.likes}</p>
          <p><b>Views:</b> ${t.views}</p>
          <p><b>Comments:</b> ${t.comments}</p>
          <p><b>Downloads:</b> ${t.downloads}</p>
        </div>
      </li>`).join("");p.insertAdjacentHTML("beforeend",r)}function v(){const o=document.querySelector(".gallery-item");if(o){const r=o.getBoundingClientRect().height;window.scrollBy({top:r*2,behavior:"smooth"})}}h.addEventListener("submit",async o=>{if(o.preventDefault(),l=b.value.trim(),n=1,!l){c.warning({title:"Warning",message:"Please enter a search term.",position:"topRight",timeout:5e3});return}p.innerHTML="",i.style.display="none",a.style.display="block";const r=await y(l,n);if(a.style.display="none",r.length===0){c.warning({title:"Warning",message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight",timeout:5e3});return}f(r),i.style.display="block"});i.addEventListener("click",async()=>{n+=1,a.style.display="block";const o=await y(l,n);a.style.display="none",f(o),v(),n*15>=m&&(i.style.display="none",c.info({title:"Info",message:"We're sorry, but you've reached the end of search results.",position:"topRight",timeout:5e3}))});
//# sourceMappingURL=index.js.map
