const Cortex = require('./cortex');
const robot = require("robotjs");
const { width, height } = require("screenz");

var express = require('express');
const app = express();
var path = require('path');
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const Motion = require('./motion.schema')
var Quaternion = require('quaternion');

let motionData = new Motion(0,0,0,0)

let socketUrl = 'wss://localhost:6868'
let user = {
    "license":"aafd1ec8-fd04-46d5-941f-8f21083ea5cb",
    "clientId":"BoQr8ycLmK9nIzApQ8AwubBQ5xUA3Zqhn3CZ43jt",
    "clientSecret":"fF87zW93FkgSQ2gV1uIBpw24PgLG1Q5I1mWrUWFNPZ2o7uig1jCZPQQqiQ9cXhQlNWzpAc0sQcAUTlWj2lvHuRUmeUUweAHJ4sFBv5Bw5dFF8fkctkjI05kRzsNg8nON",
    "debit":1
}

app.use(express.static(__dirname + '/client'));
server.listen(3000, () => console.log("Server is running on Port 3000"))

io.on('connection', function(socket){
    console.log("user connected")
    
    setInterval(function(){
        io.emit('sendData', JSON.stringify(motionData))
    } , 10)
});


let c = new Cortex(user, socketUrl)
// ---------- sub data stream
// have six kind of stream data ['fac', 'pow', 'eeg', 'mot', 'met', 'com']
// user could sub one or many stream at once
let requests = ['mot']
c.sub(requests)

let w
let x
let y
let z

let stream = ""

setInterval(function(){
    stream = c.getState()

    if(stream != "undefined"){
        stream = JSON.parse(stream)

        console.log(stream.mot)

        if(stream.mot[2])
        w = stream.mot[2]

        if(stream.mot[3])
        x = stream.mot[3]

        if(stream.mot[4])
        y = stream.mot[4]

        if(stream.mot[5])
        z = stream.mot[5]

        /* 
        roll  = Math.atan2(2*y*w + 2*x*z, 1 - 2*y*y - 2*z*z);
        pitch = Math.atan2(2*x*w - 2*y*z, 1 - 2*x*x - 2*z*z);
        yaw   =  Math.asin(2*x*y + 2*z*w);
        */
        
       if(stream.mot[6])
       accX = stream.mot[6]

       if(stream.mot[7])
       accY = stream.mot[7]

       if(stream.mot[8])
       accZ = stream.mot[8]

        motionData = new Motion(w,x,y,z, accX, accY, accZ)
        //robot.moveMouse(resultX * 100,resultY * 100);
    }
 
} , 10)


let mouse=robot.getMousePos();
let currentX = mouse.x;
let currentY = mouse.y;
 


function printQuat(stream){
    console.log("Q0: " + stream.mot[2])
    console.log("Q1: " + stream.mot[3])
    console.log("Q2: " + stream.mot[4])
    console.log("Q3: " + stream.mot[5])

    console.log()
    console.log("----------------------------")
    console.log()
}

 

