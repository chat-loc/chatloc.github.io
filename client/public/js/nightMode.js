/*// storing element into variable
let $moon = window.document.querySelector('#moon');
let $sun = window.document.querySelector('#sun');

//chat message color
let $oldMessage = window.document.querySelector('#old-messages');
//enter message inputbox
let $txt = window.document.querySelector('#txt');
//click on send button
let $send = window.document.querySelector('.button-send-message');


//creating a fucntion to switch b/w theme
function checkclick(){
    document.body.classList.toggle('dark');
    $oldMessage.classList.toggle('dark-mode-bg-color');
    $txt.classList.toggle('msgTextbox-dark-mode');
    $txt.classList.toggle('on-click-placeholder');
    
    $send.classList.toggle('button-send-message-dark-mode');
   
    $sun.classList.toggle('displaysun');
    $moon.classList.toggle('hidden');
}
$moon.addEventListener('click', checkclick)
$sun.addEventListener('click', checkclick)*/