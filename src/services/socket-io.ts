import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

export const initIO = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // join store room
    socket.on("join_store", (storeId: string | number) => {
      socket.join(`store_${storeId}`);
      console.log(`Socket ${socket.id} joined room store_${storeId}`);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
