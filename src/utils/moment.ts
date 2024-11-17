import KtqAppConstant from '@/constants/ktq-app.constant';
import mt from 'moment-timezone';

const moment = (inp?: mt.MomentInput, strict?: boolean) => {
    const timezone = KtqAppConstant.getTimeZone();

    if (timezone === 'UTC') {
        return mt.utc(inp, strict);
    }

    return mt(inp, strict).tz(timezone);
};

export default moment;
