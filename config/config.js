import dotenv from 'dotenv';
import Joi from 'joi';

// Load other dotenv files if necessary
dotenv.config();

// Validate variables
const envSchema = Joi.object({
  PORT: Joi.number().required(),
  MONGODB_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_SECURE: Joi.boolean().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),
  MAIL_FROM_NAME: Joi.string().required(),
  MAIL_FROM_EMAIL: Joi.string().email().required(),
  FRONTEND_URL: Joi.string().uri().required(),
})
  .unknown()
  .required();

// Show errors
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  PORT: envVars.PORT,
  MONGODB_URI: envVars.MONGODB_URI,
  JWT_SECRET: envVars.JWT_SECRET,
  MAIL_HOST: envVars.MAIL_HOST,
  MAIL_PORT: envVars.MAIL_PORT,
  MAIL_SECURE: envVars.MAIL_SECURE,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PASS: envVars.MAIL_PASS,
  MAIL_FROM_NAME: envVars.MAIL_FROM_NAME,
  MAIL_FROM_EMAIL: envVars.MAIL_FROM_EMAIL,
  FRONTEND_URL: envVars.FRONTEND_URL,
};

export default config;
