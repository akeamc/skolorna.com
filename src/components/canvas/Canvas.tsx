import React, {
  CanvasHTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
  useEffect,
  useRef,
} from "react";

export type Draw = (ctx: CanvasRenderingContext2D, frameCount: number) => void;

export interface CanvasProps
  extends DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  draw: Draw;
  beforeDraw?: Draw;
  fullscreen?: boolean;
}

export function resizeToFitWindow(canvas: HTMLCanvasElement) {
  // eslint-disable-next-line no-param-reassign
  canvas.width = window.innerWidth;
  // eslint-disable-next-line no-param-reassign
  canvas.height = window.innerHeight;
}

const Canvas: FunctionComponent<CanvasProps> = ({
  draw,
  beforeDraw = () => {},
  fullscreen = true,
  style,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) {
      return;
    }

    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      frameCount += 1;
      if (fullscreen) {
        resizeToFitWindow(ctx.canvas);
      }
      beforeDraw(ctx, frameCount);
      draw(ctx, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    // eslint-disable-next-line consistent-return
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [beforeDraw, draw, fullscreen]);

  return (
    <canvas
      style={{
        display: "block",
        ...style,
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      ref={canvasRef}
    />
  );
};

export default Canvas;
