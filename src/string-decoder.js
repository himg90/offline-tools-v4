/**
 * Main function to recursively decode a string
 * @param {string} input - The encoded string to decode
 * @param {number} maxDepth - Maximum recursion depth (default: 10)
 * @param {number} currentDepth - Current recursion depth (for internal use)
 * @returns {any} - The decoded result, could be string, object, array, etc.
 */
export function recursivelyDecode(input, maxDepth = 10, currentDepth = 0, debug = false) {
  if(debug) {
    console.log(`[Depth ${currentDepth}] Input: ${input}`);
  }
  // Prevent infinite recursion
  if (currentDepth >= maxDepth) {
    console.warn(`Maximum recursion depth (${maxDepth}) reached`);
    return input;
  }

  // Skip if input is not a string or is empty
  if (typeof input !== 'string' || input.trim() === '') {
    if(debug) {
      console.log(`[Depth ${currentDepth}] Input is not a string or is empty`);
    }
    return input;
  }

  try {
    
    // Try to decode as base64
    const base64Decoded = tryDecodeBase64(input);
    
    if (base64Decoded && base64Decoded !== input) {
      if(debug) {
        console.log(`[Depth ${currentDepth}] Base64 decoded: ${base64Decoded}`);
      }
      return recursivelyDecode(base64Decoded, maxDepth, currentDepth + 1, debug);
    }

    // Try to parse as JSON
    const jsonParsed = tryParseJson(input);
    if (jsonParsed !== undefined && jsonParsed !== input) {
      if(debug) {
        var stringified = JSON.stringify(jsonParsed);
        console.log(`[Depth ${currentDepth}] JSON parsed: ${stringified}`);
      }
      
      // If result is a string, continue decoding
      if (typeof jsonParsed === 'string') {
        return recursivelyDecode(jsonParsed, maxDepth, currentDepth + 1, debug);
      }
      
      // If result is an object or array, recursively decode its string values
      if (typeof jsonParsed === 'object' && jsonParsed !== null) {
        return processObjectValues(jsonParsed, maxDepth, currentDepth + 1, debug);
      }
      
      return jsonParsed;
    }

    // Try to unescape JSON string
    const unescaped = tryUnescapeJsonString(input);
    if (unescaped && unescaped !== input) {
      console.log(`[Depth ${currentDepth}] Unescaped JSON string`);
      return recursivelyDecode(unescaped, maxDepth, currentDepth + 1);
    }

    // No transformations worked, return the original input
    if(debug) {
      console.log(`[Depth ${currentDepth}] No transformations worked, returning original input: ${input}`);
    }
    return input;
  } catch (error) {
    console.error(`Error at depth ${currentDepth}:`, error);
    return input;
  }
}

/**
 * Try to decode a base64 string
 * @param {string} input - Potentially base64 encoded string
 * @returns {string|null} - Decoded string or null if not valid base64
 */
export function tryDecodeBase64(input) {
  // Skip obvious non-base64 inputs
  if (!/^[A-Za-z0-9+/=%]+$/.test(input)) {
    return null;
  }

  // Check for valid base64 length (multiple of 4)
  if((input.length % 4 !== 0)) {
    return null;
  }

  try {
    // Use browser's atob for base64 decoding
    const decoded = atob(input);
    
    // Convert to UTF-8 string
    const bytes = new Uint8Array([...decoded].map(char => char.charCodeAt(0)));
    const utf8String = new TextDecoder().decode(bytes);
    
    // Simple ASCII validation: only accept strings that consist entirely of printable ASCII
    // This covers codes 32-126 (space through ~)
    for (let i = 0; i < utf8String.length; i++) {
      const code = utf8String.charCodeAt(i);
      if (code < 32 || code > 126) {
        return null; // Non-ASCII or control character found, reject the result
      }
    }
    
    return utf8String;
  } catch (error) {
    return null;
  }
}

/**
 * Try to parse a JSON string
 * @param {string} input - Potentially JSON string
 * @returns {any|undefined} - Parsed object or undefined if not valid JSON
 */
export function tryParseJson(input) {
  try {
    return JSON.parse(input);
  } catch (error) {
    return undefined;
  }
}

/**
 * Try to unescape a JSON string (e.g., "{\\"key\\":\\"value\\"}" -> {"key":"value"})
 * @param {string} input - Potentially escaped JSON string
 * @returns {string|null} - Unescaped string or null if not valid
 */
export function tryUnescapeJsonString(input) {
  let unescapedString = input.replace(/\\\\/g, '\\')
  while(unescapedString !== input) {
    input = unescapedString;
    unescapedString = input.replace(/\\\\/g, '\\');
  }
  unescapedString = unescapedString
  .replace(/\\"/g, '"')      // Replace escaped double quotes (\" -> ")
  .replace(/\\n/g, '')      // Replace escaped newlines (\n -> newline)
  .replace(/\\r/g, '')      // Replace escaped carriage return (\r -> carriage return)
  .replace(/\\t/g, ' ');     // Replace escaped tabs (\t -> tab)   // Replace escaped backslashes (\\ -> \)
  
  try {
    // Remove outer quotes if present and parse
    if ((unescapedString.startsWith('"') && unescapedString.endsWith('"')) || 
        (unescapedString.startsWith("'") && unescapedString.endsWith("'"))) {
      return JSON.parse(unescapedString);
    }
  } catch (error) {
  }

  return unescapedString;
}

/**
 * Process object values recursively
 * @param {object|array} obj - Object or array to process
 * @param {number} maxDepth - Maximum recursion depth
 * @param {number} currentDepth - Current recursion depth
 * @returns {object|array} - Processed object or array
 */
function processObjectValues(obj, maxDepth, currentDepth, debug = false) {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'string') {
        return recursivelyDecode(item, maxDepth, currentDepth, debug);
      } else if (typeof item === 'object' && item !== null) {
        return processObjectValues(item, maxDepth, currentDepth, debug);
      }
      return item;
    });
  } else {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        result[key] = recursivelyDecode(obj[key], maxDepth, currentDepth, debug);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = processObjectValues(obj[key], maxDepth, currentDepth, debug);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }
}