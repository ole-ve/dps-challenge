import axios from "axios";

/**
 * Return if a given input string has a length between 8 and 16 characters (inclusively).
 */
export function hasCorrectLength(password: string): boolean {
    return password.length >= 8 && password.length <= 16;
}

/**
 * Return if a given input string only consists of latin letters and digits and if the input contains at least one digit.
 */
export function hasValidCharacters(password: string): boolean {
    const pattern = /^(?=.*\d)[a-zA-Z0-9]+$/;
    return pattern.test(password);
}

/**
 * Determine all english words from a given input by extracting all words from the input and test individually.
 */
export async function determineEnglishWords(password: string): Promise<string[]> {
    // Check that no full english word is contained
    const words = extractPotentialWords(password);
    const relevantWords = words.filter(word => word.length >= 3);
    const englishCheckResult = await Promise.all(
        relevantWords.map(word => isEnglishWord(word).then(match => ({ word, match })))
    );
    return englishCheckResult.filter(entry => entry.match).map(entry => entry.word);
}

/**
 * Extract all potential words from a given input string. In this context, a word is the longest consecutive substring
 * of letters.
 */
function extractPotentialWords(input: string): string[] {
    const substrings: string[] = [];
    let currentSubstring = '';

    for (const char of input) {

        if (/[a-zA-Z]/.test(char)) {
            currentSubstring += char;
        } else if (currentSubstring) {
            substrings.push(currentSubstring);
            currentSubstring = '';
        }
    }

    // Add the last substring if it's not empty
    if (currentSubstring) {
        substrings.push(currentSubstring);
    }

    return substrings;
}

const dictionaryURL = "https://api.dictionaryapi.dev/api/v2/entries/en";

/**
 * Check if a given input string is an english word by calling the free dictionary API.
 */
async function isEnglishWord(word: string): Promise<boolean> {
    try {
        await axios.get(`${dictionaryURL}/${word}`);
        return true;
    } catch (e: any) {
        // The free dictionary API returns 404 if the word does not exist in their dictionary
        return e.response?.status !== 404;
    }
}
