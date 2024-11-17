import moment from 'moment';

export const env = (key: string, default_value?: string) => {
    return process.env[key] ?? default_value;
};

export const formatUTCTime = (time: moment.MomentInput) => {
    return moment(time).utc().format('DD/MM/YYYY HH:MM:SS');
};
