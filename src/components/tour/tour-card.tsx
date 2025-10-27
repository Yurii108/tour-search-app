import React from 'react';
import styles from './tour.module.css';
import Link from 'next/link';

interface TourCardProps {
    tour: {
        priceId: string;
        price: number;
        startDate?: string;
    };
    hotel: {
        id: number;
        name: string;
        city: string;
        country: string;
        flag?: string;
        images: string[];
    };
}

const TourCard: React.FC<TourCardProps> = ({ tour, hotel }) => {
    const priceId = tour.priceId;
    const hotelId = hotel.id;
    const tourUrl = `/tour/${priceId}?hotelId=${hotelId}`;

    const imageUrl = hotel.images?.[0] || '';
    const formattedPrice = tour.price.toLocaleString('uk-UA') + ' грн';

    const formattedDate = tour.startDate
        ? new Date(tour.startDate).toLocaleDateString('uk-UA')
        : '—';

    const flag = hotel.flag || <span>🌍</span>;

    return (
        <Link href={tourUrl}>
            <div className={styles.card}>
                <div className={styles.imageWrapper}>
                    <img src={imageUrl} alt={hotel.name} className={styles.image} />
                </div>

                <div className={styles.content}>
                    <h3 className={styles.hotelName}>{hotel.name}</h3>

                    <div className={styles.location}>
                        <span className={styles.flag}>{flag}</span>
                        <span>
                            {hotel.country}, {hotel.city}
                        </span>
                    </div>

                    <div className={styles.date}>
                        <div>Старт туру:</div>
                    </div>
                    <span>{formattedDate}</span>
                    <div className={styles.price}>{formattedPrice}</div>

                    <span className={styles.link}>Відкрити ціну</span>
                </div>
            </div>
        </Link>
    );
};

export default TourCard;
