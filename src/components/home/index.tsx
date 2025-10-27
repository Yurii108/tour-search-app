'use client';

import SearchForm from '@/components/search/search-form';

export default function Home() {
    const handleSearch = (countryId: string) => {
        console.log(countryId);
    };

    return (
        <>
            <SearchForm onSearch={handleSearch} />
        </>
    );
}
