import { Entry } from "contentful";
import React, { FunctionComponent } from "react";
import { EncyclopediaArticle } from "../../lib/encyclopedia/article";
import { Narrow, ProseContainer } from "../blog/Prose";
import { StandardPageHeading } from "../typography/Heading";

interface Props {
  article: Entry<EncyclopediaArticle>;
}

export const ArticleHeading: FunctionComponent<Props> = ({ article }) => (
  <ProseContainer>
    <Narrow>
      <StandardPageHeading>{article.fields.title}</StandardPageHeading>
    </Narrow>
  </ProseContainer>
);
