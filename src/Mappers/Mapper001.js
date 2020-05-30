class Mapper001 {
    constructor({ header: { prgBanks, chrBanks } }) {
        this.prgBanks = prgBanks;
        this.chrBanks = chrBanks;

        this.chrBankSelected4Lo = 0x00;
        this.chrBankSelected4Hi = 0x00;
        this.chrBankSelected8 = 0x00;

        this.prgBankSelected16Lo = 0x00;
        this.prgBankSelected16Hi = 0x00;
        this.prgBankSelected32 = 0x00;

        this.loadRegister = 0x00;
        this.loadRegisterCount = 0x00;
        this.controlRegister = 0x00;

        this.mirror = 'HORIZONTAL';

        this.vram = new Uint8Array(32 * 1024); // 32kb
    }

    mapCpuReadAddr(addr) {
        if (addr >= 0x6000 && addr <= 0x7FFF) {
            return addr & 0x1FFF;
        }

        if (addr >= 0x8000 && addr <= 0xFFFF) {
            if (this.controlRegister & 0b01000) {
                // 16kb mode
                if (addr >= 0x8000 && addr <= 0xBFFF) {
                    return this.prgBankSelected16Lo * 0x4000 + (addr & 0x3FFF);
                }

                if (addr >= 0xC000 && addr <= 0xFFFF) {
                    return this.prgBankSelected16Hi * 0x4000 + (addr & 0x3FFF);
                }
            } else {
                // 32kb mode
                return this.prgBankSelected32 * 0x8000 + (addr & 0x7FFF);
            }
        }
        return false;
    }

    mapCpuWriteAddr(addr, data) {
        if (addr >= 0x6000 && addr <= 0x7FFF) {
            return addr & 0x1FFF;
        }
        if (addr >= 0x8000 && addr <= 0xFFFF) {
            if (data & 0x80) {
                this.loadRegister = 0x00;
                this.loadRegisterCount = 0;
                this.controlRegister |= 0x0C;
            } else {
                this.loadRegister = (this.loadRegister >> 1) | ((data & 1) << 4);
                this.loadRegisterCount++;
                if (this.loadRegisterCount === 5) {
                    const targetRegister = (addr >> 13) & 0x03;
                    if (targetRegister === 0) {
                        this.controlRegister = this.loadRegister & 0x1F;
                        switch (this.controlRegister & 0x03) {
                        case 0: this.mirror = 'ONESCREEN_LO'; break;
                        case 1: this.mirror = 'ONESCREEN_HI'; break;
                        case 2: this.mirror = 'VERTICAL'; break;
                        case 3: this.mirror = 'HORIZONTAL'; break;
                        }
                    } else if (targetRegister === 1) {
                        if (this.controlRegister & 0b10000) {
                            // 4k mode
                            this.chrBankSelected4Lo = this.loadRegister & 0x1F;
                        } else {
                            // 8k mode
                            this.chrBankSelected8 = this.loadRegister & 0x1E;
                        }
                    } else if (targetRegister === 2) {
                        if (this.controlRegister & 0b10000) {
                            // 4k mode
                            this.chrBankSelected4Hi = this.loadRegister & 0x1F;
                        }
                    } else if (targetRegister === 3) {
                        const prgMode = (this.controlRegister >> 2) & 0x03;
                        if (prgMode === 0 || prgMode === 1) {
                            this.prgBankSelected32 = (this.loadRegister & 0x0E) >> 1;
                        } else if (prgMode === 2) {
                            this.prgBankSelected16Lo = 0;
                            this.prgBankSelected16Hi = this.loadRegister & 0x0F;
                        } else if (prgMode === 3) {
                            this.prgBankSelected16Lo = this.loadRegister & 0x0F;
                            this.prgBankSelected16Hi = this.prgBanks - 1;
                        }
                    }
                    this.loadRegister = 0x00;
                    this.loadRegisterCount = 0x00;
                }
            }
        }
        return false;
    }

    mapPpuReadAddr(addr) {
        if (addr < 0x2000) {
            if (this.chrBanks === 0) {
                return addr;
            } else {
                if (this.controlRegister & 0b10000) {
                    // 4kb mode
                    if (addr >= 0x0000 && addr <= 0x0FFF) {
                        return this.chrBankSelected4Lo * 0x1000 + (addr & 0x0FFF);
                    }
    
                    if (addr >= 0x1000 && addr <= 0x1FFF) {
                        return this.chrBankSelected4Hi * 0x1000 + (addr & 0x0FFF);
                    }
                } else {
                    // 8kb mode
                    return this.chrBankSelected8 * 0x2000 + (addr & 0x1FFF);
                }
            }
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
        this.chrBankSelected4Lo = 0x00;
        this.chrBankSelected4Hi = 0x00;
        this.chrBankSelected8 = 0x00;

        this.prgBankSelected16Lo = 0x00;
        this.prgBankSelected16Hi = this.prgBanks - 1;
        this.prgBankSelected32 = 0x00;

        this.loadRegister = 0x00;
        this.loadRegisterCount = 0x00;
        this.controlRegister = 0x1C;
    }

    getMirror() {
        return this.mirrorMode;
    }
}

export default Mapper001;
