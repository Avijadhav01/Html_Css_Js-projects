let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-game");
let newgamebtn = document.querySelector("#new-game");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turno = true;
let count = 0;

const winpatterns =[
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [3, 4, 5],
    [2, 4, 6],
    [6, 7, 8],
];

const resetgame = ()=>{
    turno = true;
    count = 0;
    enableboxes();
    msgcontainer.classList.add("hide");
};

const enableboxes =() =>
{
    for(let box of boxes)
    {
        box.disabled = false;
        box.innerText =" ";
    }
};

boxes.forEach((box) => {
    let exe =()=>
        {
            if (turno == true)
            {
                //player0
                box.innerHTML= "<b>o</b>"
                turno = false;
            }
            else
            {
                //palyerx
                box.innerHTML= "<k>x</k>"
                turno = true;
            }
            box.disabled = true;//to disable the button
            count++;

            let iswinner = checkwinner();

            if(count===9 && !iswinner)
            {
                gamedraw();
            }
        };
    //event to be done
    box.addEventListener("click",exe);
});

const gamedraw =() =>
{
    msg.innerText = `Game Was draw`;
    msgcontainer.classList.remove("hide")
    disableboxes();
}

const disableboxes =() =>
{
    for(let box of boxes)
    {
        box.disabled = true;
    }
};

const checkwinner = () => {
    for (let pattern of winpatterns) {
      let pos1Val = boxes[pattern[0]].innerText;
      let pos2Val = boxes[pattern[1]].innerText;
      let pos3Val = boxes[pattern[2]].innerText;
  
      if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
        if (pos1Val === pos2Val && pos2Val === pos3Val) {
          showwinner(pos1Val);//argument for fun
          return true;
        }
      }
    }
  };

const showwinner =(winner)=> //parameter reference
{
    msg.innerText = `congratulations , winner is ${winner}`;
    msgcontainer.classList.remove("hide");
    disableboxes();
}






newgamebtn.addEventListener("click",resetgame)
resetbtn.addEventListener("click",resetgame)