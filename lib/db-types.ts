/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Aliases for untyped Mongoose values.
 *
 * The models in `lib/models.ts` are declared as `Model<any>` — schemas are defined
 * with the Mongoose schema builder and no generated document interfaces — so
 * documents and `.lean()` results arrive untyped throughout the data layer.
 *
 * Rather than scatter bare `any` (and a lint error) across every file that touches
 * the database, the escape hatch is named and confined to this module. A reader can
 * see from the alias that a value is an untyped database document rather than an
 * author having given up on a type, and the eslint suppression lives in exactly one
 * place instead of forty.
 *
 * Anything crossing out of the data layer — API responses, component props — should
 * use a real type; these are for the Mongoose boundary only.
 */

/** A Mongoose document or `.lean()` result whose shape is not statically known. */
export type DbDoc = any;

/** A value written into a Mongoose `create`/`update` call. */
export type DbInput = Record<string, any>;
