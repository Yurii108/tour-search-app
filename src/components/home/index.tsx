'use client';

import SearchForm from '@/components/search/search-form';
import TourResults from '@/components/tour/tour-results';
import { useTourSearch } from '@/hooks/useTourSearch';
import SearchStatusDisplay from '../search/search-status-display';

import styles from './styles.module.css';

export default function Home() {
    const { searchState, startSearch, cancelSearch } = useTourSearch();

    const handleSearch = (countryId: string) => {
        startSearch(countryId);
    };

    const isSearchActive =
        searchState.status === 'loading' ||
        searchState.status === 'waiting' ||
        searchState.status === 'fetching_hotels';

    const renderResultsOrEmptyState = () => {
        if (
            searchState.status !== 'success' ||
            !searchState.tourResults ||
            !searchState.hotelsMap
        ) {
            return null;
        }

        if (searchState.tourResults.length === 0) {
            return (
                <div className={styles.emptyState}>
                    <h3>Результати Пошуку</h3>
                    <p>🤔 За вашим запитом турів не знайдено.</p>
                </div>
            );
        }

        return (
            <TourResults tourResults={searchState.tourResults} hotelsMap={searchState.hotelsMap} />
        );
    };

    return (
        <>
            <SearchForm onSearch={handleSearch} isSearchActive={isSearchActive} />
            <SearchStatusDisplay searchState={searchState} cancelSearch={cancelSearch} />

            {renderResultsOrEmptyState()}
        </>
    );
}
