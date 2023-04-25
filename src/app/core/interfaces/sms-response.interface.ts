/* eslint-disable @typescript-eslint/naming-convention */
export interface SmsResponse {
    status: string;
    result: ResultResponse[];
}

interface ResultResponse {
    status: string;
    sms_id: string;
    custom: string;
}
