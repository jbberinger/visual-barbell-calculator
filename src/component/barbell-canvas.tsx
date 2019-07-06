import React, { useRef, useEffect, useContext } from 'react';
import Dimension from '../util/dimension';
import color from '../util/color';
import { CalculatorContext } from '../context/calculator-context';
import { SettingsContext, Warning, WeightUnit } from '../context/settings-context';
import { CanvasContext } from '../context/canvas-context';

type BBCanvasType = {
  dimension: Dimension,
  screenWidth: number,
}

// Draws loaded barbell to scale
const BarbellCanvas: React.FC<BBCanvasType> = ({ dimension, screenWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [calculatorState] = useContext(CalculatorContext);
  const [, , warning, setWarning, currentWeightUnit] = useContext(SettingsContext);
  const [shouldRedraw, setShouldRedraw] = useContext(CanvasContext);

  const redraw = () => {
    const {
      relBarDiameter, relSleeveDiameter, relSleeveLength,
      relFlangeDiameter, relFlangeWidth, relSleevePlusFlange,
      relCollarBigDiameter, relCollarBigLength, relCollarSmallDiameter,
      relCollarSmallLength, relCollarKnobHeight, relCollarKnobLength,
      relCollarPinHeight, relCollarPinLength, relCollarTotalLength,
    } = dimension.relBarbellDimensions;

    // Draws rectangle and strokes a dark outline to distinguish shapes
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

      // Clears canvas before redrawing.
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Counters browser antialiasing.
      ctx.translate(0.5, 0.5);

      // Draws bar.
      strokeAndFillRect(
        ctx,
        color.equipment.barMetal,
        Math.round(offsetX(relBarLength, canvasWidth)),
        Math.round(offsetY(relBarDiameter, canvasHeight)),
        Math.round(canvasWidth - relSleevePlusFlange),
        Math.round(relBarDiameter)
      );
      // Draws sleeve.
      strokeAndFillRect(
        ctx,
        color.equipment.barMetal,
        Math.round(offsetX(relBarLength + relSleevePlusFlange, canvasWidth)),
        Math.round(offsetY(relSleeveDiameter, canvasHeight)),
        Math.round(relSleeveLength),
        Math.round(relSleeveDiameter)
      );
      // Draws flange.
      strokeAndFillRect(
        ctx,
        color.equipment.barMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth, canvasWidth)),
        Math.round(offsetY(relFlangeDiameter, canvasHeight)),
        Math.round(relFlangeWidth),
        Math.round(relFlangeDiameter)
      );

      let colors: any;
      let widths: any;
      let diameters: any;
      if (currentWeightUnit == WeightUnit.KG) {
        colors = color.plates.kg;
        widths = dimension.relPlateDimensions.kg.relKgPlateWidths;
        diameters = dimension.relPlateDimensions.kg.relKgPlateDiameters;
      } else {
        colors = color.plates.lb;
        widths = dimension.relPlateDimensions.lb.relLbPlateWidths;
        diameters = dimension.relPlateDimensions.lb.relLbPlateDiameters;
      }

      const plateCounts = calculatorState.plateCounts;
      let offset: number = 0;
      // Finds total diameter (offset) for plates and collar so they can
      // be drawn in reverse order (left to right) to minimize color bleeding.
      for (const plate in plateCounts) {
        let offsetWidth = Math.round(widths[plate]) * plateCounts[plate] / 2;
        offset += offsetWidth ? offsetWidth : 0;
      }

      // Warns user there is no room left on the bar.
      if (offset > relSleeveLength - relCollarTotalLength) {
        setWarning(Warning.OVERLOAD);
      }

      // Draws large portion of collar.
      strokeAndFillRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter, canvasHeight)),
        Math.round(relCollarBigLength),
        Math.round(relCollarBigDiameter)
      );
      // Draws small portion of collar.
      strokeAndFillRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarTotalLength, canvasWidth)),
        Math.round(offsetY(relCollarSmallDiameter, canvasHeight)),
        Math.round(relCollarSmallLength),
        Math.round(relCollarSmallDiameter)
      );
      // Draws collar pin.
      strokeAndFillRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength + relCollarKnobLength + relCollarPinLength * 0.28, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter + relCollarKnobHeight + relCollarPinHeight, canvasHeight)),
        Math.round(relCollarPinLength),
        Math.round(relCollarPinHeight)
      );
      // Draws collar knob.
      strokeAndFillRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength / 2 + relCollarKnobLength / 2, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter + relCollarKnobHeight * 2, canvasHeight)),
        Math.round(relCollarKnobLength),
        Math.round(relCollarKnobHeight)
      );

      // Draws plates in reverse order to prevent color bleeding.
      const plateWeight = [...Object.keys(plateCounts).sort((a, b) => parseFloat(b) - parseFloat(a))];
      for (let plateIndex = plateWeight.length - 1; plateIndex >= 0; plateIndex -= 1) {
        let platesToDraw = plateCounts[plateWeight[plateIndex]] / 2;
        while (platesToDraw > 0 && offset > 0) {
          strokeAndFillRect(
            ctx,
            colors[plateWeight[plateIndex].toString()],
            Math.round(offsetX(relBarLength + relFlangeWidth + offset, canvasWidth)),
            Math.round(offsetY(diameters[plateWeight[plateIndex]], canvasHeight)),
            Math.round(widths[plateWeight[plateIndex]]),
            Math.round(diameters[plateWeight[plateIndex]])
          );
          offset -= Math.round(widths[plateWeight[plateIndex]]);
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
  }

  useEffect(() => {
    redraw();
  }, [dimension])

  useEffect(() => {
    if (shouldRedraw) {
      redraw();
      setShouldRedraw(false);
    }
  }, [shouldRedraw]);

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