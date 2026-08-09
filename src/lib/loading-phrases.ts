// Max ~15 characters per phrase so the heading stays visually stable
export const LOADING_PHRASES = [
  'Cook',
  'Plan',
  'add some spice',
  'wrap it up',
  'make a salad',
  'look some more',
  'get cooking',
  'check the fridge',
  'mix it up',
  'keep it fresh',
  'season to taste',
  'chop chop',
  'heat things up',
  'think big',
  'stay hungry',
]

export function shufflePhrases(): string[] {
  return [...LOADING_PHRASES].sort(() => Math.random() - 0.5)
}
