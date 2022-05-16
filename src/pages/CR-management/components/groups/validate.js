import Joi from 'joi';

export const addNewGroupValidate = {
  name: Joi.string(),
  description: Joi.string(),
}