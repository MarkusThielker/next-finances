import { useEffect, useMemo, useState } from 'react';

export function useMediaQuery(mq: string) {

    const mql = useMemo(() => matchMedia(mq), [mq]);
    const [matches, setMatch] = useState(mql.matches);

    useEffect(() => {
        const listener = (e: any) => setMatch(e.matches);
        mql.addEventListener('change', listener);

        return () => mql.removeEventListener('change', listener);
    }, [mq, mql]);

    return matches;
}
