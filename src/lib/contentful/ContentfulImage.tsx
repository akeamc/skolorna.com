import { Asset } from "contentful";
import React, {
  DetailedHTMLProps,
  FunctionComponent,
  ImgHTMLAttributes,
} from "react";
import querystring from "querystring";

export interface ContentfulImageProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  asset: Asset;
  width?: number;
  height?: number;
}

const ContentfulImage: FunctionComponent<ContentfulImageProps> = ({
  asset,
  width,
  height,
  ...rest
}) => {
  const query = querystring.stringify({
    w: width,
    h: height,
  });

  return (
    <img
      src={`${asset.fields.file.url}?${query}`}
      title={asset.fields.title}
      alt={asset.fields.description}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  );
};

export default ContentfulImage;
