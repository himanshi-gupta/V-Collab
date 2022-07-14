let express = require("express");
let app = express();
let httpServer = require("http").createServer(app);
let io = require("socket.io")(httpServer);

/* Socket setup */
let connections = [];
let drawnData=[];
let ctxIndex=-1;

io.on("connect" , (socket) => {
    connections.push(socket);   
    console.log(`${socket.id} has connected`); 

    connections.forEach(con =>{
        if(con.id == socket.id){
            if(drawnData.length>0)
                con.emit('onsave', drawnData[ctxIndex]);
                // for(let index=0 ; index<drawnData.length ; index++){
                //     if(drawnData[index][0]=='down')
                //         con.emit('ondown',{x : drawnData[index][1] , y : drawnData[index][2] , color : drawnData[index][3] , width : drawnData[index][4]});
                //     else
                //         con.emit("ondraw" , {x : drawnData[index][1] , y : drawnData[index][2], color : drawnData[index][3] , width : drawnData[index][4]});
                }
        }
    )
    
    socket.on('draw' , (data) => {
        // drawnData.push(['draw', data.x, data.y, data.color, data.width]);
        connections.forEach(con =>{
            if(con.id !==socket.id){
                con.emit("ondraw" , {x : data.x , y : data.y, color : data.color, width : data.width});
            }
        })
    })

    socket.on("down", (data) => {
        // drawnData.push(['down', data.x, data.y, data.color, data.width]);
        connections.forEach(con => {
            if(con.id !==socket.id){
                con.emit('ondown' ,{x : data.x , y : data.y, color : data.color, width : data.width});
            }
        });
    });

    socket.on('save', (data) => {
        console.log(drawnData)
        drawnData.push(data);
        ctxIndex+=1;
        // connections.forEach(con =>{
        //     if(con.id !==socket.id)
        //         con.emit("onsave",data);
        // })
        // console.log(drawnData);
        // drawnData.push(data);
    })

    socket.on('clear',() => {
        // drawnData=[];
        connections.forEach(con => {
                con.emit('onclear');
        });
    })
    socket.on("disconnect" , (reason) => {
        console.log(`${socket.id} is disconnected`);
        connections = connections.filter((con) => con.id!==socket.id);
    });
});

app.use(express.static('public'));

let PORT = process.env.PORT || 8080;
httpServer.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));


