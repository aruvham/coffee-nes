import CPU from './CPU';
import PPU from './PPU';
import ROM from './ROM';

class NES {
    constructor() {
        this.cpu = new CPU(this);
        this.ppu = new PPU(this);
        this.rom = null;
        this.ram = new Uint8Array(0x0800);

        this.clockCounter = 0;
        this.frameCounter = 0;
    }

    loadRom(romData) {
        const rom = new ROM(romData);
        this.rom = rom;
        this.ppu.rom = rom;
        this.reset();
    }

    cpuWrite(addr, data) {
        if (this.rom.cpuWrite(addr, data)) {
            // Cartridge Address Range
        } else if (addr >= 0x0000 && addr <= 0x1FFF) {
            // System RAM Address Range, mirrored every 2048
            this.ram[addr & 0x0FF] = data;
        } else if (addr >= 0x2000 && addr <= 0x3FFF) {
            // PPU Address range, mirrored every 8
            this.ppu.cpuWrite(addr & 0x0007, data);
        }
    }

    cpuRead(addr, readOnly) {
        let data = 0x00;
        const romReadData = this.rom.cpuRead(addr);

        if (romReadData !== false) {
            // Cartridge Address Range
            data = romReadData;
        } else if (addr >= 0x0000 && addr <= 0x1FFF) {
            // System RAM Address Range, mirrored every 2048
            data = this.ram[addr & 0x0FF];
        } else if (addr >= 0x2000 && addr <= 0x3FFF) {
            // PPU Address range, mirrored every 8
            data = this.ppu.cpuRead(addr & 0x0007, readOnly);
        }

        return data;
    }

    reset() {
        this.cpu.reset();
        this.clockCounter = 0;
        this.frameCounter = 0;
    }

    clock() {
        this.ppu.clock();

        if (this.clockCounter % 3 === 0) {
            this.cpu.clock();
        }

        this.clockCounter++;
    }
}

export default NES;
