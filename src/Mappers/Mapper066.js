class Mapper066 {
    constructor({ header: { prgBanks, chrBanks } }) {
        this.prgBanks = prgBanks;
        this.chrBanks = chrBanks;
        this.prgBankSelected = 0;
        this.chrBankSelected = 0;
    }

    mapCpuReadAddr(addr) {
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            return this.prgBankSelected * 0x8000 + (addr & 0x7FFF);
        }
        return false;
    }

    mapCpuWriteAddr(addr, data) {
        // debugger;
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            this.chrBankSelected = data & 0x03;
            this.prgBankSelected = (data >> 4) & 0x03;
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
        this.prgBankSelected = 0;
        this.chrBankSelected = 0;
    }

    getMirror() { return 'HARDWARE'; }
}

export default Mapper066;
