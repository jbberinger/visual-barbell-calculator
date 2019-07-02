// All dimensions are in mm and based on real world data sheets.
// Relative dimensions are computed based on relative bar diameter.
class Dimension {
  // Dimensions in mm from IPF regulation Eleiko barbell datasheet. Any 
  // measurements not listed by Eleiko have been estimated.
  barbellDimensions = {
    barDiameter: 29,
    sleeveDiameter: 52,
    sleeveLength: 433,
    flangeDiameter: 84, // best estimate
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

  // Stores computed relative dimensions.
  relBarbellDimensions = {
    relBarDiameter: 0,
    relSleeveDiameter: 0,
    relSleeveLength: 0,
    relFlangeDiameter: 0,
    relFlangeWidth: 0,
    relSleevePlusFlange: 0,
    relCollarBigDiameter: 0,
    relCollarBigLength: 0,
    relCollarSmallDiameter: 0,
    relCollarSmallLength: 0,
    relCollarKnobHeight: 0,
    relCollarKnobLength: 0,
    relCollarPinHeight: 0,
    relCollarPinLength: 0,
    relCollarTotalLength: 0,
  }

  plateDimensions = {
    // All but 100kg paralympic plate are IPF regulation Eleiko plates
    // Weight reference (kg): [50, 25, 15, 10, 5, 2.5, 1.25, 0.5, 0.25]
    kg: {
      kgPlateDiameters: [450, 450, 400, 400, 325, 228, 190, 160, 134, 112],
      kgPlateWidths: [50, 26, 22, 22, 22, 21, 16, 12, 8, 7],
    },
    // Rogue calibrated lb steel plate dimensions
    // Weight reference (lb): [55, 45, 35, 25, 10, 5, 2.5, 1, 0.5, 0.25]
    lb: {
      lbPlateDiameters: [450, 450, 400, 325, 228, 190, 160, 134, 112, 90],
      lbPlateWidths: [27, 22, 21, 23, 19, 14.5, 10, 7, 5.5, 4.5],
    }
  }

  // Computed relative plate dimensions
  relPlateDimensions = {
    kg: {
      relKgPlateDiameters: [],
      relKgrelPlateWidths: [],
    },
    lb: {
      relLbPlateDiameters: [],
      relLbrelPlateWidths: [],
    }
  }

  constructor(relBarDiameter: number) {
    this.update(relBarDiameter);
  };

  // Updates dimensions relative to given bar diameter
  update(relBarDiameter: number) {
    const {
      barDiameter, sleeveDiameter, sleeveLength, flangeDiameter, flangeWidth,
      collarBigDiameter, collarSmallDiameter, collarPinLength, collarPinHeight,
      collarBigLength, collarSmallLength, collarKnobHeight, collarKnobLength,
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
    rbbd.relCollarTotalLength = rbbd.relCollarSmallLength + rbbd.relCollarBigLength;

    // Updates kg plate dimensions.
    const { kgPlateDiameters, kgPlateWidths } = this.plateDimensions.kg;
    const kgPlateDiametersUpdated = [...kgPlateDiameters];
    const kgPlateWidthsUpdated = [...kgPlateWidths];
    for (let i = 0; i < kgPlateDiametersUpdated.length; i += 1) {
      kgPlateDiametersUpdated[i] = rbbd.relBarDiameter * (kgPlateDiameters[i] / barDiameter);
      kgPlateWidthsUpdated[i] = relBarDiameter * (kgPlateWidths[i] / barDiameter);
    }
    this.plateDimensions.kg.kgPlateDiameters = kgPlateDiametersUpdated;
    this.plateDimensions.kg.kgPlateWidths = kgPlateWidthsUpdated;

    // Updates lb plate dimensions.
    const lbPlateDimensions = this.plateDimensions.lb;
    const lbPlateDiametersUpdated = [...lbPlateDimensions.lbPlateDiameters];
    for (let i = 0; i < lbPlateDiametersUpdated.length; i += 1) {
      lbPlateDiametersUpdated[i] = rbbd.relBarDiameter * (lbPlateDimensions.lbPlateDiameters[i] / barDiameter);
    }
    lbPlateDimensions.lbPlateDiameters = lbPlateDiametersUpdated;

    const lbPlateWidthsUpdated = [...lbPlateDimensions.lbPlateWidths];
    for (let i = 0; i < lbPlateWidthsUpdated.length; i += 1) {
      lbPlateWidthsUpdated[i] = relBarDiameter * (lbPlateDimensions.lbPlateWidths[i] / barDiameter);
    }
    lbPlateDimensions.lbPlateWidths = lbPlateWidthsUpdated;
    console.log(`updated lb plate dimensions`)
  }
}


export default Dimension;
