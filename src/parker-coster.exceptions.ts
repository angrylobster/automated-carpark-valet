import { ValidationError } from './common.exceptions';

export class InvalidTimestampError extends ValidationError {
    constructor(message: string) {
        super(message);
    }
}
