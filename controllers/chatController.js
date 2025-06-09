module.exports = function(io) {
    io.on("connection", (socket) => {
      console.log("🟢 A user connected");
  
      socket.on("chat message", (data) => {
        io.emit("chat message", {
          message: data.message,
          user: data.user,
          time: new Date().toLocaleTimeString()
        });
      });
  
      socket.on("disconnect", () => {
        console.log("🔴 A user disconnected");
      });
    });
  };
  