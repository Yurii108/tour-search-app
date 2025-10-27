import React from 'react';
import { SearchState } from '@/hooks/useTourSearch';
import styles from '../../components/search/search.module.css';

interface SearchStatusDisplayProps {
    searchState: SearchState;
    cancelSearch: (token: string) => void;
}

const SearchStatusDisplay: React.FC<SearchStatusDisplayProps> = ({ searchState, cancelSearch }) => {
    const renderStatusText = () => {
        switch (searchState.status) {
            case 'idle':
                return (
                    <p className={styles.statusText}>Введіть напрямок для початку пошуку турів.</p>
                );
            case 'loading':
                return (
                    <p className={styles.statusText}>⏳ Завантаження/Очікування старту пошуку...</p>
                );
            case 'waiting':
                return (
                    <p className={styles.statusText}>
                        ⌛ Результати готуються. Очікуємо наступного запиту...
                    </p>
                );
            case 'error':
                return (
                    <p className={`${styles.statusText} ${styles.errorText}`}>
                        ❌ Помилка пошуку: {searchState.error}
                    </p>
                );
            case 'cancelled':
                return (
                    <p className={`${styles.statusText} ${styles.cancelledText}`}>
                        🚫 Пошук скасовано.
                    </p>
                );
            case 'fetching_hotels':
                return <p className={styles.statusText}>⏳ Завантаження деталей готелів...</p>;
            case 'success':
            default:
                return null;
        }
    };

    const showCancelButton =
        searchState.status === 'loading' ||
        searchState.status === 'waiting' ||
        searchState.status === 'fetching_hotels';

    return (
        <div className={styles.statusContainer}>
            {searchState.status !== 'success' && renderStatusText()}

            {showCancelButton && (
                <button
                    onClick={() => searchState.token && cancelSearch(searchState.token)}
                    className={styles.cancelButton}
                >
                    Скасувати Пошук
                </button>
            )}
        </div>
    );
};

export default SearchStatusDisplay;
