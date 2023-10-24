import { None, Option, Some } from '../../option/option';
import Joi from 'joi';
import { Response, DiscoverResponse, FetchResponse, LoginResponse, PingResponse, PublishResponse, RegisterResponse, LookupResponse } from '../response';

const fetchSchema = Joi.object({
  type: Joi.string().trim().regex(/fetch/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  headers: Joi.object().optional(),
  body: Joi.string().optional(),
});

export function extractFetchResponse(re: Response): Option<FetchResponse> {
  const res = fetchSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const publishSchema = Joi.object({
  type: Joi.string().trim().regex(/publish/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  headers: Joi.object().optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractPublishResponse(re: Response): Option<PublishResponse> {
  const res = publishSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const discoverSchema = Joi.object({
  type: Joi.string().trim().regex(/discover/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  headers: Joi.object().optional(),
  body: Joi.array().items(Joi.string().trim().hostname()).optional(),
});

export function extractDiscoverResponse(re: Response): Option<DiscoverResponse> {
  const res = discoverSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const loginSchema = Joi.object({
  type: Joi.string().trim().regex(/login/i).uppercase(),
  status: Joi.number().integer().sign('positive'), 
  headers: Joi.object({
    token: Joi.string().token(),
  }).optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractLoginResponse(re: Response): Option<LoginResponse> {
  const res = loginSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const registerSchema = Joi.object({
  type: Joi.string().trim().regex(/register/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  headers: Joi.object().optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractRegisterResponse(re: Response): Option<RegisterResponse> {
  const res = registerSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const lookupSchema = Joi.object({
  type: Joi.string().trim().regex(/lookup/i).uppercase(),
  status: Joi.number().integer().sign('positive'), 
  headers: Joi.object().optional(),
  body: Joi.array().items(
    Joi.object({
      hostname: Joi.string().trim().hostname(),
      ip: Joi.string().trim().ip(),
      port: Joi.number(),
    }),
  ).optional(),
});

export function extractLookupResponse(re: Response): Option<LookupResponse> {
  const res = lookupSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const connectSchema = Joi.object({
  type: Joi.string().trim().regex(/connect/i).uppercase(),
  status: Joi.number().integer().sign('positive'), 
  headers: Joi.object().optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractConnectResponse(re: Response): Option<ConnectResponse> {
  const res = connectSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const pingSchema = Joi.object({
  type: Joi.string().trim().regex(/ping/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  headers: Joi.object().optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractPingResponse(re: Response): Option<PingResponse> {
  const res = pingSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}
