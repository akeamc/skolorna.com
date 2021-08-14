import React, { FunctionComponent } from "react";

const InfoText: FunctionComponent = ({ children }) => (
  <>
    <style jsx>{`
      p {
        color: var(--text-tertiary);
        font: 400 14px/1 var(--font-sans);
        letter-spacing: -0.006em;
        text-align: center;
        margin: 0;
        line-height: 1.1;
      }
    `}</style>
    <p>{children}</p>
  </>
);

export default InfoText;
