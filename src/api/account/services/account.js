'use strict';

/**
 * account service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::account.account', ({ strapi }) => ({


    deposit(id, balance) {
        return strapi.service('api::account.account').create({ data: { balance: 50, } });

    }, withdraw(id, balance) {
        return strapi.service('api::account.account').create({ data: { balance: 50, } });

    },

    newUser(user_id){
        return strapi.service('api::account.account').create({ data: { balance: 0, user: user_id } });
    },

    getUserAccount(user_id){
        return strapi.db.query('api::account.account').findOne({
          
            where: { user: user_id },
          
          })
    }

}));