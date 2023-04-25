export interface IVersionControl {
    uuid: string;
    mayor: number;
    minor: number;
    patch: number;
    type: string;
    isMandatory: boolean;
    createdAt: Date;
    updatedAt: Date;
}
