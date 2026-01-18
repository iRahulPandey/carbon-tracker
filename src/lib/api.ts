'use server';

import { CarbonData } from './types';

export const calculateCarbon = async (
    bytes: number,
    isGreen: boolean
): Promise<CarbonData> => {
    // Ensure bytes is an integer for the API
    const intBytes = Math.round(bytes);
    const greenParam = isGreen ? 1 : 0;

    try {
        console.log(`Calling API with bytes=${intBytes}, green=${greenParam}`);

        const response = await fetch(
            `https://api.websitecarbon.com/data?bytes=${intBytes}&green=${greenParam}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    // Use a standard browser-like UA to avoid simple blocking
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            // If API fails, we throw to let the UI handle it (req: "stick to api calls")
            throw new Error(`Carbon API error: ${response.status}`);
        }

        const data = await response.json();

        // The API returns distinct structure, we just map strictly what we need
        return {
            ...data,
            green: isGreen, // Ensure our updated green status is reflected if API doesn't echo it
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('Calculate Carbon Error:', error);
        throw error;
    }
};
