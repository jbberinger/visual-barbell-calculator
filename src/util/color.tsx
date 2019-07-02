const color = {
  equipment: {
    barMetal: 'hsl(0, 0%, 52.5%)',
    collarMetal: 'hsl(0, 0%, 39.2%)',
  },
  plates: {
    // Eye dropped Eleiko IPF calibrated kg plates
    kg: {
      black50: 'hsl(0, 0%, 17%',
      red25: 'hsl(8, 51.8%, 50.4%)',
      blue20: 'hsl(219, 46.8%, 39.8%)',
      yellow15: 'hsl(53, 100%, 44.7%)',
      green10: 'hsl(163, 60%, 27.5%)',
      white5: 'hsl(0, 0%, 92.2%)',
      gray2point5: 'hsl(0, 0%, 29.4%)',
      chrome1point25: 'hsl(0, 0%, 75.3%)',
      chrome0point5: 'hsl(0, 0%, 75.3%)',
      chrome0point25: 'hsl(0, 0%, 75.3%)',
    },
    // Eye dropped calibrate 
    lb: {
      red55: 'hsl(355, 64%, 34%)',
      blue45: 'hsl(215, 50%, 31%)',
      yellow35: 'hsl(47, 99%, 41%)',
      green25: 'hsl(120, 100%, 27%)',
      white10: 'hsl(0, 0%, 89%)',
      black5: 'hsl(330, 3%, 13%)',
      chrome2point5: 'hsl(0, 0%, 66%)',
      chrome1: 'hsl(0, 0%, 66%)',
      chrome0point5: 'hsl(0, 0%, 66%)',
      chrome0point25: 'hsl(0, 0%, 66%)',
    }
  },
  // Based on plate color, but optimized for visibility.
  inputText: {
    kg: {
      black50: 'hsl(0, 0%, 17%',
      red25: 'hsl(8, 51.8%, 50.4%)',
      blue20: 'hsl(219, 46.8%, 39.8%)',
      yellow15: 'hsl(53, 100%, 39.7%)',
      green10: 'hsl(163, 60%, 27.5%)',
      white5: 'hsl(0, 0%, 100%)',
      gray2point5: 'hsl(0, 0%, 29.4%)',
      silver1point25: 'hsl(0, 0%, 60.3%)',
      silver0point5: 'hsl(0, 0%, 60.3%)',
      silver0point25: 'hsl(0, 0%, 60.3%)',
    },
    lb: {
      red55: 'hsl(355, 64%, 34%)',
      blue45: 'hsl(215, 50%, 31%)',
      yellow35: 'hsl(47, 99%, 41%)',
      green25: 'hsl(120, 100%, 27%)',
      white10: 'hsl(0, 0%, 89%)',
      black5: 'hsl(330, 3%, 13%)',
      chrome2point5: 'hsl(0, 0%, 66%)',
      chrome1: 'hsl(0, 0%, 66%)',
      chrome0point5: 'hsl(0, 0%, 66%)',
      chrome0point25: 'hsl(0, 0%, 66%)',
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
