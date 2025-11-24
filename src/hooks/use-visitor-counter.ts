'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useVisitorCounter(username: string) {
    const [views, setViews] = useState<number | null>(null);

    useEffect(() => {
        if (!username) return;

        const countView = async () => {
            const storageKey = `gitfolio-view-${username}`;
            const hasViewed = localStorage.getItem(storageKey);
            const docRef = doc(db, 'portfolios', username);

            try {
                // 1. Get current count
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setViews(docSnap.data().views || 0);
                } else {
                    setViews(0);
                }

                // 2. Increment if new visitor (debounced by localStorage)
                // In dev mode, React Strict Mode runs effects twice, so we need this check
                if (!hasViewed) {
                    if (!docSnap.exists()) {
                        await setDoc(docRef, {
                            views: 1,
                            createdAt: serverTimestamp(),
                            username: username
                        });
                        setViews(1);
                    } else {
                        await updateDoc(docRef, {
                            views: increment(1)
                        });
                        setViews((prev) => (prev ? prev + 1 : 1));
                    }

                    // Mark as viewed for 1 hour (or session)
                    localStorage.setItem(storageKey, Date.now().toString());
                }
            } catch (error) {
                console.error("Error updating view count:", error);
            }
        };

        countView();
    }, [username]);

    return views;
}
