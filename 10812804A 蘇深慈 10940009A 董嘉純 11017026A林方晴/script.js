/*Sticky nav bar*/
//當滾動的垂直位移大於 0 時，將在 header 元素上切換 sticky 類別。
window.addEventListener('scroll',function(){
    let header=document.querySelector('header');
    header.classList.toggle('sticky',window.scrollY>0);
});

