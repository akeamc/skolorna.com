import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { parseToRgb, readableColor, rgbToColorString } from "polished";
import { RgbColor } from "polished/lib/types/color";
import { useTheme } from "../../lib/utils/theme";
import styles from "./color.module.scss";

export interface ColorSampleProps {
  name: string;
}

export const ColorSample: FunctionComponent<ColorSampleProps> = ({ name }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [bg, setBg] = useState<string>();
  const [fg, setFg] = useState<string>();
  const theme = useTheme();
  const rgb: RgbColor = bg ? parseToRgb(bg) : { red: 0, green: 0, blue: 0 };
  const hex = rgbToColorString(rgb);

  useEffect(() => {
    if (ref.current) {
      const s = getComputedStyle(ref.current);
      setBg(s.backgroundColor);
      setFg(readableColor(s.backgroundColor));
    }
  }, [theme]);

  return (
    <div
      style={{ backgroundColor: `var(--${name})`,
    color: fg }}
      ref={ref}
      className={styles.sample}
    >
      <code>{name}</code>
      <br />
      {hex}
      <br />
      RGB {rgb.red}, {rgb.green}, {rgb.blue}
    </div>
  );
};

export interface ColorSwatchProps {
  names: string[];
}

export const ColorSwatch: FunctionComponent<ColorSwatchProps> = ({ names }) => (
  <div className={styles.swatch}>
    {names.map((name) => (
      <ColorSample name={name} key={name} />
    ))}
  </div>
);
