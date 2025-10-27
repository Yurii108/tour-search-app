import React, { useRef, useState } from 'react';
import GeoSearchInput from './geo-search-input';
import { GeoEntity } from './search-result-item';

import styles from './search.module.css';
import Button from '../ui/button';

interface SearchFormProps {
    onSearch: (countryId: string) => void;
    isSearchActive: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isSearchActive }) => {
    const [selectedGeo, setSelectedGeo] = useState<GeoEntity | null>(null);

    const countryIdToSearch = selectedGeo ? String(selectedGeo.id) : null;

    const handleGeoSelect = (entity: GeoEntity) => {
        setSelectedGeo(entity);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isSearchActive || !countryIdToSearch) {
            return;
        }

        onSearch(countryIdToSearch);
    };

    const buttonDisabled = !countryIdToSearch || isSearchActive;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Форма пошуку турів</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                    <GeoSearchInput
                        onSelect={handleGeoSelect}
                        selectedCountryId={countryIdToSearch}
                    />
                </label>

                <Button type="submit" disabled={buttonDisabled}>
                    {isSearchActive ? 'Пошук...' : 'Знайти'}
                </Button>
            </form>
        </div>
    );
};

export default SearchForm;
