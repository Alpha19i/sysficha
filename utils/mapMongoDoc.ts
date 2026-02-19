export function mapMongoDoc<T extends Record<string, unknown>>(doc: Record<string, unknown>): T {
  const { _id: _ignored, __v: _ignoredVersion, ...rest } = doc;
  return rest as T;
}
