import { useState, useEffect, useCallback } from 'react';
import { getPrice, getHotel } from '../services/api';


interface PriceDetails {
    id: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate?: string;
}

interface HotelDetails {
    id: number;
    name: string;
    cityName: string;
    countryName: string;
    img: string;
    description: string;
    services: Record<string, 'yes' | 'no' | string>;
}

interface TourDetailsState {
    status: 'loading' | 'success' | 'error';
    price: PriceDetails | null;
    hotel: HotelDetails | null;
    error: string | null;
}

export const useTourDetails = (priceId: string | null, hotelId: number | null) => {
    const [state, setState] = useState<TourDetailsState>({
        status: 'loading',
        price: null,
        hotel: null,
        error: null,
    });

    const fetchDetails = useCallback(async () => {
        if (!priceId || !hotelId) {
            setState({
                status: 'error',
                price: null,
                hotel: null,
                error: 'Відсутні ID пропозиції або готелю.',
            });
            return;
        }

        setState((prev) => ({ ...prev, status: 'loading', error: null }));

        try {
            const [priceResponse, hotelResponse] = await Promise.all([
                getPrice(priceId),
                getHotel(hotelId),
            ]);

            const priceData: PriceDetails = await priceResponse.json();
            const hotelData: HotelDetails = await hotelResponse.json();

            if (priceResponse.status !== 200 || hotelResponse.status !== 200) {
                throw new Error('Не вдалося завантажити всі деталі туру.');
            }

            setState({
                status: 'success',
                price: priceData,
                hotel: hotelData,
                error: null,
            });
        } catch (error: any) {
            console.error('Помилка завантаження деталей туру:', error);
            setState({
                status: 'error',
                price: null,
                hotel: null,
                error: `Помилка завантаження даних: ${error.message || 'Мережева помилка.'}`,
            });
        }
    }, [priceId, hotelId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return state;
};
