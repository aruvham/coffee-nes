import CPU from './CPU';
import PPU from './PPU';
import ROM from './ROM';

class NES {
    constructor() {
        this.cpu = new CPU(this);
        this.ppu = new PPU(this);
        this.rom = null;
        this.ram = new Uint8Array(0x0800);

        this.controller = new Uint8Array(2);
        this.controllerState = new Uint8Array(2);

        this.clockCounter = 0;
        this.frameCounter = 0;

        // dma
        this.dmaPage = 0x00;
        this.dmaAddr = 0x00;
        this.dmaData = 0x00;
        this.dmaTransfer = false;
        this.dmaDummy = true;
    }

    setController(idx, value) {
        this.controller[idx] = value;
    }

    loadRom(romData) {
        const rom = new ROM(romData);
        this.rom = rom;
        this.ppu.rom = rom;
        this.reset();
    }

    cpuRead(addr, readOnly) {
        let data = 0x00;
        const romReadData = this.rom.cpuRead(addr);

        if (romReadData !== false) {
            // Cartridge Address Range
            data = romReadData;
        } else if (addr >= 0x0000 && addr <= 0x1FFF) {
            // System RAM Address Range, mirrored every 2048
            data = this.ram[addr & 0x07FF];
        } else if (addr >= 0x2000 && addr <= 0x3FFF) {
            // PPU Address range, mirrored every 8
            data = this.ppu.cpuRead(addr & 0x0007, readOnly);
        } else if (addr === 0x4016 || addr === 0x4017) {
            // Controller
            data = (this.controllerState[addr & 0x01] & 0x80) >> 7;
            this.controllerState[addr & 0x01] <<= 1;
        }

        return data;
    }

    cpuWrite(addr, data) {
        if (this.rom.cpuWrite(addr, data)) {
            // Cartridge Address Range
        } else if (addr >= 0x0000 && addr <= 0x1FFF) {
            // System RAM Address Range, mirrored every 2048
            this.ram[addr & 0x07FF] = data;
        } else if (addr >= 0x2000 && addr <= 0x3FFF) {
            // PPU Address range, mirrored every 8
            this.ppu.cpuWrite(addr & 0x0007, data);
        } else if (addr === 0x4014) {
            // dma
            this.dmaPage = data;
            this.dmaAddr = 0x00;
            this.dmaTransfer = true;
        } else if (addr === 0x4016 || addr === 0x4017) {
            // Controller
            this.controllerState[addr & 0x01] = this.controller[addr & 0x01];
        }
    }

    reset() {
        this.rom.reset();
        this.cpu.reset();
        // this.ppu.reset();
        this.clockCounter = 0;
        this.frameCounter = 0;
        this.dmaPage = 0x00;
        this.dmaAddr = 0x00;
        this.dmaData = 0x00;
        this.dmaTransfer = false;
        this.dmaDummy = true;
    }

    clock() {
        // debugger;
        this.ppu.clock();

        if (this.clockCounter % 3 === 0) {
            if (this.dmaTransfer) {
                if (this.dmaDummy) {
                    if (this.clockCounter % 2 === 1) {
                        this.dmaDummy = false;
                    }
                } else {
                    if (this.clockCounter % 2 === 0) {
                        this.dmaData = this.cpuRead(this.dmaPage << 8 | this.dmaAddr);
                    } else {
                        this.ppu.oam[this.dmaAddr] = this.dmaData;
                        this.dmaAddr++;

                        if (this.dmaAddr > 0xFF) {
                            this.dmaTransfer = false;
                            this.dmaDummy = true;
                        }
                    }
                }
            } else {
                this.cpu.clock();
            }
        }

        if (this.ppu.nmi) {
            this.ppu.nmi = false;
            this.cpu.nmi();
        }

        this.clockCounter++;
    }
}

export default NES;
