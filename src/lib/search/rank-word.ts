import levenshtein from "damerau-levenshtein";

/**
 * A modified version of the Damerau–Levenshtein formula. For instance, if the `word` starts with `query`, `0` is instantly returned.
 *
 * @param word Case-sensitive word to be ranked.
 * @param query Case-sensitive query.
 *
 * @returns {number} Search ranking, the lower the higher.
 */
export default function rankWord(word: string, query: string): number {
  if (word.startsWith(query)) {
    return -1;
  }

  // Since word.startsWith(query) returned false, the first position can safely be skipped.
  if (word.includes(query, 1)) {
    return 0;
  }

  return levenshtein(query, word).relative;
}
