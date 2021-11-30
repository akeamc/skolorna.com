import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { EntryFields } from "contentful";
import React, { FunctionComponent } from "react";
import styles from "./Prose.module.scss";

export interface Props {
  text: EntryFields.RichText;
}

export const NarrowContainer: FunctionComponent = (props) => (
  <div className={styles.narrow} {...props} />
);

export const Prose: FunctionComponent<Props> = ({ text }) => {
  const content = documentToReactComponents(text as any, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: ({ data }) => {
        const { file, title, description } = data.target.fields;

        if (file.details.image) {
          return (
            <div className={styles.big}>
              <img src={file.url} title={title} alt={description} />
              <figcaption className={styles.narrow}>{description}</figcaption>
            </div>
          );
        }

        return null;
      },
      [BLOCKS.HR]: () => (
        <div className={styles.hrWrapper}>
          <hr />
        </div>
      ),
    },
  });

  return <div className={styles.prose}>{content}</div>;
};
