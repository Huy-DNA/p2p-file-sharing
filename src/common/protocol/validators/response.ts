import { None, Option, Some } from '../../option/option';
import Joi from 'joi';
import { Response, DiscoverResponse, FetchResponse, LoginResponse, PingResponse, PlsConnectResponse, PublishResponse, RegisterResponse, SelectResponse, LookupResponse, ConnectResponse } from '../response';

const fetchSchema = Joi.object({
  type: Joi.string().trim().regex(/fetch/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  body: Joi.string(),
});

export function extractFetchResponse(re: Response): Option<FetchResponse> {
  const res = fetchSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const publishSchema = Joi.object({
  type: Joi.string().trim().regex(/publish/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractPublishResponse(re: Response): Option<PublishResponse> {
  const res = publishSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const discoverSchema = Joi.object({
  type: Joi.string().trim().regex(/discover/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  body: Joi.object({
    hostnames: Joi.array().items(Joi.string().trim().hostname()),
  }),
});

export function extractDiscoverResponse(re: Response): Option<DiscoverResponse> {
  const res = discoverSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const loginSchema = Joi.object({
  type: Joi.string().trim().regex(/login/i).uppercase(),
  status: Joi.number().integer().sign('positive'), 
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractLoginResponse(re: Response): Option<LoginResponse> {
  const res = loginSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const registerSchema = Joi.object({
  type: Joi.string().trim().regex(/register/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractRegisterResponse(re: Response): Option<RegisterResponse> {
  const res = registerSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}

const lookupSchema = Joi.object({
  type: Joi.string().trim().regex(/lookup/i).uppercase(),
  status: Joi.number().integer().sign('positive'), 
  body: Joi.array().items(
    Joi.object({
      ip: Joi.string().trim().ip(),
      port: Joi.number(),
    }),
  ),
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

const selectSchema = Joi.object({
  type: Joi.string().trim().regex(/select/i).uppercase(),
  status: Joi.number().integer().sign('positive'), 
  headers: Joi.object().optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractSelectResponse(re: Response): Option<SelectResponse> {
  const res = selectSchema.validate(re);

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

const plsConnectSchema = Joi.object({
  type: Joi.string().trim().regex(/login/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  headers: Joi.object().optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractPlsConnectResponse(re: Response): Option<PlsConnectResponse> {
  const res = plsConnectSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}