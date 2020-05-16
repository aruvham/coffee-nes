class Mapper000 {
    constructor({ header: { prgBanks, chrBanks } }) {
        this.prgBanks = prgBanks;
        this.chrBanks = chrBanks;
    }

    cpuRead(addr) {
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            return addr & (this.prgBanks > 1 ? 0x7FFF : 0x3FFF);
        }
        return false;
    }

    cpuWrite(addr) {
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            return addr & (this.prgBanks > 1 ? 0x7FFF : 0x3FFF);
        }
        return false;
    }

    ppuRead(addr) {
        if (addr >= 0x0000 && addr <= 0x1FFF) {
            return addr;
        }
        return false;
    }

    ppuWrite(addr) {
        if (addr >= 0x0000 && addr <= 0x1FFF) {
            if (this.chrBanks === 0) {
                // Treat as RAM
                return addr;
            }
        }
        return false;
    }
}

export default Mapper000;
