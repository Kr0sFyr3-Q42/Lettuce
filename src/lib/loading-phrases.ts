export const LOADING_PHRASES = [
  'Cook',
  'Plan',
  'find the good ingredients',
  'add some spice',
  'wrap it up',
  'make a salad',
  'look some more',
  'get cooking',
  'check the fridge',
  'think of something tasty',
  'mix it up',
  'keep it fresh',
  'season to taste',
  'chop chop',
  'heat things up',
]

export function shufflePhrases(): string[] {
  return [...LOADING_PHRASES].sort(() => Math.random() - 0.5)
}
