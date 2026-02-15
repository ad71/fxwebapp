/** Conditional className composition — filters falsy values and joins with space. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
