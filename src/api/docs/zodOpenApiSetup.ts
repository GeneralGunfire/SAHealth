import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

/**
 * One-time side-effect: adds the `.openapi()` method to every Zod schema.
 * Must be imported before any `.openapi()` call anywhere in src/api/docs/.
 *
 * This is the ONLY place Zod is touched for documentation purposes — no
 * existing schema file (src/canonical/*, src/core/consent/*, src/core/audit/*)
 * is modified. `.openapi()` can be chained onto any already-defined Zod
 * schema object from outside the file that defined it, which is what the
 * route-doc builders in this folder do: they import the existing schemas
 * and describe them for OpenAPI purposes without altering the originals.
 */
extendZodWithOpenApi(z);
