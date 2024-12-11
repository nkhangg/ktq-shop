import KtqAddress from '@/entities/ktq-addresses.entity';
import moment from 'moment';

export const env = (key: string, default_value?: string) => {
    return process.env[key] ?? default_value;
};

export const formatUTCTime = (time: moment.MomentInput) => {
    return moment(time).utc().format('DD/MM/YYYY HH:MM:SS');
};

export function cleanObject(obj: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined && value !== false && value !== 0 && value !== ''), // Giữ null, loại bỏ falsy khác
    );
}

export function showAddress(address: KtqAddress): string {
    const { address_line, ward, district, city, postal_code, state, country, region } = address;

    let fullAddress = '';

    if (address_line) fullAddress += `${address_line}, `;
    if (ward) fullAddress += `${ward}, `;
    if (district) fullAddress += `${district}, `;
    if (city) fullAddress += `${city}, `;
    if (state) fullAddress += `${state}, `;
    if (postal_code) fullAddress += `${postal_code}, `;
    if (country && country.country_name) fullAddress += `${country.country_name}`;

    if (region) fullAddress += `, ${region}`;

    return fullAddress.replace(/, $/, '');
}
