'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(mq: string) {

    const [matches, setMatch] = useState(
        () => typeof window !== 'undefined' ? window.matchMedia(mq).matches : false,
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mql = window.matchMedia(mq);
            const listener = (e: any) => setMatch(e.matches);
            mql.addEventListener('change', listener);
            return () => mql.removeEventListener('change', listener);
        }
    }, [mq]);

    return matches;
}
