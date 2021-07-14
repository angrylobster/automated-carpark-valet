export enum CommandType {
    ENTER = 'ENTER',
    EXIT = 'EXIT',
}

export enum VehicleType {
    CAR = 'CAR',
    MOTORCYCLE = 'MOTORCYCLE',
}

export class ParkingCommand {
    type: CommandType;
    vehicleType: VehicleType;
    vehicleId: string;
    timestamp: number;
}

export interface ParkerParserData {
    carLotCount: number;
    motorcycleLotCount: number;
    commands: ParkingCommand[];
}

export enum ParserSeparator {
    Row = '\n',
    Column = ' ',
}

export type ParkingLot = Omit<ParkingCommand, 'type'>;
