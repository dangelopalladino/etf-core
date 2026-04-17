// No-op shim for vitest. The real `server-only` package throws when imported
// outside a React Server Component, which would block unit tests that
// import server-tagged source files.
export {};
