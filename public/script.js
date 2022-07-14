let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth-110;
canvas.height = 580;
let ctx = canvas.getContext("2d");
let defaultBackgrdColor = "white";
ctx.fillStyle=defaultBackgrdColor;
ctx.fillRect(0,0,canvas.width,canvas.height);

var io = io.connect("http://localhost:8080")

let drawColor = "black";
let drawWidth = "2";
let drawnData=[];
let x, y, ctxIndex=-1; 
let mouseDown = false;

window.onmousedown = (e) =>{
    ctx.strokeStyle=drawColor;
    ctx.lineWidth=drawWidth;
    // ctx.beginPath();
    ctx.moveTo(x-canvas.offsetLeft,y-canvas.offsetTop);
    io.emit('down',{x : x-canvas.offsetLeft, y : y-canvas.offsetTop, color : drawColor, width : drawWidth});
    mouseDown = true;
}
window.onmouseup = (e) =>{
    // ctx.closePath();
    mouseDown = false;
    // drawnData.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    // ctxIndex+=1;
    io.emit('save',ctx.getImageData(0, 0, canvas.width, canvas.height));
    // console.log(drawnData);
}

io.on('ondraw' ,({x , y, color, width}) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    // ctx.lineCap = "round";
    // ctx.lineJoin = "round";
    ctx.lineTo(x,y);
    ctx.stroke();
})

io.on('ondown' ,({x, y, color, width}) => {
    ctx.strokeStyle=color;
    ctx.lineWidth=width;
    // ctx.beginPath();
    ctx.moveTo(x,y);
})

io.on('onclear',() =>{
    ctx.fillStyle = defaultBackgrdColor;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(0,0,canvas.width,canvas.height);
})

io.on('onsave', (data) => {
    // for(let index=0 ; index<data.length ; index++){
        ctx.putImageData(data, 0, 0);;
    // }
    // console.log(drawnData);
    // drawnData.push(data);
})

// io.on('setup', () =>{
//     if(ctxIndex>=0){
//         console.log(drawnData);
//         ctx.putImageData(drawnData[ctxIndex], 0, 0);
//     }
// })

window.onmousemove = (e) =>{
    x = e.clientX;
    y = e.clientY;

    if(mouseDown){
        ctx.strokeStyle=drawColor;
        ctx.lineWidth=drawWidth;
        // ctx.beginPath()  ;
        // ctx.lineCap = "round";
        // ctx.lineJoin = "round";
        io.emit('draw', {x : x-canvas.offsetLeft, y : y-canvas.offsetTop, color : drawColor, width : drawWidth});
        ctx.lineTo((x - canvas.offsetLeft) , (y-canvas.offsetTop));
        ctx.stroke();
    }
    // e.preventDefault
}

function openNav() {
    document.getElementById("mySidenav").style.display = "block";
    document.getElementById("openButton").style.visibility="hidden";
  }
  
function closeNav() {
    document.getElementById("mySidenav").style.display = "none";
    document.getElementById("openButton").style.visibility = "visible";
}

function clearCanvas(){
    ctx.fillStyle = defaultBackgrdColor;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(0,0,canvas.width,canvas.height);
    io.emit('clear');
}

function changeColor(color){
    drawColor=color;
}   