import { useState, useCallback, useRef } from 'react';
import { startSearchPrices, getSearchPrices, stopSearchPrices, getHotels } from '../services/api';

export interface TourResult {
    priceId: string;
    hotelId: number;
    price: number;
    startDate: string;
    endDate: string;
}

export interface HotelEntity {
    id: number;
    name: string;
    city: string;
    country: string;
    images: string[];
}

export interface SearchState {
    status: 'idle' | 'loading' | 'waiting' | 'success' | 'error' | 'cancelled' | 'fetching_hotels';
    token: string | null;
    tourResults: TourResult[] | null;
    hotelsMap: Map<number, HotelEntity> | null;
    error: string | null;
}

const MAX_RETRIES = 2;

export const useTourSearch = () => {
    const [searchState, setSearchState] = useState<SearchState>({
        status: 'idle',
        token: null,
        tourResults: null,
        hotelsMap: null,
        error: null,
    });

    const activeSearchRef = useRef<{ token: string, countryId: string } | null>(null);
    const isCanceledRef = useRef(false);

    const getTimeoutIdKey = (token: string) => `searchTimeout_${token}`;

    const clearTimeoutByToken = (token: string) => {
        const timeoutId = (window as any)[getTimeoutIdKey(token)];
        if (timeoutId) {
            clearTimeout(timeoutId);
            delete (window as any)[getTimeoutIdKey(token)];
        }
    };

    const fetchAndAggregateHotels = useCallback(async (countryId: string, token: string, tourResults: TourResult[]) => {
        if (isCanceledRef.current || token !== activeSearchRef.current?.token) {
            setSearchState((prev) => ({ ...prev, status: 'cancelled' }));
            return;
        }

        setSearchState((prev) => ({ ...prev, status: 'fetching_hotels' }));

        try {
            const hotelResponse = await getHotels(countryId);
            const rawHotels = await hotelResponse.json();

            const hotelsMap = new Map<number, HotelEntity>();
            Object.values(rawHotels).forEach((hotel: any) => {
                hotelsMap.set(hotel.id, {
                    id: hotel.id,
                    name: hotel.name,
                    city: hotel.cityName,
                    country: hotel.countryName,
                    images: [hotel.img],
                } as HotelEntity);
            });

            setSearchState({
                status: 'success',
                token,
                tourResults: tourResults.sort((a, b) => a.price - b.price),
                hotelsMap,
                error: null,
            });

        } catch (hotelError) {
            console.error("Помилка завантаження готелів:", hotelError);
            setSearchState({
                status: 'error',
                token,
                tourResults,
                hotelsMap: new Map(),
                error: 'Пошук завершено, але не вдалося завантажити деталі готелів.',
            });
        }
    }, []);

    const fetchResults = useCallback(async (token: string, countryId: string, retryCount: number = 0) => {
        if (isCanceledRef.current || token !== activeSearchRef.current?.token) return;

        try {
            const response = await getSearchPrices(token);

            if (response.status === 200) {
                const data = await response.json();

                const rawPrices = data.prices || {};

                const tourResults: TourResult[] = Object.values(rawPrices)
                    .map((tour: any) => {
                        if (!tour.hotelID || !tour.id || typeof tour.amount !== 'number') return null;
                        return {
                            priceId: tour.id,
                            hotelId: Number(tour.hotelID), // КРИТИЧНО: перетворюємо рядок на число для зіставлення з Map
                            price: tour.amount,
                            startDate: tour.startDate,
                            endDate: tour.endDate,
                        };
                    })
                    .filter((tour): tour is TourResult => tour !== null && tour.hotelId > 0);

                fetchAndAggregateHotels(countryId, token, tourResults);

            } else if (response.status === 425) {
                const errorData = await response.json();
                const newWaitUntil = errorData.waitUntil || new Date(Date.now() + 5000).toISOString();

                if (token === activeSearchRef.current?.token) {
                    setSearchState((prev) => ({ ...prev, status: 'waiting' }));
                    scheduleNextAttempt(token, countryId, newWaitUntil);
                }

            } else {
                // ПОМИЛКА: 4xx, 5xx (Ретрай)
                if (retryCount < MAX_RETRIES) {
                    setTimeout(() => fetchResults(token, countryId, retryCount + 1), 3000);
                } else {
                    if (token === activeSearchRef.current?.token) {
                        setSearchState({
                            status: 'error',
                            token,
                            tourResults: null,
                            hotelsMap: null,
                            error: `Помилка пошуку (HTTP ${response.status}). Досягнуто ліміту спроб.`,
                        });
                    }
                }
            }
        } catch (error) {
            // Критична мережева помилка
            if (retryCount < MAX_RETRIES) {
                setTimeout(() => fetchResults(token, countryId, retryCount + 1), 3000);
            } else {
                if (token === activeSearchRef.current?.token) {
                    setSearchState({
                        status: 'error',
                        token,
                        tourResults: null,
                        hotelsMap: null,
                        error: `Критична помилка мережі. Досягнуто ліміту спроб.`,
                    });
                }
            }
        }
    }, [fetchAndAggregateHotels]);


    const scheduleNextAttempt = useCallback((token: string, countryId: string, waitUntil: string) => {
        const waitTimeMs = new Date(waitUntil).getTime() - Date.now();
        const delay = Math.max(0, waitTimeMs);

        clearTimeoutByToken(token);

        const timeoutId = setTimeout(() => {
            if (token === activeSearchRef.current?.token && !isCanceledRef.current) {
                setSearchState((prev) => ({ ...prev, status: 'loading' }));
                fetchResults(token, countryId, 0);
            }
        }, delay);

        (window as any)[getTimeoutIdKey(token)] = timeoutId;

    }, [fetchResults]);





    const startSearch = useCallback(async (countryId: string) => {


        setSearchState({ status: 'loading', token: null, tourResults: null, hotelsMap: null, error: null });
        isCanceledRef.current = false;

        try {
            const response = await startSearchPrices(countryId);
            const data: { token: string, waitUntil: string } = await response.json();

            activeSearchRef.current = { token: data.token, countryId };

            if (!isCanceledRef.current) {
                setSearchState({ status: 'waiting', token: data.token, tourResults: null, hotelsMap: null, error: null });
                scheduleNextAttempt(data.token, countryId, data.waitUntil);
            }

        } catch (error) {
            setSearchState({ status: 'error', token: null, tourResults: null, hotelsMap: null, error: 'Не вдалося розпочати пошук.' });
        }
    }, [scheduleNextAttempt]);


    return {
        searchState,
        startSearch,
    };
};