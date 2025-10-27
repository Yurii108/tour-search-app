'use client';

import React from 'react';
import Link from 'next/link';
import city from '../../../../public/city.svg';
import location from '../../../../public/location.svg';
import Image from 'next/image';
import { useTourDetails } from '@/hooks/useTourDetails';
import { serviceIcons } from './icons';

import styles from './styles.module.css';

interface TourDetailPageProps {
    priceId: string;
    hotelId: number;
}

const formatPrice = (amount: number) =>
    amount.toLocaleString('uk-UA', { minimumFractionDigits: 0 }) + ' грн';

export const TourDetailPage: React.FC<TourDetailPageProps> = ({ priceId, hotelId }) => {
    const { status, price, hotel, error } = useTourDetails(priceId, hotelId);

    if (status === 'loading')
        return <div className={styles.loader}>⏳ Завантаження деталей туру...</div>;
    if (status === 'error') return <div className={styles.error}>❌ {error}</div>;
    if (!price || !hotel)
        return <div className={styles.error}>❌ Не вдалося знайти інформацію про тур.</div>;

    const formattedDate = new Date(price.startDate).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formattedPrice = formatPrice(price.amount);
    const activeServices = Object.entries(hotel.services)
        .filter(([, v]) => v === 'yes')
        .map(([key]) => key);

    return (
        <>
            <div className={styles.card}>
                <h1 className={styles.hotelName}>{hotel.name}</h1>
                <div className={styles.location}>
                    <span className={styles.locItem}>
                        <Image src={location} alt="location" width={20} height={20} />{' '}
                        {hotel.countryName}
                    </span>
                    <span className={styles.locItem}>
                        <Image src={city} alt="City" width={20} height={20} />
                        {hotel.cityName}
                    </span>
                </div>

                <div className={styles.imageWrapper}>
                    <img
                        src={hotel.img || 'https://via.placeholder.com/600x300?text=Hotel+Image'}
                        alt={hotel.name}
                        className={styles.image}
                    />
                </div>

                <h2 className={styles.sectionTitle}>Опис</h2>
                <p className={styles.description}>
                    {hotel.description || 'Комфортний готель із видом на море.'}
                </p>

                <h2 className={styles.sectionTitle}>Сервіси</h2>
                <div className={styles.services}>
                    {activeServices.length > 0 ? (
                        activeServices.map((key) => (
                            <span key={key} className={styles.service}>
                                {serviceIcons[key] || <span>•</span>} {key.replace('_', ' ')}
                            </span>
                        ))
                    ) : (
                        <p className={styles.noServices}>Деталі сервісів відсутні.</p>
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.date}>
                        <span>📅</span> {formattedDate}
                    </div>

                    <div className={styles.priceContainer}>
                        <div className={styles.price}>{formattedPrice}</div>
                        <button className={styles.button}>Відкрити ціну</button>
                    </div>
                </div>
            </div>
            <Link href="/" className={styles.backButton}>
                На головну
            </Link>
        </>
    );
};

export default TourDetailPage;
