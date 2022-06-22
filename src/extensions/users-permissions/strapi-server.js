/* eslint-disable no-useless-escape */
const crypto = require('crypto');
const _ = require('lodash');


const {
    validateCallbackBody,
    validateRegisterBody,
    validateSendEmailConfirmationBody,
} = require('../../../node_modules/@strapi/plugin-users-permissions/server/controllers/validation/auth');


const utils = require('@strapi/utils');
const { getService } = require('../../../node_modules/@strapi/plugin-users-permissions/server/utils');


const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sanitizeUser = (user, ctx) => {
    const { auth } = ctx.state;
    const userSchema = strapi.getModel('plugin::users-permissions.user');

    return sanitize.contentAPI.output(user, userSchema, { auth });
};
module.exports = (plugin) => {

    console.log(plugin.controllers.auth);

    plugin.controllers.auth.callback = async (ctx) => {
        const provider = ctx.params.provider || 'local';
        const params = ctx.request.body;

        const store = strapi.store({ type: 'plugin', name: 'users-permissions' });

        if (provider === 'local') {
            if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
                throw new ApplicationError('This provider is disabled');
            }

            await validateCallbackBody(params);

            const query = { provider };

            // Check if the provided identifier is an email or not.
            const isEmail = emailRegExp.test(params.identifier);

            // Set the identifier to the appropriate query field.
            if (isEmail) {
                query.email = params.identifier.toLowerCase();
            } else {
                query.username = params.identifier;
            }

            // Check if the user exists.
            const user = await strapi.query('plugin::users-permissions.user').findOne({ where: query });

            if (!user) {
                throw new ValidationError('Invalid identifier or password');
            }

            if (
                _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
                user.confirmed !== true
            ) {
                throw new ApplicationError('Your account email is not confirmed');
            }

            if (user.blocked === true) {
                throw new ApplicationError('Your account has been blocked by an administrator');
            }

            // The user never authenticated with the `local` provider.
            if (!user.password) {
                throw new ApplicationError(
                    'This user never set a local password, please login with the provider used during account creation'
                );
            }

            const validPassword = await getService('user').validatePassword(
                params.password,
                user.password
            );

            if (!validPassword) {
                throw new ValidationError('Invalid identifier or password');
            } else {

                console.log("Hayayayay ")
                ctx.send({
                    jwt: getService('jwt').issue({
                        id: user.id,
                    }),
                    user: await sanitizeUser(user, ctx),
                });
            }
        } else {
            if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
                throw new ApplicationError('This provider is disabled');
            }

            // Connect the user with the third-party provider.
            try {
                const user = await getService('providers').connect(provider, ctx.query);
                ctx.send({
                    jwt: getService('jwt').issue({ id: user.id }),
                    user: await sanitizeUser(user, ctx),
                });
            } catch (error) {
                throw new ApplicationError(error.message);
            }
        }
    };








    return plugin;
};
