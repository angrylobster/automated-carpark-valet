import { InvalidTimestampError } from './parker-coster.exceptions';
import { VehicleType } from './parker-parser.types';

export class ParkerCoster {
    private readonly SECONDS_IN_AN_HOUR = 60 * 60;
    private readonly HOURLY_PARKING_RATES = {
        [VehicleType.CAR]: 2,
        [VehicleType.MOTORCYCLE]: 1,
    };

    calculateParkingFee(vehicleType: VehicleType, entryTimestamp: number, exitTimestamp: number): number {
        this.validate(entryTimestamp, exitTimestamp);
        const secondsElapsed = exitTimestamp - entryTimestamp;
        const hoursElapsedRounded = Math.ceil(secondsElapsed / this.SECONDS_IN_AN_HOUR);
        const rate = this.HOURLY_PARKING_RATES[vehicleType];
        return hoursElapsedRounded * rate;
    }

    private validate(entryTimestamp: number, exitTimestamp: number): void {
        if (exitTimestamp < entryTimestamp) {
            throw new InvalidTimestampError('Exit timestamp cannot be larger than entry timestamp');
        }
    }
}
