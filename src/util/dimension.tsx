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
    // collarTotalLength: 110,
    // collarBigDiameter: 93,
    // collarSmallDiameter: 73,
    // collarPinLength: 93,
    // collarPinHeight: 11.63,
    // collarBigLength: 60.50,
    // collarSmallLength: 49.50,
    // collarKnobHeight: 23.25,
    // collarKnobLength: 18.15,
    collarTotalLength: 55,
    collarBigDiameter: 93,
    collarSmallDiameter: 73,
    collarPinLength: 46.5,
    collarPinHeight: 11.63,
    collarBigLength: 30.25,
    collarSmallLength: 24.75,
    collarKnobHeight: 23.25,
    collarKnobLength: 9.75,
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
      kgPlateDiameters: {
        '50': 450,
        '25': 450,
        '15': 400,
        '10': 325,
        '5': 228,
        '2.5': 190,
        '1.25': 160,
        '0.5': 134,
        '0.25': 112,
      },
      kgPlateWidths: {
        '50': 50,
        '25': 27,
        '15': 22.5,
        '10': 21,
        '5': 21.5,
        '2.5': 16,
        '1.25': 12,
        '0.5': 8,
        '0.25': 6,
      },
    },
    // Rogue calibrated lb steel plate dimensions
    // Weight reference (lb): [55, 45, 35, 25, 10, 5, 2.5, 1, 0.5, 0.25]
    lb: {
      lbPlateDiameters: {
        '55': 450,
        '45': 450,
        '35': 400,
        '25': 325,
        '10': 228,
        '5': 190,
        '2.5': 160,
        '1': 134,
        '0.5': 112,
        '0.25': 90,
      },
      lbPlateWidths: {
        '55': 27,
        '45': 22,
        '35': 21,
        '25': 23,
        '10': 19,
        '5': 14.5,
        '2.5': 10,
        '1': 7,
        '0.5': 5.5,
        '0.25': 4.5,
      },
    }
  }

  // Computed relative plate dimensions
  relPlateDimensions = {
    kg: {
      relKgPlateDiameters: {},
      relKgPlateWidths: {},
    },
    lb: {
      relLbPlateDiameters: {},
      relLbPlateWidths: {},
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
    const kgPlateDiametersUpdated: any = { ...kgPlateDiameters };
    const kgPlateWidthsUpdated: any = { ...kgPlateWidths };
    for (const plate in kgPlateDiametersUpdated) {
      kgPlateDiametersUpdated[plate] = rbbd.relBarDiameter * (kgPlateDiametersUpdated[plate] / barDiameter);
      kgPlateWidthsUpdated[plate] = relBarDiameter * (kgPlateWidthsUpdated[plate] / barDiameter);
    }
    this.relPlateDimensions.kg.relKgPlateDiameters = { ...kgPlateDiametersUpdated };
    this.relPlateDimensions.kg.relKgPlateWidths = { ...kgPlateWidthsUpdated };

    // Updates lb plate dimensions.
    const { lbPlateDiameters, lbPlateWidths } = this.plateDimensions.lb;
    const lbPlateDiametersUpdated: any = { ...lbPlateDiameters };
    const lbPlateWidthsUpdated: any = { ...lbPlateWidths };
    for (const plate in lbPlateDiametersUpdated) {
      lbPlateDiametersUpdated[plate] = rbbd.relBarDiameter * (lbPlateDiametersUpdated[plate] / barDiameter);
      lbPlateWidthsUpdated[plate] = relBarDiameter * (lbPlateWidthsUpdated[plate] / barDiameter);
    }
    this.relPlateDimensions.lb.relLbPlateDiameters = { ...lbPlateDiametersUpdated };
    this.relPlateDimensions.lb.relLbPlateWidths = { ...lbPlateWidthsUpdated };
  }
}


export default Dimension;
