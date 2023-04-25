import { MonthsEnum } from '../models/enums/months.enum';

export interface ITraining {
    uuid?: string;
    title: string;
    description: string;
    vimeoID: string;
    createdAt?: string;
    trainer: string;
    website: string;
    instagram: string;
    month: MonthsEnum;
    monthNumber: number;
    isAvailable: boolean;
}
