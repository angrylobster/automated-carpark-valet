import * as fs from 'fs';
import { InvalidCommandData, InvalidLotCountRowData } from './parker-parser.exceptions';
import { CommandType, ParkingCommand, ParkerParserData, ParserSeparator, VehicleType } from './parker-parser.types';

export class ParkerParser {
    private readonly MAX_DATE_VALUE = 8640000000000000;
    private readonly MIN_DATE_VALUE = -8640000000000000;

    async parse(filePath: string): Promise<ParkerParserData> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                try {
                    if (err) throw err;
                    const parkingData = data.toString();
                    const [lotCountRow, ...commandRows] = parkingData.split(ParserSeparator.Row);
                    const [carLotCount, motorcycleLotCount] = this.parseAndValidateLotCountRow(lotCountRow);
                    resolve({
                        carLotCount,
                        motorcycleLotCount,
                        commands: this.parseAndValidateCommandRows(commandRows),
                    } as ParkerParserData);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    private parseAndValidateLotCountRow(rowData: string): number[] {
        const lotCountData = rowData.split(ParserSeparator.Column);
        if (lotCountData.length !== Object.keys(VehicleType).length) throw new InvalidLotCountRowData();
        return rowData.split(ParserSeparator.Column).reduce((result: number[], count: string) => {
            if (!count) throw new InvalidLotCountRowData();
            const parsedCount = Number(count);
            if (parsedCount < 0 || isNaN(parsedCount)) throw new InvalidLotCountRowData();
            result.push(Number(count));
            return result;
        }, [] as number[]);
    }

    private parseAndValidateCommandRows(rowData: string[]): ParkingCommand[] {
        return rowData
            .map((row: string, index: number) => {
                const [type, ...commandData] = row.split(ParserSeparator.Column);
                const command = {} as ParkingCommand;
                command.type = this.validateAndTransformCommandType(type, index);
                if (command.type === CommandType.ENTER) {
                    const [vehicleType, vehicleId, timestamp] = commandData;
                    command.vehicleType = this.validateAndTransformVehicleType(vehicleType, index);
                    command.vehicleId = vehicleId;
                    command.timestamp = this.validateAndTransformTimestamp(timestamp, index);
                    return command;
                }
                const [vehicleId, timestamp] = commandData;
                command.vehicleId = vehicleId;
                command.timestamp = this.validateAndTransformTimestamp(timestamp, index);
                return command;
            })
            .sort((firstCommand, nextCommand) => firstCommand.timestamp - nextCommand.timestamp);
    }

    private validateAndTransformVehicleType(vehicleType: string, index: number): VehicleType {
        const formattedVehicleType = vehicleType.toUpperCase();
        if (!Object.keys(VehicleType).includes(formattedVehicleType)) {
            throw new InvalidCommandData('vehicle type', index);
        }
        return VehicleType[formattedVehicleType as keyof typeof VehicleType];
    }

    private validateAndTransformCommandType(type: string, index: number): CommandType {
        const formattedType = type.toUpperCase();
        if (!Object.keys(CommandType).includes(formattedType)) {
            throw new InvalidCommandData('command type', index);
        }
        return CommandType[formattedType as keyof typeof CommandType];
    }

    private validateAndTransformTimestamp(timestamp: string, index: number): number {
        const parsedTimestamp = Number(timestamp);
        if (!parsedTimestamp || parsedTimestamp > this.MAX_DATE_VALUE || parsedTimestamp < this.MIN_DATE_VALUE) {
            throw new InvalidCommandData('timestamp', index);
        }
        return parsedTimestamp;
    }
}
