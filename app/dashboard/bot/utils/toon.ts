import { encode, decode } from '@toon-format/toon';

/**
 * Converts a JSON object or string to TOON format.
 * Fallback to original JSON string on error.
 */
export function jsonToToon(obj: any): string {
    if (obj === undefined || obj === null) return '';
    
    try {
        // If it's a string, try to parse it as JSON first
        let data = obj;
        if (typeof obj === 'string') {
            // Check if it's already TOON-like (e.g. starts with tabular | or has keys without quotes)
            // But usually we can just try to parse as JSON.
            try {
                data = JSON.parse(obj);
            } catch {
                // Not JSON, might be raw text or TOON. 
                // We only want to convert JSON to TOON.
                return obj;
            }
        }
        
        // Encode to TOON
        return encode(data);
    } catch (error) {
        console.error("TOON encoding failed:", error);
        // Fallback to JSON string if it was an object
        return typeof obj === 'object' ? JSON.stringify(obj) : String(obj);
    }
}

/**
 * Converts TOON format back to JSON.
 * Returns the original string if decoding fails.
 */
export function toonToJson(toon: any): any {
    if (!toon) return toon;
    if (typeof toon !== 'string') return toon;
    
    try {
        // If it already looks like JSON, return it as object
        const trimmed = toon.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                return JSON.parse(toon);
            } catch {
                // Not valid JSON, try TOON decode
            }
        }
        
        // Decode from TOON
        return decode(toon);
    } catch (error) {
        // Not a valid TOON or error decoding, return as is
        return toon;
    }
}

/**
 * Safe conversion from JSON to TOON with error handling.
 */
export function safeJsonToToon(data: any): string {
    return jsonToToon(data);
}

