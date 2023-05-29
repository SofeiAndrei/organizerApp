export const formatStatus = (givenStatus, allCaps) => {
  if(allCaps){
    return givenStatus.toUpperCase().replaceAll('_', ' ')
  } else {
    const words = givenStatus.split("_").map(word => capitalize(word))
    const capitalize = (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
    return words.join(' ')
  }

}