import type { Context } from "hono";
import type { ZodType } from "zod";

type ParseResult<T> = { ok: true; data: T } | { ok: false; response: Response };

type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; response: Response };

export function parseParams<T>(
  c: Context,
  schema: ZodType<T>,
  errorMessage = "Invalid params",
): ParseResult<T> {
  const parsed = schema.safeParse(c.req.param());
  if (!parsed.success) {
    return {
      ok: false,
      response: c.json(
        { error: errorMessage, details: parsed.error.issues },
        400,
      ),
    };
  }

  return { ok: true, data: parsed.data };
}

export async function parseBody<T>(
  c: Context,
  schema: ZodType<T>,
  errorMessage = "Invalid body",
): Promise<ParseResult<T>> {
  const body = await c.req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: c.json(
        { error: errorMessage, details: parsed.error.issues },
        400,
      ),
    };
  }

  return { ok: true, data: parsed.data };
}

type BodyWithImageResult<T> =
  | { ok: true; data: T; file: File | null }
  | { ok: false; response: Response };

/**
 * Parse a request body that may carry an image in the same request.
 *
 * - `multipart/form-data`: reads the JSON payload from the `data` field
 *   (validated against `schema`) and the optional image from the `file` field.
 * - otherwise: falls back to a plain JSON body with no file.
 *
 * This lets a single POST/PATCH handle both the entity fields and its image.
 */
export async function parseBodyWithImage<T>(
  c: Context,
  schema: ZodType<T>,
  errorMessage = "Invalid body",
): Promise<BodyWithImageResult<T>> {
  const contentType = c.req.header("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await c.req.formData();
    } catch {
      return {
        ok: false,
        response: c.json({ error: "Invalid multipart/form-data body" }, 400),
      };
    }

    const rawData = form.get("data");
    let json: unknown;
    try {
      json = rawData ? JSON.parse(String(rawData)) : {};
    } catch {
      return {
        ok: false,
        response: c.json({ error: "Invalid 'data' field (expected JSON)" }, 400),
      };
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return {
        ok: false,
        response: c.json(
          { error: errorMessage, details: parsed.error.issues },
          400,
        ),
      };
    }

    const fileEntry = form.get("file");
    const file = fileEntry instanceof File ? fileEntry : null;

    return { ok: true, data: parsed.data, file };
  }

  const body = await c.req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: c.json(
        { error: errorMessage, details: parsed.error.issues },
        400,
      ),
    };
  }

  return { ok: true, data: parsed.data, file: null };
}

export function requireUserId(
  c: Context,
  errorMessage = "Unauthorized",
): AuthResult {
  const userId = c.get("userId");

  if (!userId) {
    return {
      ok: false,
      response: c.json({ error: errorMessage }, 401),
    };
  }

  return { ok: true, userId };
}
