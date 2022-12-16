const io = require('socket.io')(3005,{
    cors :{
        origin : 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
})

io.on("connection", socket =>{
    console.log(`User connected: ${socket.id}`)
    socket.on('send_changes',data =>{
        socket.broadcast.emit("receive_changes",data);
    })
    
})