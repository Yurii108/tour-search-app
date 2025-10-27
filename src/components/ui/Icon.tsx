import Image from 'next/image';
import React from 'react';
import hotel from '../../../public/hotel.svg';
import city from '../../../public/location.svg';

type GeoType = 'country' | 'city' | 'hotel';

interface IconProps {
    type?: GeoType;
    flag?: string;
}

const Icon: React.FC<IconProps> = ({ type, flag }) => {
    const baseStyle: React.CSSProperties = {
        width: '20px',
        height: '15px',
        marginRight: '10px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const iconType: GeoType | '' = type || (flag ? 'country' : '');

    switch (iconType) {
        case 'country':
            return (
                <span style={baseStyle}>
                    {flag ? (
                        <Image src={flag} alt="Flag" width={22} height={22} />
                    ) : (
                        <span style={baseStyle}>🌍</span>
                    )}
                </span>
            );
        case 'city':
            return (
                <span style={baseStyle}>
                    <Image src={city} alt="City" width={22} height={22} />
                </span>
            );
        case 'hotel':
            return (
                <span style={baseStyle}>
                    <Image src={hotel} alt="Hotel" width={21} height={21} />
                </span>
            );
        default:
            return null;
    }
};

export default Icon;
