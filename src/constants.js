const CORPORATION_TYPES = {
  small: {
    "2": { price: 200 },
    "3": { price: 300 },
    "4": { price: 400 },
    "5": { price: 500 },
    "6-10": { price: 600 },
    "11-20": { price: 700 },
    "21-30": { price: 800 },
    "31-40": { price: 900 },
    "41+": { price: 1000 },
  },
  medium: {
    "2": { price: 300 },
    "3": { price: 400 },
    "4": { price: 400 },
    "5": { price: 600 },
    "6-10": { price: 700 },
    "11-20": { price: 800 },
    "21-30": { price: 900 },
    "31-40": { price: 1000 },
    "41+": { price: 1100 },
  },
  large: {
    "2": { price: 400 },
    "3": { price: 500 },
    "4": { price: 600 },
    "5": { price: 700 },
    "6-10": { price: 800 },
    "11-20": { price: 900 },
    "21-30": { price: 1000 },
    "31-40": { price: 1100 },
    "41+": { price: 1200 },
  },
};

module.exports = {
  CORPORATION_TYPES,
};
