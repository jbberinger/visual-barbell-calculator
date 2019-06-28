import React, { useRef, useEffect, useContext } from 'react';
import Dimension from '../util/dimension';
import color from '../util/color';
import { CalculatorContext, plateCountType } from '../context/calculator-context';

type BBCanvasType = {
  dimension: Dimension,
  screenWidth: number,
}

const BarbellCanvas: React.FC<BBCanvasType> = ({ dimension, screenWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [kgPlateWeights, calculatorState] = useContext(CalculatorContext);

  /**
   * Consider writing custom 'draw' hook
   */
  useEffect(() => {

    const {
      relBarDiameter, relSleeveDiameter, relSleeveLength,
      relFlangeDiameter, relFlangeWidth, relSleevePlusFlange,
      relCollarBigDiameter, relCollarBigLength, relCollarSmallDiameter,
      relCollarSmallLength, relCollarKnobHeight, relCollarKnobLength,
      relCollarPinHeight, relCollarPinLength, relCollarTotalLength,
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

      // Clears canvas before redrawing
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

      // finds total diameter (offset) for plates and collar and
      // draws them in reverse order to minimize color bleeding
      let kgColors = Object.values(color.plates.kg)
      const kgPlateWidths = dimension.plateDimensions.kg.kgPlateWidths;
      const plateCounts = calculatorState.plateCounts;
      let offset: number = 0;
      // adds plate widths to offset
      for (let plateIndex = 0; plateIndex < kgPlateWeights.length; plateIndex += 1) {
        offset += Math.round(kgPlateWidths[plateIndex]) * (plateCounts[kgPlateWeights[plateIndex]] / 2);
      }
      // // adds collar length to offset
      // offset += relCollarTotalLength;
      ////////////////////////
      /// START COLLAR TESTING
      // Draws main part of collar
      strokeAndFillRect(
        ctx,
        color.barbell.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter, canvasHeight)),
        Math.round(relCollarBigLength),
        Math.round(relCollarBigDiameter)
      );
      // draws large portion of collar
      strokeAndFillRect(
        ctx,
        color.barbell.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter, canvasHeight)),
        Math.round(relCollarBigLength),
        Math.round(relCollarBigDiameter)
      );
      // draws small portion of collar
      strokeAndFillRect(
        ctx,
        color.barbell.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarTotalLength, canvasWidth)),
        Math.round(offsetY(relCollarSmallDiameter, canvasHeight)),
        Math.round(relCollarSmallLength),
        Math.round(relCollarSmallDiameter)
      );
      // draws collar pin
      strokeAndFillRect(
        ctx,
        color.barbell.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength + relCollarKnobLength + relCollarPinLength * 0.28, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter + relCollarKnobHeight + relCollarPinHeight, canvasHeight)),
        Math.round(relCollarPinLength),
        Math.round(relCollarPinHeight)
      );
      // draws knob
      strokeAndFillRect(
        ctx,
        color.barbell.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength / 2 + relCollarKnobLength / 2, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter + relCollarKnobHeight * 2, canvasHeight)),
        Math.round(relCollarKnobLength),
        Math.round(relCollarKnobHeight)
      );
      /// END COLLAR TESTING
      //////////////////////
      // draws plates in reverse order to prevent color bleeding
      console.log(`offset: ${offset}`);
      for (let plateIndex = kgPlateWeights.length - 1; plateIndex >= 0; plateIndex -= 1) {
        let platesToDraw = plateCounts[kgPlateWeights[plateIndex]] / 2;
        while (platesToDraw > 0 && offset > 0) {
          strokeAndFillRect(
            ctx,
            kgColors[plateIndex],
            Math.round(offsetX(relBarLength + relFlangeWidth + offset, canvasWidth)),
            Math.round(offsetY(dimension.plateDimensions.kg.kgPlateDiameters[plateIndex], canvasHeight)),
            Math.round(dimension.plateDimensions.kg.kgPlateWidths[plateIndex]),
            Math.round(dimension.plateDimensions.kg.kgPlateDiameters[plateIndex])
          );
          offset -= Math.round(dimension.plateDimensions.kg.kgPlateWidths[plateIndex]);
          platesToDraw -= 1;
        }
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
  }, [dimension, calculatorState, kgPlateWeights]);

  return (
    <div className='barbell-canvas-container'>
      <canvas
        ref={canvasRef}
        className='barbell-canvas'
        height={Math.round(screenWidth * (300 / 320))}
        width={Math.round(screenWidth * (300 / 320))}
      />
    </div>
  )
}

export default BarbellCanvas;