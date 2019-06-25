const color = {
  barbell: {
    barMetal: 'hsl(0, 0%, 52.5%)',
    collarMetal: 'hsl(0, 0%, 39.2%)',
  },
  plates: {
    // Eye dropped Eleiko IPF calibrated kg plates
    kg: {
      red25: 'hsl(8, 51.8%, 50.4%)',
      blue20: 'hsl(219, 46.8%, 39.8%)',
      yellow15: 'hsl(53, 100%, 44.7%)',
      green10: 'hsl(163, 60%, 27.5%)',
      white5: 'hsl(0, 0%, 92.2%)',
      gray2point5: 'hsl(0, 0%, 29.4%)',
      silver1point25: 'hsl(0, 0%, 75.3%)',
      silver0point5: 'hsl(0, 0%, 75.3%)',
      silver0point25: 'hsl(0, 0%, 75.3%)',
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
}

export default color;
