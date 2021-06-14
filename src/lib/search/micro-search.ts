import rankWord from "./rank-word";

export type Document = Record<string, unknown>;
export type DocumentIndex<T extends Document> = [string, T][];
export type RankedDocuments<T extends Document> = [number, T][];

export default class MicroSearch<T extends Document> {
  public documents: DocumentIndex<T>;

  public static indexDocuments<T extends Document>(
    documents: T[],
    field: keyof T
  ): DocumentIndex<T> {
    const index: DocumentIndex<T> = documents.map((document) => {
      const fieldValue = document[field];

      if (typeof fieldValue !== "string") {
        throw new Error("specified field must be of type string");
      }

      const key = fieldValue.toLocaleLowerCase();

      return [key, document];
    });

    return index;
  }

  constructor(documents: T[], field: keyof T) {
    this.documents = MicroSearch.indexDocuments(documents, field);
  }

  public search(rawQuery: string, results?: number): T[] {
    const query = rawQuery.toLocaleLowerCase();

    const scores = this.documents.reduce((acc, [key, document]) => {
      const score = rankWord(key, query);

      if (typeof score === "number") {
        acc.push([score, document]);
      }

      return acc;
    }, [] as RankedDocuments<T>);

    const sorted = scores
      .sort(([aScore], [bScore]) => aScore - bScore)
      .slice(0, results);

    return sorted.map(([_score, document]) => document);
  }
}
