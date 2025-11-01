export const roundUpToNearest50 = (value) => Math.ceil(value / 50) * 50;

export const formatCurrency = (value) =>
  `Tk ${Number(value).toLocaleString("en-IN")}`;

export const formatPercentage = (value) =>
  `${(Number(value) * 100).toFixed(2)}%`;
