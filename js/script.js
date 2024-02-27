
function stagesCaoruselInit(pageIn) {

    let left = document.getElementById("stages-prev-btn");
    let right = document.getElementById("stages-next-btn");
    let carusel = document.getElementById("stages-cards");
    let dots = document.getElementById("stages-dots");

    left.addEventListener("click", clickLeft);
    right.addEventListener("click", clickRight);

    const caruselElem = 5;
    countCardsOnPage=1;

    const numOfPage = caruselElem/countCardsOnPage;
    let currentPage = 1;
    setDisabled();


    function goToPage(page) {
        if (page) {
            carusel.style.transform = `translateX(-` + (((page - 1) * 100) - 100) + `vw)`;
            currentPage = page-1;
            setDisabled()
        }
    }

    //Если используются точки для навигации
    if (pageIn) goToPage(pageIn);


    function makeDots() {
        dots.innerHTML = '';
        for(i=0;i<numOfPage;i++)
        {
            if (i+1 == currentPage) dots.innerHTML = dots.innerHTML + `<span class="nav__text_accent">&#8226;</span>`;
            else dots.innerHTML = dots.innerHTML + `<a href="javascript:stagesCaoruselInit(`+(i+2)+`)">&#8226;</a>`;
        }
    }


    function clickLeft() {


        if (currentPage != 1) {
            carusel.style.transform = `translateX(-` + (((currentPage - 1) * 100) - 100) + `vw)`;
            currentPage--;
            setDisabled();
        }
    }

        function clickRight() {

            if (currentPage < numOfPage) {
                carusel.style.transform = `translateX(-`+100*currentPage+`vw)`;
                currentPage++;
                setDisabled();
            }
        }

        function setDisabled() {
            left.classList.remove('nav__btn_disabled');
            right.classList.remove('nav__btn_disabled');

            if (currentPage == 1)
            {
                left.classList.add('nav__btn_disabled');
                right.classList.remove('nav__btn_disabled');

            }
            if (currentPage == numOfPage)
            {
                right.classList.add('nav__btn_disabled');
                left.classList.remove('nav__btn_disabled');
            }
            makeDots();
        }



}










function carouselInit () {
    let left = document.getElementById("members-prev-btn");
    let right = document.getElementById("members-next-btn");
    let carusel = document.getElementById("members-cards");

    let currentCardElement = document.getElementById("members-currentCard");
    let allCardsElement = document.getElementById("members-allCards");

    left.addEventListener("click", clickLeft);
    right.addEventListener("click", clickRight);

    const caruselElem = 6;
    allCardsElement.innerText = caruselElem;
    let countCardsOnPage = 0;

    if(Number(window.innerWidth) >= 400) countCardsOnPage=3;
    else countCardsOnPage=1;


    const numOfPage = caruselElem/countCardsOnPage;
    let currentPage = 1;
    setDisabled();


    loop();

    function clickLeft() {

        if (currentPage != 1) {
            carusel.style.transform = `translateX(-`+(((currentPage-1)*89)-89)+`vw)`;
            currentPage--;
            setDisabled();
        }
    }

    function clickRight() {

        if (currentPage < numOfPage) {
            carusel.style.transform = `translateX(-`+89*currentPage+`vw)`;
            currentPage++;
            setDisabled();
        }
    }

     function setDisabled() {
         currentCardElement.innerText = currentPage*countCardsOnPage;
         left.classList.remove('nav__btn_disabled');
         right.classList.remove('nav__btn_disabled');

         if (currentPage == 1)
         {
             left.classList.add('nav__btn_disabled');
             right.classList.remove('nav__btn_disabled');
         }
         if (currentPage == numOfPage)
         {
             right.classList.add('nav__btn_disabled');
             left.classList.remove('nav__btn_disabled');
         }
     }

     function loop() {
         let timerId = setInterval(() => {
             clickRight();
             if (currentPage == numOfPage) currentPage=0;


         }, 4000);
     }

}