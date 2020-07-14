//``````````  HAMBURGER ``````````// 

    // storing element into variable
    let $hamburger = window.document.querySelector('#hamburger-menu');
    let $navigation = window.document.querySelector('#navigation');
    let $navigationMenuList =  window.document.querySelector('#navigation__ul-listing');
   

    //creating a fucntion.
    function hamburgerClick(){
        console.log("test");
        $navigation.classList.toggle('navigation-onClick')
        $navigationMenuList.classList.toggle('navigation-ul-onclick')
    }
    $hamburger.addEventListener('click', hamburgerClick)