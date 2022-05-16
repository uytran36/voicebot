import Joi from 'joi';
import { AGENT, TEXT_TO_SPEAK, SPEAK_MEDIA} from '../Step2/hardCode';

export default (schema) => (values) => {
    const object = pick(values, Object.keys(schema));
    const { value, error } = Joi.compile(schema).prefs({
        errors: {
            label: 'key',
        }
    }).validate(object);
    if(error) {
        // console.log({error})
        const errorMessage = error.details.map(detail => detail.message).join('');
        throw new Error(errorMessage)
    }
    return value
}

export const step1Validate = {
    campaignName: Joi.string().required(),
    omniContactID: Joi.string().required(),
}

export const scenarioIntroductionValidate = {
    media_type: Joi.string().valid(TEXT_TO_SPEAK.media_type, SPEAK_MEDIA.media_type).required(),
    action_type: Joi.string().valid(TEXT_TO_SPEAK.action_type, SPEAK_MEDIA.action_type).required(),
    voice: Joi.string().required(),
}

export const scenarioDtmfValidate = {
    dtmf: Joi.array().items(Joi.object().keys({
        media_type: Joi.string().valid(TEXT_TO_SPEAK.media_type, SPEAK_MEDIA.media_type).required(),
        action_type: Joi.string().valid(TEXT_TO_SPEAK.action_type, SPEAK_MEDIA.action_type).required(),
        voice: Joi.string(),
        agent_id: Joi.string(),
        agent_name: Joi.string(),
        title: Joi.string(),
        dtmf_num: Joi.string(),
        id: Joi.string(),
        parentId: [Joi.string(), Joi.allow(null)],
    }))
}

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
function pick(object, keys) {
    return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = object[key];
    }
    return obj;
    }, {});
} 