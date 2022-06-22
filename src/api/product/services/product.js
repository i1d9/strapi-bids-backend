'use strict';

/**
 * product service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::product.product', ({ strapi }) => ({

    loadBids(id) {
        //return strapi.service('api::product.product').findOne(id, );
        return strapi.entityService.findOne('api::product.product', id, {

            fields: "*",
            populate: {
                bids: {
                    limit: 5,
                    sort: 'createdAt:desc',
                    populate: {
                        account: {
                            fields: ['id'],
                            populate: {
                                user: {
                                    fields: ['username']
                                }
                            }
                        }
                    }
                },

                image: true
            },
        });



    },
    async findAndUpdateBidPrice(found, price) {

        
        return strapi.entityService.update('api::product.product', found.id, {
            data: {
                bid_price: parseInt(found.bid_price) + parseInt(price)
            },
        });
    }




}));
