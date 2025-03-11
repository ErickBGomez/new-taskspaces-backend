import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import socketMiddleware from '../middlewares/socket.middleware.js';

let io, serverSocket, clientSocket;

beforeAll((done) => {
  const httpServer = createServer();
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  socketMiddleware(io);

  httpServer.listen(() => {
    const port = httpServer.address().port;
    clientSocket = new Client(`http://localhost:${port}`, {
      auth: {
        token: 'your-test-token', // Provide a test token here
      },
    });
    io.on('connection', (socket) => {
      serverSocket = socket;
    });
    clientSocket.on('connect', done);
  });
});

afterAll(() => {
  io.close();
  clientSocket.close();
});

test('should connect to the socket server', (done) => {
  clientSocket.on('connect', () => {
    expect(clientSocket.connected).toBe(true);
    done();
  });
});

test('should receive a message from the server', (done) => {
  const testMessage = 'Hello from server';
  serverSocket.emit('message', testMessage);
  clientSocket.on('message', (message) => {
    expect(message).toBe(testMessage);
    done();
  });
});

test('should send a message to the server', (done) => {
  const testMessage = 'Hello from client';
  clientSocket.emit('message', testMessage);
  serverSocket.on('message', (message) => {
    expect(message).toBe(testMessage);
    done();
  });
});
