// Menu emoji utility functions
export const getSpicyEmojis = (spicyLevel: number): string => {
  switch (spicyLevel) {
    case 1:
      return '🌶️'
    case 2:
      return '🌶️🌶️'
    default:
      return ''
  }
}

export const getSweetEmojis = (sweetLevel: number): string => {
  switch (sweetLevel) {
    case 1:
      return '��'
    case 2:
      return '���'
    default:
      return ''
  }
}

export const getMenuItemEmojis = (isSpicy: number, isSweet: number): string => {
  // Prioritize spicy over sweet to avoid mixing emojis
  if (isSpicy > 0) {
    return getSpicyEmojis(isSpicy)
  }
  
  if (isSweet > 0) {
    return getSweetEmojis(isSweet)
  }
  
  return ''
}
