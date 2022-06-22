'use strict';

/**
 * bid service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bid.bid', ({ strapi }) => ({


    makeBid() {
        return strapi.service('api::bid.bid').create({ data: { value: 50, product: 1, publishedAt: new Date() } });

    }

}));
