import React, { useMemo } from 'react';
import { TourResult } from '../../hooks/useTourSearch';
import styles from './tour.module.css';
import TourCard from './tour-card';

interface TourResultsProps {
    tourResults: TourResult[];
    hotelsMap: Map<number, any>;
}

const TourResults: React.FC<TourResultsProps> = ({ tourResults, hotelsMap }) => {
    const resultsWithHotels = useMemo(() => {
        if (!hotelsMap) return [];
        return tourResults.map((tour) => ({
            tour,
            hotel: hotelsMap.get(tour.hotelId),
        }));
    }, [tourResults, hotelsMap]);

    return (
        <div className={styles.resultsContainer}>
            <h2 className={styles.resultsTitle}>
                Знайдені пропозиції ({resultsWithHotels.length})
            </h2>

            <div className={styles.resultsGrid}>
                {resultsWithHotels.map((item, index) => (
                    <TourCard key={index} tour={item.tour as any} hotel={item.hotel} />
                ))}
            </div>

            {resultsWithHotels.length === 0 && (
                <p className={styles.noResults}>
                    На жаль, за вашим запитом пропозицій не знайдено.
                </p>
            )}
        </div>
    );
};

export default TourResults;
