import { ParkerCoster } from './parker-coster';
import { ParkerParser } from './parker-parser';
import { ParkingCommand, ParserSeparator, ParkingLot, VehicleType, CommandType } from './parker-parser.types';

export class Parker {
    private parkerParser = new ParkerParser();
    private parkerCoster = new ParkerCoster();
    private carLots: (ParkingLot | undefined)[] = [];
    private motorcycleLots: (ParkingLot | undefined)[] = [];
    private logs: string[] = [];

    async run(filePath: string) {
        this.clearLogs();
        const { carLotCount, motorcycleLotCount, commands } = await this.parkerParser.parse(filePath);
        this.carLots = new Array(carLotCount);
        this.motorcycleLots = new Array(motorcycleLotCount);
        commands.forEach((command) => {
            try {
                if (command.type === CommandType.ENTER) {
                    const lots = this.getLotsByVehicleType(command.vehicleType);
                    this.parkVehicle(lots, command);
                } else {
                    const parkedVehicle = this.allLots.find((lot) => lot?.vehicleId === command.vehicleId);
                    if (!parkedVehicle) throw new Error(`Could not find vehicle with id ${command.vehicleId}`);
                    const lots = this.getLotsByVehicleType(parkedVehicle.vehicleType);
                    this.exitVehicle(lots, command);
                }
            } catch (err) {
                this.logRejection();
            }
        });
    }

    private parkVehicle(lots: (ParkingLot | undefined)[], command: ParkingCommand): void {
        const parkingLotIndex = lots.findIndex((lot) => !lot);
        if (parkingLotIndex === -1) {
            return this.logRejection();
        }
        const parkingLot = {
            vehicleType: command.vehicleType,
            vehicleId: command.vehicleId,
            timestamp: command.timestamp,
        } as ParkingLot;
        lots[parkingLotIndex] = parkingLot;
        this.logActivity(parkingLot, parkingLotIndex);
    }

    private exitVehicle(lots: (ParkingLot | undefined)[], command: ParkingCommand): void {
        const parkingLotIndex = lots.findIndex((lot) => lot && lot.vehicleId === command.vehicleId);
        const parkingLot = lots[parkingLotIndex] as ParkingLot;
        const parkingFee = this.parkerCoster.calculateParkingFee(
            parkingLot.vehicleType,
            parkingLot.timestamp,
            command.timestamp,
        );
        lots[parkingLotIndex] = undefined;
        this.logActivity(parkingLot, parkingLotIndex, parkingFee);
    }

    private logRejection(): void {
        this.logs.push('Reject');
    }

    private logActivity(data: ParkingLot, index: number, parkingCharge?: number): void {
        const logPrefix = parkingCharge ? '' : 'Accept ';
        const parkingChargeSuffix = parkingCharge ? ` ${parkingCharge}` : '';
        const vehicleTypeString = data.vehicleType === VehicleType.CAR ? 'Car' : 'Motorcycle';
        this.logs.push(`${logPrefix}${vehicleTypeString}Lot${index + 1}${parkingChargeSuffix}`);
    }

    getLogs(): string {
        return this.logs.join(ParserSeparator.Row);
    }

    private clearLogs(): void {
        this.logs = [];
    }

    getLotsByVehicleType(vehicleType: VehicleType): (ParkingLot | undefined)[] {
        return vehicleType === VehicleType.CAR ? this.carLots : this.motorcycleLots;
    }

    get carLotCount(): number {
        return this.carLots.length;
    }

    get motorcycleLotCount(): number {
        return this.motorcycleLots.length;
    }

    get allLots(): ParkingLot[] {
        return [...this.carLots, ...this.motorcycleLots] as ParkingLot[];
    }
}
