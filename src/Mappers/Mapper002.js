class Mapper002 {
    constructor({ header: { prgBanks, chrBanks } }) {
        this.prgBanks = prgBanks;
        this.chrBanks = chrBanks;
        this.prgBankSelectedLo = 0;
        this.prgBankSelectedHi = 0;
    }

    mapCpuReadAddr(addr) {
        if (addr >= 0x8000 && addr <= 0xBFFF) {
            return this.prgBankSelectedLo * 0x4000 + (addr & 0x3FFF);
        }

        if (addr >= 0xC000 && addr <= 0xFFFF) {
            return this.prgBankSelectedHi * 0x4000 + (addr & 0x3FFF);
        }

        return false;
    }

    mapCpuWriteAddr(addr, data) {
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            this.prgBankSelectedLo = data & 0x0F;
        }
        return false;
    }

    mapPpuReadAddr(addr) {
        if (addr >= 0x0000 && addr <= 0x1FFF) {
            return addr;
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
        this.prgBankSelectedLo = 0;
        this.prgBankSelectedHi = this.prgBanks - 1;
    }

    getMirror() { return 'HARDWARE'; }
}

export default Mapper002;
