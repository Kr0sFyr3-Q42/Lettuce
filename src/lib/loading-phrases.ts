// Max ~15 characters per phrase so the heading stays visually stable
export const LOADING_PHRASES = [
  'cook',
  'plan',
  'add some spice',
  'get in the mood',
  'wrap it up',
  'make a salad',
  'look some more',
  'get cooking',
  'check the fridge',
  'look for nice recipes',
  'find some inspiration',
  'get your apron',
  'mix it up',
  'keep it fresh',
  'season to taste',
  'chop chop',
  'heat things up',
  'think big',
  'get creative',
  'taste test',
  'stir it up',
  'whip it up',
  'simmer down',
  'get saucy',
  'slice and dice',
  'add some flavor',
  'try something new',
  'make it tasty',
]

export function shufflePhrases(): string[] {
  return [...LOADING_PHRASES].sort(() => Math.random() - 0.5)
}
