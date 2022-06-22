'use strict';

/**
 *  bid controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::bid.bid', ({ strapi }) => ({
    async loadBids(ctx) {
        ctx.body = "";
    }
}));
