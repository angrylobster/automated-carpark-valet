import { Parker } from '../src/parker';
import * as path from 'path';

describe('Parker', () => {
    const parker = new Parker();
    const buildTestFilePath = (fileName: string) => path.resolve(__dirname, 'data', fileName);

    it('should initialize with 0 car lots', () => {
        expect(parker.carLotCount).toEqual(0);
    });

    it('should initialize with 0 motorcycle lots', () => {
        expect(parker.motorcycleLotCount).toEqual(0);
    });

    describe('.run()', () => {
        const textExecution = (fileName: string) => parker.run(buildTestFilePath(fileName));

        describe('when accepting 1 motorcycle', () => {
            beforeEach(async () => {
                await textExecution('output/accept-one-motorcycle.txt');
            });

            it('should set the car lots as an array with the correct length', async () => {
                expect(parker.carLotCount).toEqual(3);
            });

            it('should set the motorcycle lots as an array with the correct length', async () => {
                expect(parker.motorcycleLotCount).toEqual(4);
            });

            it('should be able to log the motorcycle being accepted', () => {
                expect(parker.getLogs()).toEqual('Accept MotorcycleLot1');
            });
        });

        describe('when accepting 1 car', () => {
            beforeEach(async () => {
                await textExecution('output/accept-one-car.txt');
            });

            it('should be able to log the car being accepted', () => {
                expect(parker.getLogs()).toEqual('Accept CarLot1');
            });
        });

        describe('when accepting 1 car and 1 motorcycle', () => {
            beforeEach(async () => {
                await textExecution('output/accept-one-car-and-motorcycle.txt');
            });

            it('should be able to log both the car and motorcycle being accepted', () => {
                expect(parker.getLogs()).toEqual('Accept MotorcycleLot1\nAccept CarLot1');
            });
        });

        describe('when accepting more than 1 motorcycle and just 1 car', () => {
            beforeEach(async () => {
                await textExecution('output/accept-one-car-and-two-motorcycles.txt');
            });

            it('should be able to log both the car and motorcycle being accepted', () => {
                expect(parker.getLogs()).toEqual('Accept MotorcycleLot1\nAccept CarLot1\nAccept MotorcycleLot2');
            });
        });

        describe('when accepting and exiting a car', () => {
            beforeEach(async () => {
                await textExecution('output/accept-one-car-with-exit.txt');
            });

            it('should be able to log the car entry and exit price', () => {
                expect(parker.getLogs()).toEqual('Accept CarLot1\nCarLot1 4');
            });
        });

        describe('when exiting a car while there are none parked', () => {
            beforeEach(async () => {
                await textExecution('output/reject-one-exit.txt');
            });

            it('should be able to log a rejection', () => {
                expect(parker.getLogs()).toEqual('Reject');
            });
        });

        describe('when accepting more cars or motorcycles than lots', () => {
            it('should reject the excess cars', async () => {
                await textExecution('output/reject-no-lots-cars.txt');
                expect(parker.getLogs()).toEqual('Accept CarLot1\nReject');
            });

            it('should reject the excess motorcycles', async () => {
                await textExecution('output/reject-no-lots-motorcycles.txt');
                expect(parker.getLogs()).toEqual('Accept MotorcycleLot1\nReject');
            });
        });

        describe('when handling files that will generate mixed outputs', () => {
            it('should handle all outputs correctly', async () => {
                await textExecution('output/mixed-output-one.txt');
                expect(parker.getLogs()).toEqual(
                    [
                        'Accept MotorcycleLot1',
                        'Accept CarLot1',
                        'MotorcycleLot1 2',
                        'Accept CarLot2',
                        'Accept CarLot3',
                        'Reject',
                        'CarLot3 6',
                    ].join('\n'),
                );
            });

            it('should display incorrect timestamp commands as rejects', async () => {
                await textExecution('output/mixed-output-invalid-timestamps.txt');
                expect(parker.getLogs()).toEqual('Accept MotorcycleLot1\nReject');
            });
        });
    });
});
