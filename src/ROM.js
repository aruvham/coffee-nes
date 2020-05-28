import Mapper000 from './Mappers/Mapper000';
import Mapper002 from './Mappers/Mapper002';

const mappers = new Map();
mappers.set(0, Mapper000);
mappers.set(2, Mapper002);

class ROM {
    constructor(data) {
        this.romData = null;
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

            const prgMemorySize = this.header.prgBanks * 16384; // 16kb banks
            this.prgMemory = new Uint8Array(prgMemorySize);
            for (let i = 0; i < prgMemorySize; i++) {
                this.prgMemory[i] = data[readPosition++];
            }

            if (this.header.chrBanks === 0) {
                this.chrMemory = new Uint8Array(8192);
            } else {
                const chrMemorySize = this.header.chrBanks * 8192; // 8kb banks
                this.chrMemory = new Uint8Array(chrMemorySize);
                for (let i = 0; i < chrMemorySize; i++) {
                    this.chrMemory[i] = data[readPosition++];
                }
            }

        }

        if (fileFormat === 2) {
            // Unsupported
            this.fileFormat = 'NES 2.0';
        }

        // Load mapper
        const MapperClass = mappers.get(this.mapperId);
        if (!MapperClass) {
            console.error('Unsupperted mapper: ', this.mapperId);
        } else {
            this.mapper = new MapperClass(this);
            this.romData = data;
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
        const mappedAddr = this.mapper.mapCpuWriteAddr(addr, data);
        if (mappedAddr !== false) {
            this.prgMemory[mappedAddr] = data;
        }
        return false;
    }

    ppuRead(addr) {
        const mappedAddr = this.mapper.mapPpuReadAddr(addr);
        if (mappedAddr !== false) {
            return this.chrMemory[mappedAddr];
        }
        return false;
    }

    ppuWrite(addr, data) {
        const mappedAddr = this.mapper.mapPpuWriteAddr(addr, data);
        if (mappedAddr !== false) {
            this.chrMemory[mappedAddr] = data;
            return true;
        }
        return false;
    }

    reset() {
        if (this.mapper) {
            this.mapper.reset();
        }
    }

    getMirror() {
        const m = this.mapper.getMirror();
        if (!m || m === 'HARDWARE') {
            return this.mirror;
        }
        return m;
    }
}

export default ROM;
