import { ParkerCoster } from '../src/parker-coster';
import { VehicleType } from '../src/parker-parser.types';

describe('ParkerCoster', () => {
    const coster = new ParkerCoster();

    describe('.calculateParkingFee()', () => {
        it('should calculate the correct fee if 1 second has elapsed', () => {
            expect(coster.calculateParkingFee(VehicleType.MOTORCYCLE, 0, 1)).toEqual(1);
        });

        it('should calculate the correct fee if 1801 seconds has elapsed', () => {
            expect(coster.calculateParkingFee(VehicleType.MOTORCYCLE, 0, 1801)).toEqual(1);
        });

        it('should calculate the correct fee if 3601 seconds has elapsed', () => {
            expect(coster.calculateParkingFee(VehicleType.MOTORCYCLE, 0, 3601)).toEqual(2);
        });

        describe('validations', () => {
            it('should throw an error if the exit timestamp is smaller than the entry timestamp', () => {
                expect(() => coster.calculateParkingFee(VehicleType.CAR, 3, 1)).toThrow(
                    'Exit timestamp cannot be larger than entry timestamp',
                );
            });
        });
    });
});
