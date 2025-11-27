'use client';

import { ReactNode, useEffect } from 'react';

export function MiniAppBootstrap({ children }: { children: ReactNode }) {
    useEffect(() => {
        let cancelled = false;

        async function init() {
            if (typeof window === 'undefined') return;

            const { sdk } = await import('@farcaster/miniapp-sdk');

            if (!sdk.isInMiniApp()) return;

            if (!cancelled) {
                await sdk.actions.ready();
            }
        }

        init().catch((err) => {
            console.error('MiniApp init error', err);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return <>{children}</>;
}
