import { useState, useEffect } from 'react';

export interface GlucoseReading {
    id: string;
    value: number;
    timestamp: string;
    note?: string;
    type: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'other';
}

export function useGlucoseStore() {
    const [readings, setReadings] = useState<GlucoseReading[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('glucose-readings');
        if (saved) {
            setReadings(JSON.parse(saved));
        }
    }, []);

    const addReading = (value: number, type: GlucoseReading['type'], note?: string) => {
        const newReading: GlucoseReading = {
            id: crypto.randomUUID(),
            value,
            type,
            note,
            timestamp: new Date().toISOString(),
        };
        const updated = [newReading, ...readings];
        setReadings(updated);
        localStorage.setItem('glucose-readings', JSON.stringify(updated));
    };

    const deleteReading = (id: string) => {
        const updated = readings.filter(r => r.id !== id);
        setReadings(updated);
        localStorage.setItem('glucose-readings', JSON.stringify(updated));
    };

    return { readings, addReading, deleteReading };
}
