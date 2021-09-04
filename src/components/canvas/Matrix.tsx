import React, { FunctionComponent, useRef } from "react";
import Canvas from "./Canvas";
import styles from "./Matrix.module.scss";

export const DEFAULT_CHARS =
  "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ012345789Z:.\"=*+-<>¦｜╌ｸ";

export interface MatrixProps {
  chars?: string;
  fontSize?: number;
  columnWidth?: number;
  rowHeight?: number;
  tail?: number;
  target: string;
}

const Matrix: FunctionComponent<MatrixProps> = ({
  chars = DEFAULT_CHARS,
  fontSize = 16,
  rowHeight = 20,
  columnWidth = 20,
  tail = 15,
  target: targetInput,
}) => {
  const target = ` ${targetInput} `;

  const columnRef = useRef<string[][]>([]);
  // const endRef = useRef(false);
  const font = `${fontSize}px "JetBrains Mono", monospace`;

  const beforeDraw = (ctx: CanvasRenderingContext2D) => {
    const columns = Math.ceil(ctx.canvas.width / columnWidth);

    if (columnRef.current.length !== columns) {
      columnRef.current = Array.from({ length: columns }).map(() => []);
      // endRef.current = false;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const cols = columnRef.current;
    const showTarget = frameCount > 120;
    const move = frameCount % 4 === 0;
    const rows = Math.ceil(ctx.canvas.height / rowHeight);

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = font;

    for (let i = 0; i < cols.length; i += 1) {
      const x = i * columnWidth;
      const col = cols[i];

      // Don't start the same time as all other columns.
      if (col.length === 0 && Math.random() > 0.03) {
        // eslint-disable-next-line no-continue
        continue;
      }

      ctx.fillStyle = "#0f0";

      for (let j = 0; j < col.length; j += 1) {
        ctx.fillText(col[j], i * columnWidth, j * rowHeight);
      }

      ctx.fillStyle = "#afa";

      const stop =
        showTarget && i < target.length && col.length === Math.floor(rows / 2);

      const head = stop
        ? target[i]
        : chars[Math.floor(Math.random() * chars.length)];

      ctx.fillText(head, x, col.length * rowHeight);

      if (move) {
        if (stop || col.length > tail) {
          // Not very efficient; maybe keep a record of the length and position of each col?
          const idx = Math.min(col.lastIndexOf("") + 1, col.length - 1);
          col[idx] = "";
        }

        if (!stop) {
          cols[i].push(head);
        }
      }

      if (cols[i].length > rows + tail) {
        cols[i] = [];
      }
    }
  };

  return (
    <Canvas draw={draw} beforeDraw={beforeDraw} className={styles.canvas} />
  );
};

export default Matrix;
