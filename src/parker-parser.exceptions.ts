import { ValidationError } from './common.exceptions';

export class InvalidLotCountRowData extends ValidationError {
    constructor() {
        super('Invalid lot count row data');
    }
}

export class InvalidCommandData extends ValidationError {
    private static readonly MIN_ROW_NUMBER = 2;

    constructor(property: string, index: number) {
        super(`Invalid ${property} (row ${index + InvalidCommandData.MIN_ROW_NUMBER})`);
    }
}
