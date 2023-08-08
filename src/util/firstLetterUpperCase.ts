// Simple method to take a string and make the first character uppercase
const firstLetterUpperCase = (str: string) => {
    // Take everything but the first character
    const subString = str.substring(1, str.length)

    // Return the first character uppercased, plus the rest of it in it's original state
    return str.charAt(0).toUpperCase() + subString
}

export default firstLetterUpperCase