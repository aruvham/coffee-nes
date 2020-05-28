class Mapper003 {
    constructor({ header: { prgBanks, chrBanks } }) {
        this.prgBanks = prgBanks;
        this.chrBanks = chrBanks;
        this.chrBankSelected = 0;
    }

    mapCpuReadAddr(addr) {
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            return addr & (this.prgBanks > 1 ? 0x7FFF : 0x3FFF);
        }
        return false;
    }

    mapCpuWriteAddr(addr, data) {
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            this.chrBankSelected = data & 0x0F;
        }
        return false;
    }

    mapPpuReadAddr(addr) {
        if (addr >= 0x0000 && addr <= 0x1FFF) {
            return this.chrBankSelected * 0x2000 + (addr & 0x1FFF);
        }
        return false;
    }

    mapPpuWriteAddr(addr) {
        if (addr >= 0x0000 && addr <= 0x1FFF) {
            if (this.chrBanks === 0) {
                // Treat as RAM
                return addr;
            }
        }
        return false;
    }

    reset() {
        this.chrBankSelected = 0;
    }

    getMirror() { return 'HARDWARE'; }
}

export default Mapper003;
