const color = {
  equipment: {
    barMetal: 'hsl(0, 0%, 52.5%)',
    collarMetal: 'hsl(0, 0%, 39.2%)',
  },
  plates: {
    // Eye dropped Eleiko IPF calibrated kg plates
    kg: {
      '50': 'hsl(0, 0%, 17%)',
      '25': 'hsl(8, 51.8%, 50.4%)',
      '20': 'hsl(219, 46.8%, 39.8%)',
      '15': 'hsl(53, 100%, 44.7%)',
      '10': 'hsl(163, 60%, 27.5%)',
      '5': 'hsl(0, 0%, 92.2%)',
      '2.5': 'hsl(0, 0%, 29.4%)',
      '1.25': 'hsl(0, 0%, 75.3%)',
      '0.5': 'hsl(0, 0%, 75.3%)',
      '0.25': 'hsl(0, 0%, 75.3%)',
    },
    // Eye dropped calibrate 
    lb: {
      '55': 'hsl(355, 64%, 34%)',
      '45': 'hsl(215, 50%, 31%)',
      '35': 'hsl(47, 99%, 41%)',
      '25': 'hsl(120, 100%, 27%)',
      '10': 'hsl(0, 0%, 89%)',
      '5': 'hsl(330, 3%, 13%)',
      '2.5': 'hsl(0, 0%, 66%)',
      '1': 'hsl(0, 0%, 66%)',
      '0.5': 'hsl(0, 0%, 66%)',
      '0.25': 'hsl(0, 0%, 66%)',
    }
  },
  // Based on plate color, but optimized for visibility.
  inputText: {
    kg: {
      '50': 'hsl(0, 0%, 17%)',
      '25': 'hsl(8, 51.8%, 50.4%)',
      '20': 'hsl(219, 46.8%, 39.8%)',
      '15': 'hsl(53, 100%, 39.7%)',
      '10': 'hsl(163, 60%, 27.5%)',
      '5': 'hsl(0, 0%, 100%)',
      '2.5': 'hsl(0, 0%, 29.4%)',
      '1.25': 'hsl(0, 0%, 60.3%)',
      '0.5': 'hsl(0, 0%, 60.3%)',
      '0.25': 'hsl(0, 0%, 60.3%)',
    },
    lb: {
      '55': 'hsl(355, 64%, 34%)',
      '45': 'hsl(215, 50%, 31%)',
      '35': 'hsl(47, 99%, 41%)',
      '25': 'hsl(120, 100%, 27%)',
      '10': 'hsl(0, 0%, 100%)',
      '5': 'hsl(330, 3%, 13%)',
      '2.5': 'hsl(0, 0%, 66%)',
      '1': 'hsl(0, 0%, 66%)',
      '0.5': 'hsl(0, 0%, 66%)',
      '0.25': 'hsl(0, 0%, 66%)',
    }
  },
  // Takes an hsl string and adjusts its luminosity
  adjustLuminosity: (hslColor: string, delta: number): string => {
    let arr = hslColor.split(', ');
    let luminosity = parseFloat(arr[2]) + delta;
    // Clamps luminosity [0,100]
    luminosity = Math.max(0, Math.min(luminosity, 100))
    return [arr[0], arr[1], luminosity + '%)'].join(', ');
  }
};

export default color;
