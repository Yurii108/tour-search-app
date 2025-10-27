import Link from 'next/link';

import TourDetailsPage from '@/components/tour/tour-details-page';

interface TourPageProps {
    params: {
        priceId: string;
    };
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TourPage({ params, searchParams }: TourPageProps) {
    const { priceId } = await params;
    const sp = await searchParams;
    const hotelIdParam = sp.hotelId;

    const hotelId = hotelIdParam ? Number(hotelIdParam) : null;

    if (!priceId || typeof priceId !== 'string' || !hotelId || isNaN(hotelId)) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ color: '#555', maxWidth: 500, margin: '0 auto 20px' }}>
                    Ми не змогли знайти потрібну пропозицію або готель. Перевірте правильність
                    посилання або поверніться на головну сторінку.
                </p>
                <Link href="/">На головну</Link>
            </div>
        );
    }

    return <TourDetailsPage priceId={priceId} hotelId={hotelId} />;
}
