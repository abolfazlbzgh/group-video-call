import express from 'express';
import http from 'http';
import { Server as SocketIoServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new SocketIoServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('join-room', ({ roomId, username }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }
        
        rooms[roomId].push({ socketId: socket.id, username });
        console.log('join-room:', socket.id,roomId,rooms);

        socket.join(roomId);

        socket.to(roomId).emit('user-connected', { socketId: socket.id, username });

        socket.on('disconnect', () => {
            rooms[roomId] = rooms[roomId].filter(user => user.socketId !== socket.id);
            socket.to(roomId).emit('user-disconnected', socket.id);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
                console.log(`Room ${roomId} deleted as no users are left`);
            }
            console.log('disconnect:', socket.id,roomId, rooms);
        });
    });

    socket.on('send-offer', ({ offer, to }) => {
        io.to(to).emit('receive-offer', { offer, from: socket.id });
    });

    socket.on('send-answer', ({ answer, to }) => {
        io.to(to).emit('receive-answer', { answer, from: socket.id });
    });

    socket.on('send-ice-candidate', ({ candidate, to }) => {
        io.to(to).emit('receive-ice-candidate', { candidate, from: socket.id });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});