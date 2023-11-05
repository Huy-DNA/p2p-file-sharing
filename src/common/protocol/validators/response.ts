import { None, Option, Some } from '../../option/option.js';
import Joi from 'joi';
import { Response, DiscoverResponse, FetchResponse,  PingResponse, PublishResponse,  LookupResponse, AnnounceResponse } from '../response';

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
  headers: Joi.object({
    filename: Joi.string().trim().regex(/[^\s/\\:?*|]+/),
  }),
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
  body: Joi.array().items(Joi.string().trim().regex(/[^\s/\\:?*|]+/)).optional(),
});

export function extractDiscoverResponse(re: Response): Option<DiscoverResponse> {
  const res = discoverSchema.validate(re);
  console.log(res);
  return res.error ? new None() : new Some(res.value);
}

const lookupSchema = Joi.object({
  type: Joi.string().trim().regex(/lookup/i).uppercase(),
  status: Joi.number().integer().sign('positive'), 
  headers: Joi.object().optional(),
  body: Joi.array().items(Joi.string().trim().hostname()).optional(),
});

export function extractLookupResponse(re: Response): Option<LookupResponse> {
  const res = lookupSchema.validate(re);

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

const announceSchema = Joi.object({
  type: Joi.string().trim().regex(/announce/i).uppercase(),
  status: Joi.number().integer().sign('positive'),
  headers: Joi.object().optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
})

export function extractAnnounceResponse(re: Response): Option<AnnounceResponse> {
  const res = announceSchema.validate(re);

  return res.error ? new None() : new Some(res.value);
}
