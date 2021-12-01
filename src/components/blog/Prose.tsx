import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { EntryFields } from "contentful";
import React, { FunctionComponent } from "react";
import styles from "./Prose.module.scss";

export interface Props {
  text: EntryFields.RichText;
}

/**
 * TODO: This should be renamed.
 */
export const Narrow: FunctionComponent = (props) => (
  <div className={styles.narrow} {...props} />
);

/**
 * TODO: Could use a better name.
 */
export const ProseContainer: FunctionComponent = (props) => (
  <div className={styles.proseContainer} {...props} />
);

interface WideProseImageProps {
  src: string;
  title: string;
  caption?: string;
}

export const WideProseImage: FunctionComponent<WideProseImageProps> = ({
  src,
  title,
  caption,
}) => (
  <div className={styles.wide}>
    <img src={src} title={title} alt={caption} />
    {caption && <figcaption className={styles.narrow}>{caption}</figcaption>}
  </div>
);

export const Prose: FunctionComponent<Props> = ({ text }) => {
  const content = documentToReactComponents(text as any, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: ({ data }) => {
        const { file, title, description } = data.target.fields;

        if (file.details.image) {
          return (
            <WideProseImage
              src={file.url}
              title={title}
              caption={description}
            />
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
