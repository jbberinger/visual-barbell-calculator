import React, { useRef, useEffect } from 'react';
import Dimension from '../util/dimension';
import color from '../util/color';

type BBCanvas = {
  dimension: Dimension,
}

const BarbellCanvas: React.FC<BBCanvas> = ({ dimension }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Consider writing custom 'draw' hook
   */
  useEffect(() => {

    const {
      relBarDiameter, relSleeveDiameter, relSleeveLength,
      relFlangeDiameter, relFlangeWidth, relSleevePlusFlange,
      relCollarBigDiameter, relCollarBigLength, relCollarSmallDiameter,
      relCollarSmallLength, relCollarKnobHeight, relCollarKnobLength,
      relCollarPinHeight, relCollarPinLength,
    } = dimension.relBarbellDimensions;

    const strokeAndFillRect = (ctx: CanvasRenderingContext2D, c: string, x: number, y: number, w: number, h: number) => {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = color.adjustLuminosity(c, -10);
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    };

    const offsetX = (width: number, canvasWidth: number): number => canvasWidth - width;
    const offsetY = (height: number, canvasHeight: number): number => canvasHeight / 2 - height / 2;

    const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const relBarLength = (canvasWidth - relSleevePlusFlange);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      // Counters browser antialiasing
      ctx.translate(0.5, 0.5);

      // Draws bar
      strokeAndFillRect(
        ctx,
        color.barbell.barMetal,
        Math.round(offsetX(relBarLength, canvasWidth)),
        Math.round(offsetY(relBarDiameter, canvasHeight)),
        Math.round(canvasWidth - relSleevePlusFlange),
        Math.round(relBarDiameter)
      );
      // Draws sleeve
      strokeAndFillRect(
        ctx,
        color.barbell.barMetal,
        Math.round(offsetX(relBarLength + relSleevePlusFlange, canvasWidth)),
        Math.round(offsetY(relSleeveDiameter, canvasHeight)),
        Math.round(relSleeveLength),
        Math.round(relSleeveDiameter)
      );
      // Draws flange
      strokeAndFillRect(
        ctx,
        color.barbell.barMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth, canvasWidth)),
        Math.round(offsetY(relFlangeDiameter, canvasHeight)),
        Math.round(relFlangeWidth),
        Math.round(relFlangeDiameter)
      );

      let plateOffset: number = 0;
      // Draws 25kg plate
      plateOffset += Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]);
      strokeAndFillRect(
        ctx,
        color.plates.kg.red25,
        Math.round(offsetX(relBarLength + relFlangeWidth + plateOffset, canvasWidth)),
        Math.round(offsetY(dimension.plateDimensions.kg.kgPlateDiameters[0], canvasHeight)),
        Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]),
        Math.round(dimension.plateDimensions.kg.kgPlateDiameters[0])
      );
      // Draws 25kg plate
      plateOffset += Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]);
      strokeAndFillRect(
        ctx,
        color.plates.kg.red25,
        Math.round(offsetX(relBarLength + relFlangeWidth + plateOffset, canvasWidth)),
        Math.round(offsetY(dimension.plateDimensions.kg.kgPlateDiameters[0], canvasHeight)),
        Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]),
        Math.round(dimension.plateDimensions.kg.kgPlateDiameters[0])
      );
      // Draws 25kg plate
      plateOffset += Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]);
      strokeAndFillRect(
        ctx,
        color.plates.kg.red25,
        Math.round(offsetX(relBarLength + relFlangeWidth + plateOffset, canvasWidth)),
        Math.round(offsetY(dimension.plateDimensions.kg.kgPlateDiameters[0], canvasHeight)),
        Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]),
        Math.round(dimension.plateDimensions.kg.kgPlateDiameters[0])
      );
      // Draws 25kg plate
      plateOffset += Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]);
      strokeAndFillRect(
        ctx,
        color.plates.kg.red25,
        Math.round(offsetX(relBarLength + relFlangeWidth + plateOffset, canvasWidth)),
        Math.round(offsetY(dimension.plateDimensions.kg.kgPlateDiameters[0], canvasHeight)),
        Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]),
        Math.round(dimension.plateDimensions.kg.kgPlateDiameters[0])
      );
      // Draws 25kg plate
      plateOffset += Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]);
      strokeAndFillRect(
        ctx,
        color.plates.kg.red25,
        Math.round(offsetX(relBarLength + relFlangeWidth + plateOffset, canvasWidth)),
        Math.round(offsetY(dimension.plateDimensions.kg.kgPlateDiameters[0], canvasHeight)),
        Math.round(dimension.plateDimensions.kg.kgPlateWidths[0]),
        Math.round(dimension.plateDimensions.kg.kgPlateDiameters[0])
      );
      let colorArr = Object.values(color.plates.kg);
      for (let i = 1; i < colorArr.length; i += 1) {
        plateOffset += Math.round(dimension.plateDimensions.kg.kgPlateWidths[i]);
      }
      for (let i = colorArr.length - 1; i > 0; i -= 1) {
        strokeAndFillRect(
          ctx,
          colorArr[i],
          Math.round(offsetX(relBarLength + relFlangeWidth + plateOffset, canvasWidth)),
          Math.round(offsetY(dimension.plateDimensions.kg.kgPlateDiameters[i], canvasHeight)),
          Math.round(dimension.plateDimensions.kg.kgPlateWidths[i]),
          Math.round(dimension.plateDimensions.kg.kgPlateDiameters[i])
        );
        plateOffset -= Math.round(dimension.plateDimensions.kg.kgPlateWidths[i]);

      }

      // Moves context back to (0,0)
      ctx.translate(-0.5, -0.5);
    }

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        draw(canvas, ctx);
      }
    }
  }, [dimension]);

  return (
    <div className='barbell-canvas-container'>
      <canvas
        ref={canvasRef}
        className='barbell-canvas'
        height={300}
        width={300}
      />
    </div>
  )
}

export default BarbellCanvas;