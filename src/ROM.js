import Mapper_000 from './Mappers/Mapper_000';

const mappers = new Map();
mappers.add(0, Mapper_000);

class ROM {
    constructor(data) {
        this.prgMemory = null;
        this.chrMemory = null;
        this.header = {};
        this.mirror = null;
        this.mapperId = null;
        this.mapper = null;
        this.fileFormat = null;
        this.loadRomData(data);
    }

    loadRomData(data) {
        let name = String.fromCharCode(data[0]);
        name += String.fromCharCode(data[1]);
        name += String.fromCharCode(data[2]);
        if (name !== 'NES') {
            console.error('Unable to read file');
        }

        this.header = {
            prgBanks: data[4],
            chrBanks: data[5],
            mapper1: data[6],
            mapper2: data[7],
            prgSize: data[8],
            tvSystem1: data[9],
            tvSystem2: data[10],
        };

        const hasTrainer = this.header.mapper1 & 0x04;
        let readPosition = hasTrainer ? 16 + 512 : 16;
        this.mapperId = ((this.header.mapper2 >> 4) << 4) | (this.header.mapper1 >> 4);
        this.mirror = (this.header.mapper1 & 0x01) ? 'VERTICAL' : 'HORIZONTAL';
        const fileFormat = 1;

        if (fileFormat === 0) {
            // Unsupported
            this.fileFormat = 'Archaic iNES';
        }

        if (fileFormat === 1) {
            this.fileFormat = 'iNES';

            const prgMemorySize = this.header.prgBanks * 16384;
            this.prgMemory = new Uint8Array(prgMemorySize);
            for (let i = 0; i < prgMemorySize; i++) {
                this.prgMemory[i] = data[readPosition++];
            }

            const chrMemorySize = this.header.chrBanks * 8192;
            this.chrMemory = new Uint8Array(chrMemorySize);
            for (let i = 0; i < chrMemorySize; i++) {
                this.chrMemory[i] = data[readPosition++];
            }
        }

        if (fileFormat === 2) {
            // Unsupported
            this.fileFormat = 'NES 2.0';
        }

        // Load mapper
        this.mappers = mappers.get(this.mapperId);
        if (!this.mapper) {
            console.error('Unsupperted mapper: ', this.mapperId);
        }
    }

    cpuRead(addr) {
        const mappedAddr = this.mapper.mapCpuReadAddr(addr);
        if (mappedAddr !== false) {
            return this.prgMemory[mappedAddr];
        }
        return false;
    }

    cpuWrite(addr, data) {
        const mappedAddr = this.mapper.mapCpuWriteAddr(addr);
        if (mappedAddr !== false) {
            this.prgMemory[mappedAddr] = data;
        }
        return false;
    }

    ppuRead(addr) {
        const mappedAddr = this.mapper.mapPpuWriteAddr(addr);
        if (mappedAddr !== false) {
            return this.chrMemory[mappedAddr];
        }
        return false;
    }

    ppuWrite(addr, data) {
        const mappedAddr = this.mapper.maPpuWriteAddr(addr);
        if (mappedAddr !== false) {
            this.chrMemory[mappedAddr] = data;
            return true;
        }
        return false;
    }
}

export default ROM;
