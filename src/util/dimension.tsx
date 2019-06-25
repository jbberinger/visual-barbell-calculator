// Stores and computes values rel to canvas size
class Dimension {

  // Dimensions in mm from IPF regulation Eleiko barbell schematics
  barbellDimensions = {
    barDiameter: 29,
    sleeveDiameter: 52,
    sleeveLength: 433,
    flangeDiameter: 84, // best guess, couldn't find dimension online
    flangeWidth: 12,
    collarTotalLength: 110,
    collarBigDiameter: 93,
    collarSmallDiameter: 73,
    collarPinLength: 93,
    collarPinHeight: 11.63,
    collarBigLength: 60.50,
    collarSmallLength: 49.50,
    collarKnobHeight: 23.25,
    collarKnobLength: 18.15,
  };

  // Computed barbell dimensions
  relBarbellDimensions = {
    relBarDiameter: 0,
    relSleeveDiameter: 0,
    relSleeveLength: 0,
    relFlangeDiameter: 0,
    relFlangeWidth: 0,
    relSleevePlusFlange: 0, // used to calculate bar length on canvas
    relCollarBigDiameter: 0,
    relCollarBigLength: 0,
    relCollarSmallDiameter: 0,
    relCollarSmallLength: 0,
    relCollarKnobHeight: 0,
    relCollarKnobLength: 0,
    relCollarPinHeight: 0,
    relCollarPinLength: 0,
  }

  // Plate dimensions in mm
  // kg: IPF regulation calibrated Eleiko plate schematics
  plateDimensions = {
    kg: {
      kgPlateDiameters: [450, 400, 400, 325, 228, 190, 160, 134, 112],
      kgPlateWidths: [26, 22, 22, 22, 21, 16, 12, 8, 7],
    }
  }

  // Computed plate dimensions
  relPlateDimensions = {
    kg: {
      relKgPlateDiameters: [],
      relKgrelPlateWidths: [],
    }

  }

  constructor(relBarDiameter: number) {
    this.update(relBarDiameter);
  }

  // Updates computed dimensions rel to given bar diameter
  update(relBarDiameter: number) {
    // Updates barbell dimensions
    const {
      barDiameter, sleeveDiameter, sleeveLength, flangeDiameter, flangeWidth,
      collarBigDiameter, collarSmallDiameter, collarPinLength, collarPinHeight,
      collarBigLength, collarSmallLength, collarKnobHeight, collarKnobLength
    } = this.barbellDimensions;

    const rbbd = this.relBarbellDimensions;
    rbbd.relBarDiameter = relBarDiameter;
    rbbd.relSleeveDiameter = rbbd.relBarDiameter * (sleeveDiameter / barDiameter);
    rbbd.relSleeveLength = rbbd.relBarDiameter * (sleeveLength / barDiameter);
    rbbd.relFlangeDiameter = rbbd.relBarDiameter * (flangeDiameter / barDiameter);
    rbbd.relFlangeWidth = rbbd.relBarDiameter * (flangeWidth / barDiameter);
    rbbd.relSleevePlusFlange = rbbd.relSleeveLength + rbbd.relFlangeWidth;
    rbbd.relCollarBigDiameter = rbbd.relBarDiameter * (collarBigDiameter / barDiameter);
    rbbd.relCollarSmallDiameter = rbbd.relBarDiameter * (collarSmallDiameter / barDiameter);
    rbbd.relCollarBigLength = rbbd.relBarDiameter * (collarBigLength / barDiameter);
    rbbd.relCollarSmallLength = rbbd.relBarDiameter * (collarSmallLength / barDiameter);
    rbbd.relCollarKnobHeight = rbbd.relBarDiameter * (collarKnobHeight / barDiameter);
    rbbd.relCollarKnobLength = rbbd.relBarDiameter * (collarKnobLength / barDiameter);
    rbbd.relCollarPinHeight = rbbd.relBarDiameter * (collarPinHeight / barDiameter);
    rbbd.relCollarPinLength = rbbd.relBarDiameter * (collarPinLength / barDiameter);

    // Updates plate dimensions
    const kgPlateDimensions = this.plateDimensions.kg;
    const kgPlateDiametersUpdated = [...kgPlateDimensions.kgPlateDiameters];
    for (let i = 0; i < kgPlateDiametersUpdated.length; i += 1) {
      kgPlateDiametersUpdated[i] = rbbd.relBarDiameter * (kgPlateDimensions.kgPlateDiameters[i] / barDiameter);
    }
    kgPlateDimensions.kgPlateDiameters = kgPlateDiametersUpdated;

    const kgPlateWidthsUpdated = [...kgPlateDimensions.kgPlateWidths];
    for (let i = 0; i < kgPlateWidthsUpdated.length; i += 1) {
      kgPlateWidthsUpdated[i] = relBarDiameter * (kgPlateDimensions.kgPlateWidths[i] / barDiameter);
    }
    kgPlateDimensions.kgPlateWidths = kgPlateWidthsUpdated;
  }
}

export default Dimension;
