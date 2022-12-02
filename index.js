require('dotenv').config({path: './config.env'});
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Messages = require('./models/Messages');
const socketIO = require("socket.io");

mongoose.connect(process.env.MONGO_KEY, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(express.static('./client/build'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001;
var server = app.listen(port, () => {
    console.log('app is listening to port 3001');
});

const io = socketIO(server);
const activeSockets = {};

io.on('connection', (socket) => {

    socket.on('disconnect', ()=>{
        delete activeSockets[socket.id];
    });

    socket.on('username', msg=>{
        activeSockets[msg] = socket.id;
    });

    socket.on('sent-messages', async msg=>{
        const messages = await Messages.find({sender: msg.user, recipient: msg.recipient}).sort({time: -1}).lean();
        if(messages){
            socket.emit('sent-messages', messages);
        }
    });
});

app.post('/login', async (req, res)=>{
    res.sendStatus(200);
});

app.post('/get-feed', async (req, res)=>{
    const messages = await Messages.find({recipient: req.body.user}).sort({time: -1}).lean();
    if(messages){
        res.send(messages);
    } else {
        res.send([])
    }
});

app.post('/new-message', async (req, res)=>{
    Messages.create({
        sender: req.body.sender,
        recipient: req.body.recipient,
        title: req.body.title,
        body: req.body.body,
        time: new Date()
    }, (err, doc)=>{ 
        if(err){
            res.sendStatus(400);
        } else {
            if(activeSockets[req.body.recipient]){
                io.to(activeSockets[req.body.recipient]).emit('new-message', doc);
            }
            res.send(doc);
        }
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });