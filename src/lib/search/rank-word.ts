import levenshtein from "damerau-levenshtein";

export type WordRanking = number | null;

/**
 * A modified version of the Damerau–Levenshtein formula. For instance, if the `word` starts with `query`, `0` is instantly returned.
 *
 * @param word Case-sensitive word to be ranked.
 * @param query Case-sensitive query.
 *
 * @returns {number} Search ranking, the lower the higher. `null` if the word is too far off.
 */
export default function rankWord(word: string, query: string): WordRanking {
  if (query.length === 0) {
    return null;
  }

  if (word.startsWith(query)) {
    return -1;
  }

  // Since word.startsWith(query) returned false, the first position can safely be skipped.
  if (word.includes(query, 1)) {
    return 0;
  }

  const maxSteps = Math.floor(word.length / 4);

  const { steps } = levenshtein(query, word);

  if (steps > maxSteps) {
    return null;
  }

  return steps;
}
