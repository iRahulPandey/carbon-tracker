import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getEnvironmentalEquivalents = (
    gCO2: number,
    bytes: number
) => {
    // Assuming 10,000 monthly page views for annual impact projection
    const monthlyViews = 10000;
    // Annual CO2 in kg
    const annualCO2Kg = (gCO2 * monthlyViews * 12) / 1000;

    return {
        trees: {
            value: (annualCO2Kg / 21).toFixed(1), // 1 tree absorbs ~21kg CO2/year
            label: 'trees needed to absorb annual emissions',
        },
        carMiles: {
            value: (gCO2 / 404).toFixed(1), // 404g per mile
            label: 'miles driven in an average car',
        },
        phoneCharges: {
            value: (gCO2 / 8).toFixed(1), // ~8g CO2 per phone charge
            label: 'smartphone charges',
        },
        teaCups: {
            value: (gCO2 / 71).toFixed(1), // ~71g CO2 to boil kettle for 1 cup
            label: 'cups of tea boiled',
        },
        dataSize: {
            value: (bytes / 1024 / 1024).toFixed(1), // Convert to MB
            label: 'MB of data transferred',
        },
    };
};

export const getEcoPersona = (rating: string): { title: string; emoji: string; description: string } => {
    switch (rating) {
        case 'A+':
            return { title: 'Digital Saint', emoji: '😇', description: 'Your footprint is virtually non-existent!' };
        case 'A':
            return { title: 'Eco-Guardian', emoji: '🛡️', description: 'Protecting the planet, one pixel at a time.' };
        case 'B':
            return { title: 'Carbon Conscious', emoji: '🌱', description: 'Better than most, but room to grow.' };
        case 'C':
            return { title: 'Average Joe', emoji: '😐', description: 'Not great, not terrible. Just average.' };
        case 'D':
            return { title: 'Digital Polluter', emoji: '🏭', description: 'Your website creates a small smog cloud.' };
        case 'E':
            return { title: 'Smog Generator', emoji: '🌫️', description: 'You might need some carbon offsets...' };
        case 'F':
            return { title: 'Climate Villain', emoji: '😈', description: 'Your website is actively melting ice caps.' };
        default:
            return { title: 'Unknown Entity', emoji: '👽', description: 'We are not sure what you are.' };
    }
};

export const getRatingColor = (rating: string): string => {
    if (rating === 'A+') return 'text-emerald-500'; // Deep Green
    if (['A', 'B'].includes(rating)) return 'text-green-500';
    if (['C', 'D'].includes(rating)) return 'text-yellow-500';
    if (rating === 'E') return 'text-orange-500';
    return 'text-red-500'; // F rating or unknown
};
