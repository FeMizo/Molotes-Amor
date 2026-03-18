const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const normalizePhone = (value: string): string => value.replace(/\D/g, "");

export const isValidEmail = (value: string): boolean => emailPattern.test(normalizeEmail(value));

export const isValidPhone = (value: string): boolean => {
  const normalized = normalizePhone(value);
  return normalized.length >= 10 && normalized.length <= 15;
};

export const assertValidEmail = (value: string, message = "Ingresa un correo valido."): string => {
  const normalized = normalizeEmail(value);
  if (!isValidEmail(normalized)) {
    throw new Error(message);
  }

  return normalized;
};

export const assertValidPhone = (
  value: string,
  message = "Ingresa un telefono valido de 10 a 15 digitos.",
): string => {
  const normalized = normalizePhone(value);
  if (!isValidPhone(normalized)) {
    throw new Error(message);
  }

  return normalized;
};
