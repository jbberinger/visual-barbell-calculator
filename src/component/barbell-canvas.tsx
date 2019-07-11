import React, { useRef, useEffect, useContext } from 'react';
import Dimension from '../util/dimension';
import color from '../util/color';
import { CalculatorContext } from '../context/calculator-context';
import { SettingsContext, Warning, WeightUnit } from '../context/settings-context';

type BBCanvasType = {
  dimension: Dimension,
  screenWidth: number,
}

// Draws loaded barbell to scale
const BarbellCanvas: React.FC<BBCanvasType> = ({ dimension, screenWidth }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [calculatorState] = useContext(CalculatorContext);
  const [, , warning, setWarning, currentWeightUnit] = useContext(SettingsContext);

  const redraw = () => {
    const {
      relBarDiameter, relSleeveDiameter, relSleeveLength,
      relFlangeDiameter, relFlangeWidth, relSleevePlusFlange,
      relCollarBigDiameter, relCollarBigLength, relCollarSmallDiameter,
      relCollarSmallLength, relCollarKnobHeight, relCollarKnobLength,
      relCollarPinHeight, relCollarPinLength, relCollarTotalLength,
    } = dimension.relBarbellDimensions;

    type RadiiType = {
      topLeft: number,
      topRight: number,
      bottomRight: number,
      bottomLeft: number,
    }

    const strokeAndFillRoundedRect = (
      ctx: CanvasRenderingContext2D,
      c: string,
      x: number,
      y: number,
      width: number,
      height: number,
      radii?: RadiiType) => {
      if (!radii) {
        radii = { topLeft: 5, topRight: 5, bottomRight: 5, bottomLeft: 5 };
      }
      ctx.beginPath();
      ctx.moveTo(x + radii.topLeft, y);
      ctx.lineTo(x + width - radii.topRight, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radii.topRight);
      ctx.lineTo(x + width, y + height - radii.bottomRight);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radii.bottomRight, y + height);
      ctx.lineTo(x + radii.bottomLeft, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radii.bottomLeft);
      ctx.lineTo(x, y + radii.topLeft);
      ctx.quadraticCurveTo(x, y, x + radii.topLeft, y);
      ctx.closePath();
      ctx.fillStyle = c;
      ctx.fill();
      ctx.strokeStyle = color.adjustLuminosity(c, -10);
      ctx.stroke();
    }

    // Draws rectangle and strokes a dark outline to distinguish shapes
    // const strokeAndFillRect = (
    //   ctx: CanvasRenderingContext2D,
    //   c: string,
    //   x: number,
    //   y: number,
    //   w: number,
    //   h: number) => {
    //   ctx.fillStyle = c;
    //   ctx.fillRect(x, y, w, h);
    //   ctx.strokeStyle = color.adjustLuminosity(c, -10);
    //   ctx.lineWidth = 1;
    //   ctx.strokeRect(x, y, w, h);
    // };

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
      strokeAndFillRoundedRect(
        ctx,
        color.equipment.barMetal,
        Math.round(offsetX(relBarLength, canvasWidth)),
        Math.round(offsetY(relBarDiameter, canvasHeight)),
        Math.round(canvasWidth - relSleevePlusFlange),
        Math.round(relBarDiameter),
        { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 },
      );
      // Draws sleeve.
      strokeAndFillRoundedRect(
        ctx,
        color.equipment.barMetal,
        Math.round(offsetX(relBarLength + relSleevePlusFlange, canvasWidth)),
        Math.round(offsetY(relSleeveDiameter, canvasHeight)),
        Math.round(relSleeveLength),
        Math.round(relSleeveDiameter),
        { topLeft: 7, topRight: 0, bottomRight: 0, bottomLeft: 7 }
      );
      // Draws flange.
      strokeAndFillRoundedRect(
        ctx,
        color.equipment.barMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth, canvasWidth)),
        Math.round(offsetY(relFlangeDiameter, canvasHeight)),
        Math.round(relFlangeWidth),
        Math.round(relFlangeDiameter),
        { topLeft: 2.5, topRight: 2.5, bottomRight: 2.5, bottomLeft: 2.5 },
      );

      // Initializes parameters with the correct weight unit
      let colors: any;
      let widths: any;
      let diameters: any;
      if (currentWeightUnit === WeightUnit.KG) {
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
        let offsetWidth = Math.round(widths[plate]) * plateCounts[plate];
        offset += offsetWidth ? offsetWidth : 0;
      }

      // Warns user there is no room left on the bar.
      if (offset > relSleeveLength - relCollarTotalLength) {
        setWarning(Warning.OVERLOAD);
      }

      // Draws large portion of collar.
      strokeAndFillRoundedRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter, canvasHeight)),
        Math.round(relCollarBigLength),
        Math.round(relCollarBigDiameter),
        { topLeft: 3, topRight: 3, bottomRight: 3, bottomLeft: 3 }
      );
      // Draws small portion of collar.
      strokeAndFillRoundedRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarTotalLength, canvasWidth)),
        Math.round(offsetY(relCollarSmallDiameter, canvasHeight)),
        Math.round(relCollarSmallLength),
        Math.round(relCollarSmallDiameter),
        { topLeft: 3, topRight: 0, bottomRight: 0, bottomLeft: 3 }
      );
      // Draws collar pin.
      strokeAndFillRoundedRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength + relCollarKnobLength + relCollarPinLength * 0.28, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter + relCollarKnobHeight + relCollarPinHeight, canvasHeight)),
        Math.round(relCollarPinLength),
        Math.round(relCollarPinHeight),
        { topLeft: 3, topRight: 3, bottomRight: 3, bottomLeft: 3 },
      );
      // Draws collar knob.
      strokeAndFillRoundedRect(
        ctx,
        color.equipment.collarMetal,
        Math.round(offsetX(relBarLength + relFlangeWidth + offset + relCollarBigLength / 2 + relCollarKnobLength / 2, canvasWidth)),
        Math.round(offsetY(relCollarBigDiameter + relCollarKnobHeight * 2, canvasHeight)),
        Math.round(relCollarKnobLength),
        Math.round(relCollarKnobHeight),
        { topLeft: 3, topRight: 3, bottomRight: 0, bottomLeft: 0 },
      );

      // Draws plates in reverse order to prevent color bleeding.
      const plateWeights = [...Object.keys(plateCounts).sort((a, b) => parseFloat(b) - parseFloat(a))];
      for (let plateIndex = plateWeights.length - 1; plateIndex >= 0; plateIndex -= 1) {
        let platesToDraw = plateCounts[plateWeights[plateIndex]];
        while (platesToDraw > 0 && offset > 0) {
          strokeAndFillRoundedRect(
            ctx,
            colors[plateWeights[plateIndex].toString()],
            Math.round(offsetX(relBarLength + relFlangeWidth + offset, canvasWidth)),
            Math.round(offsetY(diameters[plateWeights[plateIndex]], canvasHeight)),
            Math.round(widths[plateWeights[plateIndex]]),
            Math.round(diameters[plateWeights[plateIndex]]),
            { topLeft: 2.5, topRight: 2.5, bottomRight: 2.5, bottomLeft: 2.5 }
          );
          offset -= Math.round(widths[plateWeights[plateIndex]]);
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
  }, [dimension, calculatorState]);

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