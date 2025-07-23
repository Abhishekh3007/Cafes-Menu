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
      return '🧁🧁'
    case 2:
      return '🧁🧁🧁'
    default:
      return ''
  }
}

export const getMenuItemEmojis = (isSpicy: number, isSweet: number): string => {
  const spicyEmojis = getSpicyEmojis(isSpicy)
  const sweetEmojis = getSweetEmojis(isSweet)
  
  if (spicyEmojis && sweetEmojis) {
    return `${spicyEmojis} ${sweetEmojis}`
  }
  
  return spicyEmojis || sweetEmojis
}
