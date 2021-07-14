import * as path from 'path';
import { ParkerParser } from '../src/parker-parser';
import { ParkerParserData } from '../src/parker-parser.types';

describe('ParkerParser', () => {
    const parkerParser = new ParkerParser();
    const buildTestFilePath = (fileName: string) => path.resolve(__dirname, 'data', fileName);
    const textExecution = (fileName: string) => parkerParser.parse(buildTestFilePath(fileName));

    describe('.parse()', () => {
        describe('Lot count row', () => {
            let data: ParkerParserData;

            beforeEach(async () => {
                data = await parkerParser.parse(buildTestFilePath('lots/car-and-motorcycle.txt'));
            });

            it('should be able to read a file and return the number of car lots', async () => {
                expect(data.carLotCount).toEqual(1);
            });

            it('should be able to read a file and return the number of motorcycle lots', async () => {
                expect(data.motorcycleLotCount).toEqual(2);
            });

            describe('validations', () => {
                it('should throw an error if the file path is incorrect', () => {
                    return expect(parkerParser.parse(buildTestFilePath('..'))).rejects.toThrowError();
                });

                it('should throw an error indicating the file path is incorrect', () => {
                    return expect(parkerParser.parse(buildTestFilePath('..'))).rejects.toThrow(
                        'illegal operation on a directory',
                    );
                });

                it('should throw an error if there is only 1 number on the first line', () => {
                    return expect(parkerParser.parse(buildTestFilePath('lots/car-only.txt'))).rejects.toThrowError();
                });

                it('should throw an error with a descriptive message if there is only 1 number on the first line', () => {
                    return expect(parkerParser.parse(buildTestFilePath('lots/car-only.txt'))).rejects.toThrow(
                        'Invalid lot count row data',
                    );
                });

                it('should throw an error with a descriptive message if there is no data on the first line', () => {
                    return expect(parkerParser.parse(buildTestFilePath('lots/no-data.txt'))).rejects.toThrow(
                        'Invalid lot count row data',
                    );
                });

                it('should throw an error with a descriptive message if the data on the first line contains non-numbers', () => {
                    return expect(parkerParser.parse(buildTestFilePath('lots/wrong-types.txt'))).rejects.toThrow(
                        'Invalid lot count row data',
                    );
                });

                it('should throw an error if there are more than two numbers on the first line', () => {
                    return expect(parkerParser.parse(buildTestFilePath('lots/extra-data.txt'))).rejects.toThrow(
                        'Invalid lot count row data',
                    );
                });

                it('should throw an error if the numbers are negative', () => {
                    return expect(parkerParser.parse(buildTestFilePath('lots/negative-lots.txt'))).rejects.toThrow(
                        'Invalid lot count row data',
                    );
                });
            });
        });

        describe('Command rows', () => {
            describe('when there is only one car', () => {
                let data: ParkerParserData;

                beforeEach(async () => {
                    data = await parkerParser.parse(buildTestFilePath('commands/one-car.txt'));
                });

                it('should be able to read a file and return an array with one command', async () => {
                    expect(data.commands.length).toEqual(1);
                });

                it('should be able to return the details of the command', async () => {
                    const [firstCommand] = data.commands;
                    expect(firstCommand.type).toEqual('ENTER');
                    expect(firstCommand.vehicleType).toEqual('CAR');
                    expect(firstCommand.vehicleId).toEqual('SGF9283P');
                    expect(firstCommand.timestamp).toEqual(123456);
                });
            });

            describe('when there is only one car but with varied casing', () => {
                let data: ParkerParserData;

                beforeEach(async () => {
                    data = await parkerParser.parse(buildTestFilePath('commands/one-car-casing.txt'));
                });

                it('should be able to return the details of the command', async () => {
                    const [firstCommand] = data.commands;
                    expect(firstCommand.type).toEqual('ENTER');
                    expect(firstCommand.vehicleType).toEqual('CAR');
                    expect(firstCommand.vehicleId).toEqual('SGF9283P');
                    expect(firstCommand.timestamp).toEqual(123456);
                });
            });

            describe('validations', () => {
                it('should throw an error if the command type is not valid', () => {
                    return expect(textExecution('commands/wrong-command-type-type.txt')).rejects.toThrowError();
                });

                it('should throw an error with a descriptive message if the command type type is not valid', () => {
                    return expect(textExecution('commands/wrong-command-type-type.txt')).rejects.toThrow(
                        'Invalid command type (row 2)',
                    );
                });

                it('should throw an error with a descriptive message if the command type value is not valid', () => {
                    return expect(textExecution('commands/wrong-command-type-value.txt')).rejects.toThrow(
                        'Invalid command type (row 2)',
                    );
                });

                it('should throw an error if the vehicle type is not valid', () => {
                    return expect(textExecution('commands/wrong-vehicle-type-type.txt')).rejects.toThrowError();
                });

                it('should throw an error with a descriptive message if the command type value is not valid', () => {
                    return expect(textExecution('commands/wrong-vehicle-type-value.txt')).rejects.toThrow(
                        'Invalid vehicle type (row 2)',
                    );
                });

                it('should throw an error if the timestamp type is not valid', () => {
                    return expect(textExecution('commands/wrong-timestamp-type.txt')).rejects.toThrowError();
                });

                it('should throw an error with a descriptive message if the timestamp type is not valid', () => {
                    return expect(textExecution('commands/wrong-timestamp-type.txt')).rejects.toThrow(
                        'Invalid timestamp (row 2)',
                    );
                });

                it('should throw an error with a descriptive message if the timestamp value is too large', () => {
                    return expect(textExecution('commands/wrong-timestamp-value-max.txt')).rejects.toThrow(
                        'Invalid timestamp (row 2)',
                    );
                });

                it('should throw an error with a descriptive message if the timestamp value is too small', () => {
                    return expect(textExecution('commands/wrong-timestamp-value-min.txt')).rejects.toThrow(
                        'Invalid timestamp (row 2)',
                    );
                });
            });
        });
    });
});
