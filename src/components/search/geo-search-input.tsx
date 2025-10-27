import React, { useState, useEffect, useRef } from 'react';
import SearchResultItem, { GeoEntity } from './search-result-item';
import { getCountries, searchGeo } from '../../services/api';

import styles from './search.module.css';

interface GeoSearchInputProps {
    onSelect: (entity: GeoEntity) => void;
    selectedCountryId: string | null;
}

const GeoSearchInput: React.FC<GeoSearchInputProps> = ({ onSelect, selectedCountryId }) => {
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState<GeoEntity[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const fetchResults = async () => {
        let rawResults;
        try {
            if (inputValue.length === 0) {
                rawResults = await (await getCountries()).json();
            }

            if (inputValue) {
                rawResults = await (await searchGeo(inputValue)).json();
            }

            const formattedResults: GeoEntity[] = Object.values(rawResults) as GeoEntity[];
            setResults(formattedResults);
        } catch (error) {
            console.error('Error fetching geo results:', error);
            setResults([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [inputValue]);

    const handleSelect = (entity: GeoEntity) => {
        setInputValue(entity.name);
        onSelect(entity);
        setIsDropdownOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsDropdownOpen(true);
    };

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Оберіть напрямок подорожі"
                className={styles.input}
            />

            {inputValue && (
                <button
                    type="button"
                    onClick={() => {
                        setInputValue('');
                        onSelect(null as any);
                        setIsDropdownOpen(true);
                    }}
                    className={styles.buttonClear}
                >
                    ×
                </button>
            )}

            {isDropdownOpen && (
                <div className={styles.list} onMouseDown={(e) => e.preventDefault()}>
                    {results.length > 0 ? (
                        results.map((entity) => (
                            <div key={entity.id} onClick={() => handleSelect(entity)}>
                                <SearchResultItem entity={entity} onClick={() => {}} />
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            {inputValue.length > 0
                                ? 'За вашим запитом нічого не знайдено.'
                                : 'Оберіть країну.'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeoSearchInput;
