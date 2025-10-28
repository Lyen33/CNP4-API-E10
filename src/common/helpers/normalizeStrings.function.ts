//esto es una funcion auxiliar para quitar espacios en blanco en todas las strings y ponerlas en minuscula
  export const normalizeStrings = function(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key in obj) {
      const value = obj[key];

      if (typeof value === "string") {
        result[key] = value.toLowerCase().trim();
      } else {
        result[key] = value;
      }
    }
    return result;
  }