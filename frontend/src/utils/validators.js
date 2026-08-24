export const isValidGSTIN = (value) => {
  const gstin = value.trim().toUpperCase();

  return (
    gstin.length === 15 &&
    /^[0-9]{2}[A-Z0-9]{13}$/.test(gstin)
  );
};

export const isValidPAN = (value) => {
  const pan = value.trim().toUpperCase();

  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
};

export const isValidMobile = (value) => {
  return /^[6-9][0-9]{9}$/.test(value.trim());
};