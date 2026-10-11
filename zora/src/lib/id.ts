/** Id curto e único o bastante para os dados fictícios (ex.: adr-lk3f9a2x). */
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
