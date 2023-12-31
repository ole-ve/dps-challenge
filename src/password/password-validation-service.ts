import axios from "axios";

/**
 * Return if a given input string has a length between 8 and 16 characters (inclusively).
 */
export function hasCorrectLength(password: string): boolean {
    return password.length >= 8 && password.length <= 16;
}

/**
 * Return if a given input string only consists of latin letters and digits.
 */
export function hasValidCharacters(password: string): boolean {
    const pattern = /^[A-Za-z0-9]*$/;
    return pattern.test(password);
}

/**
 * Return if a given input string contains at least one digit.
 */
export function containsMinimumOneDigit(password: string): boolean {
    const pattern = /\d/;
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
const ENGLISH_WORDS_CACHE = new Map<string, boolean>();

/**
 * Check if a given input string is an english word by calling the free dictionary API.
 * Caches the results in ENGLISH_WORDS_CACHE.
 */
async function isEnglishWord(word: string): Promise<boolean> {
    if (ENGLISH_WORDS_CACHE.has(word)) {
        return ENGLISH_WORDS_CACHE.get(word)!;
    }

    try {
        await axios.get(`${dictionaryURL}/${word}`);
        ENGLISH_WORDS_CACHE.set(word, true);
        return true;
    } catch (e: any) {
        // The free dictionary API returns 404 if the word does not exist in their dictionary
        ENGLISH_WORDS_CACHE.set(word, false);
        return e.response?.status !== 404;
    }
}
