import React from 'react';
import Icon from '../ui/Icon';

import styles from './search.module.css';

export interface GeoEntity {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    flag?: string;
    countryId?: string;
}

interface SearchResultItemProps {
    entity: GeoEntity;
    onClick: (entity: GeoEntity) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ entity, onClick }) => {
    return (
        <div onClick={() => onClick(entity)} className={styles.item}>
            <Icon type={entity.type} flag={entity.flag} />
            <span>{entity.name}</span>
        </div>
    );
};

export default SearchResultItem;
