'use strict';

/**
 * bid service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bid.bid', ({ strapi }) => ({


    makeBid(params) {
        
        return strapi.service('api::bid.bid').create({ data: { value: params.bidValue, account: params.account, product: params.product, publishedAt: new Date() } });

    }

}));
