let showpass = document.querySelector(".togglepass")

showpass.addEventListener("click",()=>{
    let passInput = document.querySelector(".pass");

    if(showpass.checked){
        passInput.type = "text";
    }
    else{
        passInput.type = "password";
    }
})

