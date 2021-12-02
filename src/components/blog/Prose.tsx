import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { Asset, EntryFields } from "contentful";
import React, { FunctionComponent } from "react";
import { ProgressiveImage } from "../contentful/ProgressiveImage";
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
  asset: Asset;
}

export const WideProseImage: FunctionComponent<WideProseImageProps> = ({
  asset,
}) => {
  const { description } = asset.fields;

  return (
    <div className={styles.wide}>
      <ProgressiveImage asset={asset} />
      {description && (
        <figcaption className={styles.narrow}>{description}</figcaption>
      )}
    </div>
  );
};

export const Prose: FunctionComponent<Props> = ({ text }) => {
  const content = documentToReactComponents(text as any, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: ({ data }) => {
        const { target } = data;

        if (target.fields.file.details.image) {
          return <WideProseImage asset={target} />;
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
