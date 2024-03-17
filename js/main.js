// import {data} from './data.js';
history.scrollRestoration = "manual";
// history.scrollRestoration = "auto";

//load
// let bodyElem;
let loaderElem;
let date;
let currentYear;
//mobile menu
let menu;
let btnClose;
let gnbLinks; 
//Publiching Section
let currentPanelElem;
let currentIndex;
let panelItemElems;
let observerElems;
let panelListElem;
let panelsElem;
let numberOfPanels = 8;//패널 개수
let panelSize = 300;//패널 크기(width)
let unitRadian = 2*Math.PI / numberOfPanels;
let unitDegree = 360 / numberOfPanels;
//scroll
let prevPageYOffset;
let scrollDirection;

function setElems() {
    //loader
    // bodyElem = document.querySelector('body');
    loaderElem = document.querySelector('.loader-wrapper');
    //current Year
    date = new Date();
    currentYear = document.querySelector('.current-year');
    //mobile menu
    menu = document.querySelector('.menu');
    btnClose = document.querySelector('.close');
    gnbLinks = document.querySelectorAll('.gnb-m li');
    //Profile
    profile = document.querySelector('.profile');
    //Publiching Section
    panelItemElems = document.querySelectorAll('.panel-item');
    observerElems = document.querySelectorAll('.observer-ready');
    panelListElem = document.querySelector('.panel-list');
    panelsElem = document.querySelector('.panels');
}
function setPanelItems() {
    const dist = (panelSize / 2) / Math.tan(unitRadian / 2) + (panelSize) * 0.65;
    for(let i = 0;i < panelItemElems.length; i++) {
        panelItemElems[i].style.transform = `rotateY(${unitDegree * i}deg) translateZ(${-dist}px)`;
       
    }
}
function inactivatePanel() {
    if(currentPanelElem){
        currentPanelElem.classList.remove('active');
    }
}
function setCurrentPanel() {
    inactivatePanel();
    currentPanelElem = panelItemElems[currentIndex];
    currentPanelElem.classList.add('active');
}
function rotatePanel() {
    panelListElem.style.transform = `translateZ(${numberOfPanels * 100}px) rotateY(${-unitDegree * currentIndex}deg)`;
    setCurrentPanel();
}
function replacePanel() {
    panelListElem.style.transform = `translateZ(0px) rotateY(0deg)`;
}
function bodyNoClass(){
    document.body.classList.remove('active');
}


window.addEventListener('load', () => {
    setElems();
    // function preventScroll(e) {
    //     e.preventDefault();
    //   }
    // bodyElem.addEventListener('wheel', preventScroll, { passive: false });
    //load
    loaderElem.addEventListener('transitionend', e => {
        e.currentTarget.remove();
        // bodyElem.removeEventListener('wheel', preventScroll, { passive: false });
    })
    document.body.classList.remove('before-load');

    //menu  - current year
    currentYear.innerHTML = date.getFullYear();

    //mobile menu
    menu.addEventListener('click', () => {
        document.body.classList.add('active');
    })
    btnClose.addEventListener('click', () => {
        bodyNoClass();
    })
    gnbLinks.forEach(function(gnbLink){
        gnbLink.addEventListener('click', () => {
            bodyNoClass();
        })
    })
    if(window.innerWidth > 1280) {
        bodyNoClass();  
    }
    window.addEventListener('resize', function() {
        if(window.innerWidth >= 1280) {
            bodyNoClass();
        }
    })
    //Publiching Section
    setPanelItems();

    //Publiching Section / IntersectionObserver
    const io = new IntersectionObserver((entries, observer) => {
        for(let i = 0; i < entries.length; i++){
            if(entries[i].isIntersecting) {
                if(entries[i].target.classList.contains('content-observer-start')){
                    currentIndex = 0;
                    rotatePanel();
                    continue;
                }
                let projectIndex = entries[i].target.dataset.projectIndex*1;
                if(projectIndex >= 0){
                    if(scrollDirection == 'up') {
                        currentIndex = projectIndex + 1;
                    }else {
                        currentIndex = projectIndex;
                    }
                    if(currentIndex < numberOfPanels){
                        rotatePanel();
                    }
                }
                if(scrollDirection === 'down' && entries[i].target.classList.contains('show')){
                    panelsElem.classList.add('active');
                }
                if(scrollDirection === 'down' && entries[i].target.classList.contains('panel-item')){
                    panelsElem.classList.add('active');
                }
                if(scrollDirection === 'down' && entries[i].target.classList.contains('content-observer-end')){
                    panelsElem.classList.add('static-position');
                }
                if(scrollDirection === 'up' && currentIndex === numberOfPanels - 1){
                    panelsElem.classList.remove('static-position');
                }
            }else {
                if(scrollDirection === 'up' && entries[i].target.classList.contains('project-1')){
                    replacePanel();
                    inactivatePanel();
                }
                if(scrollDirection === 'up' && entries[i].target.classList.contains('show')){
                    panelsElem.classList.remove('active');
                }
            }
        }
    });
    observerElems.forEach((item, i) => {
        io.observe(item);
    });

    
    window.addEventListener('scroll', () => {
        if(prevPageYOffset > window.pageYOffset) {
            scrollDirection = 'up'; 
        }else {
            scrollDirection = 'down';
        }
        prevPageYOffset = window.pageYOffset;
    })

})
