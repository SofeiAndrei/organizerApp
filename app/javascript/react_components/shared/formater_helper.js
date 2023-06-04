export const formatWords = (givenWordsCombined, allCaps = false) => {
  if(allCaps){
    return givenWordsCombined.toUpperCase().replaceAll('_', ' ')
  } else {
    const words = givenWordsCombined.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1))
    return words.join(' ')
  }
}