'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {


    /*
    
    verify(token)

    */
    let interval;
    var io = require('socket.io')(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]

      }
    });

    io.on('connection', function (socket) {
      if (interval) {
        clearInterval(interval);
      }

      console.log('a user connected');
      interval = setInterval(() => {
        io.emit('serverTime', { time: new Date().getTime() }); // This will emit the event to all connected sockets

      }, 1000);


      socket.on('loadBids', async (data) => {

        let params = data;

        try {

          let data = await strapi.service('api::product.product').loadBids(params.id);
          io.emit("loadBids", data);
        } catch (error) {
          console.log(error);
        }

      });


      socket.on('makeBid', async (data) => {

        let params = data;
        try {

          console.log(params);
          let data = await strapi.service('api::bid.bid').makeBid();


        } catch (error) {
          console.log(error);
        }

      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
        clearInterval(interval);
      });
    });

    strapi.io = io

  },
};
