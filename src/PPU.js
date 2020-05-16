// https://wiki.nesdev.com/w/index.php/PPU_palettes
const paletteLookup = [
    [84, 84, 84],
    [0, 30, 116],
    [8, 16, 144],
    [48, 0, 136],
    [68, 0, 100],
    [92, 0, 48],
    [84, 4, 0],
    [60, 24, 0],
    [32, 42, 0],
    [8, 58, 0],
    [0, 64, 0],
    [0, 60, 0],
    [0, 50, 60],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [152, 150, 152],
    [8, 76, 196],
    [48, 50, 236],
    [92, 30, 228],
    [136, 20, 176],
    [160, 20, 100],
    [152, 34, 32],
    [120, 60, 0],
    [84, 90, 0],
    [40, 114, 0],
    [8, 124, 0],
    [0, 118, 40],
    [0, 102, 120],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [236, 238, 236],
    [76, 154, 236],
    [120, 124, 236],
    [176, 98, 236],
    [228, 84, 236],
    [236, 88, 180],
    [236, 106, 100],
    [212, 136, 32],
    [160, 170, 0],
    [116, 196, 0],
    [76, 208, 32],
    [56, 204, 108],
    [56, 180, 204],
    [60, 60, 60],
    [0, 0, 0],
    [0, 0, 0],
    [236, 238, 236],
    [168, 204, 236],
    [188, 188, 236],
    [212, 178, 236],
    [236, 174, 236],
    [236, 174, 212],
    [236, 180, 176],
    [228, 196, 144],
    [204, 210, 120],
    [180, 222, 120],
    [168, 226, 144],
    [152, 226, 180],
    [160, 214, 228],
    [160, 162, 160],
    [0, 0, 0],
    [0, 0, 0],
];

class PPU {
    constructor() {
        this.rom = null;
        this.nameTables = [new Uint8Array(1024), new Uint8Array(1024)];
        this.patternTables = [new Uint8Array(4096), new Uint8Array(4096)];
        this.paletteTable = new Uint8Array(32);

        this.screenSprite = new Uint8Array(256 * 240 * 4);
        this.nameTableSprites = [new Uint8Array(256 * 240 * 4), new Uint8Array(256 * 240 * 4)];
        this.patternTableSprites = [new Uint8Array(128 * 128 * 4), new Uint8Array(128 * 128 * 4)];

        this.scanline = 0;
        this.cycle = 0;
        this.clockCounter = 0;
    }

    getScreen() {
        return this.screenSprite;
    }

    getNameTable(idx) {
        return this.nameTableSprites[idx];
    }

    getPatternTable(idx) {
        return this.patternTableSprites[idx];
    }

    cpuRead(addr) {
        let data = 0x00;

        switch (addr) {
        case 0x0000: // Control
            break;
        case 0x0001: // Mask
            break;
        case 0x0002: // Status
            break;
        case 0x0003: // OAM Address
            break;
        case 0x0004: // OAM Data
            break;
        case 0x0005: // Scroll
            break;
        case 0x0006: // PPU Address
            break;
        case 0x0007: // PPU Data
            break;
        }

        return data;
    }

    cpuWrite(addr) {
        switch (addr) {
        case 0x0000: // Control
            break;
        case 0x0001: // Mask
            break;
        case 0x0002: // Status
            break;
        case 0x0003: // OAM Address
            break;
        case 0x0004: // OAM Data
            break;
        case 0x0005: // Scroll
            break;
        case 0x0006: // PPU Address
            break;
        case 0x0007: // PPU Data
            break;
        }
    }

    ppuRead(addr, readOnly) {
        addr &= 0x3FFF;
        let data = 0x00;
        const romReadData = this.rom.ppuRead(addr, data);

        if (romReadData !== false) {
            //
        }

        return data;
    }

    ppuWrite(addr, data) {
        addr &= 0x3FFF;

        if (this.rom.ppuRead(addr, data)) {
            //
        }
    }

    clock() {
        this.cycle++;
        if (this.cycle >= 341) {
            this.cycle = 0;
            this.scanline++;

            if (this.scanline >= 261) {
                this.scanline = -1;
            }
        }

        this.clockCounter++;
    }
}

export default PPU;
