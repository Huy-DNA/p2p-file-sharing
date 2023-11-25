import { None, Option, Some } from "../../option/option.js";
import { Request,  DiscoverRequest, FetchRequest, PingRequest, PublishRequest, LookupRequest, AnnounceRequest } from "../requests";
import Joi from "joi";

const fetchSchema = Joi.object({
  type: Joi.string().trim().regex(/fetch/i).uppercase(),
  headers: Joi.object({
    filename: Joi.string().trim().regex(/[^\s/\\:?*|]+/),
    hostname: Joi.string().trim().hostname(),
  }),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractFetchRequest(req: Request): Option<FetchRequest> {
  const res = fetchSchema.validate(req);

  return res.error ? new None() : new Some(res.value);
}

const publishSchema = Joi.object({
  type: Joi.string().trim().regex(/publish/i).uppercase(),
  headers: Joi.object({
    filename: Joi.string().trim().regex(/[^\s/\\:?*|]+/),
  }).optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractPublishRequest(req: Request): Option<PublishRequest> {
  const res = publishSchema.validate(req);

  return res.error ? new None() : new Some(res.value);
}

const discoverSchema = Joi.object({
  type: Joi.string().trim().regex(/discover/i).uppercase(),
  headers: Joi.object({
    hostname: Joi.string().trim().hostname(),
  }),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractDiscoverRequest(req: Request): Option<DiscoverRequest> {
  const res = discoverSchema.validate(req);

  return res.error ? new None() : new Some(res.value);
}

const lookupSchema = Joi.object({
  type: Joi.string().trim().regex(/lookup/i).uppercase(),
  headers: {
    filename: Joi.string().trim().regex(/[^\s/\\:?*|]+/),
  },
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractLookupRequest(req: Request): Option<LookupRequest> {
  const res = lookupSchema.validate(req);

  return res.error ? new None() : new Some(res.value);
}

const pingSchema = Joi.object({
  type: Joi.string().trim().regex(/ping/i).uppercase(),
  headers: Joi.object({
    hostname: Joi.string().trim().hostname().optional(),
  }),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractPingRequest(req: Request): Option<PingRequest> {
  const res = pingSchema.validate(req);

  return res.error ? new None() : new Some(res.value);
}

const announceSchema = Joi.object({
  type: Joi.string().trim().regex(/announce/i).uppercase(),
  headers: Joi.object({}).optional(),
  body: Joi.string().trim().allow("").regex(/\s?/).optional(),
});

export function extractAnnounceRequest(req: Request): Option<AnnounceRequest> {
  const res = announceSchema.validate(req);

  return res.error ? new None() : new Some(res.value);
}
