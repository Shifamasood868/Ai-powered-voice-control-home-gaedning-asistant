import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import User from '../schema/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server, clientTracking: true });
  const activeUsers = new Map();

  const authenticate = (token) => {
    try {
      if (!token) return null;
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification failed:', err);
      return null;
    }
  };

  const broadcastActiveUsers = () => {
    const activeUserIds = Array.from(activeUsers.keys());
    const message = JSON.stringify({
      type: 'activeUsers',
      users: activeUserIds
    });

    wss.clients.forEach(client => {
      if (client.readyState === 1) client.send(message);
    });
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await User.findByIdAndUpdate(userId, {
        status,
        ...(status === 'active' ? {
          lastActive: new Date(),
          $inc: { loginCount: 1 }
        } : {
          lastLogout: new Date()
        })
      });
    } catch (err) {
      console.error(`Error updating user ${userId} status:`, err);
    }
  };

  // Send active users to a specific client
  const sendActiveUsers = (ws) => {
    const activeUserIds = Array.from(activeUsers.keys());
    ws.send(JSON.stringify({
      type: 'activeUsers',
      users: activeUserIds
    }));
  };

  wss.on('connection', (ws, req) => {
    const token = new URL(req.url, `ws://${req.headers.host}`).searchParams.get('token');
    const decoded = authenticate(token);
    
    if (!decoded?.userId) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    const userId = decoded.userId.toString();
    const userData = activeUsers.get(userId) || { connections: new Set() };
    
    userData.connections.add(ws);
    activeUsers.set(userId, userData);

    // Send current active users to the newly connected admin client
    if (decoded.isAdmin) {
      sendActiveUsers(ws);
    }

    if (userData.connections.size === 1) {
      updateUserStatus(userId, 'active').then(broadcastActiveUsers);
    }

    // Heartbeat
    const heartbeatInterval = setInterval(() => ws.ping(), 30000);
    ws.on('pong', () => ws.isAlive = true);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'getActiveUsers' && decoded.isAdmin) {
          sendActiveUsers(ws);
        }
      } catch (err) {
        console.error('Error processing message:', err);
      }
    });

    ws.on('close', () => {
      clearInterval(heartbeatInterval);
      const userData = activeUsers.get(userId);
      
      if (userData) {
        userData.connections.delete(ws);
        if (userData.connections.size === 0) {
          activeUsers.delete(userId);
          updateUserStatus(userId, 'inactive').then(broadcastActiveUsers);
        }
      }
    });
  });

  // Cleanup inactive connections
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  return wss;
};