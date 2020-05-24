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
    constructor(nes) {
        this.nes = nes;
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

        // Registers
        // Status
        this.verticalBlank = false; // 7
        this.spriteZeroHit = false; // 6
        this.spriteOverflow = false; // 5
        // Mask
        this.enhanceBlue = false; // 7
        this.enhanceGreen = false; // 6
        this.enhanceRed = false; // 5
        this.renderSprites = false; // 4
        this.renderBackground = false; // 3
        this.renderSpritesLeft = false; // 2
        this.renderBackgroundLeft = false; // 1
        this.grayscale = false; // 0
        // Control
        this.nmi = false;
        this.enableNmi = false; // 7
        this.slaveMode = false; // 6 unused
        this.spriteSize = false; // 5
        this.patternBackground = false; // 4
        this.patternSprite = false; // 3
        this.incrementMode = false; // 2
        this.nametableY = false; // 1
        this.nametableX = false; // 0
        // Loopy
        this.fineX = 0x00;
        // vramAddr
        this.vramAddr = 0x0000;
        this.vramCoarseX = 0x00; // 5 bits
        this.vramCoarseY = 0x00; // 5 bits
        this.vramNametableX = false;
        this.vramNametableY = false;
        this.vramFineY = 0x00; // 3 bits
        // tramAddr
        this.tramAddr = 0x0000;
        this.tramCoarseX = 0x00; // 5 bits
        this.tramCoarseY = 0x00; // 5 bits
        this.tramNametableX = false;
        this.tramNametableY = false;
        this.tramFineY = 0x00; // 3 bits

        this.addrLatch = 0x00;
        this.ppuDataBuffer = 0x00;
        // this.ppuAddr = 0x0000;

        // Bg rendering
        this.bgNextTileId = 0x00;
        this.bgNextTileAttr = 0x00;
        this.bgNextTileLsb = 0x00;
        this.bgNextTileMsb = 0x00;
        this.bgShifterPatternLo = 0x0000;
        this.bgShifterPatternHi = 0x0000;
        this.bgShifterAttrLo = 0x0000;
        this.bgShifterAttrHi = 0x0000;

        // oam
        this.oam = new Uint8Array(0xFF); // 256 bites
        this.oamAddr = 0x00;
        this.spriteScanline = [];
        this.spriteCount = 0;
        this.spriteShifterPatternLo = new Uint8Array(8);
        this.spriteShifterPatternHi = new Uint8Array(8);
        this.spriteZeroHitPossible = false;
        this.spriteZeroBeingRendered = false;
    }

    getColorFromPaletteTable(colorIdx, palette) {
        return paletteLookup[this.ppuRead(0x3F00 + (palette << 2) + colorIdx) & 0x3F];
    }

    getScreen() {
        return this.screenSprite;
    }

    setScreenPixel(x, y, color) {
        const idx = ((y * 256) + x) * 4;
        this.screenSprite[idx] = color[0];
        this.screenSprite[idx + 1] = color[1];
        this.screenSprite[idx + 2] = color[2];
        this.screenSprite[idx + 3] = 255;
    }

    getNameTable(idx) {
        return this.nameTableSprites[idx];
    }

    getPatternTable(idx, palette) {
        for (let tileY = 0; tileY < 16; tileY++) {
            for (let tileX = 0; tileX < 16; tileX++) {
                const offset = (tileY * 256) + (tileX * 16);
                for (let row = 0; row < 8; row++) {
                    let tileLsb = this.ppuRead((idx * 0x1000) + offset + row);
                    let tileMsb = this.ppuRead((idx * 0x1000) + offset + row + 8);
                    for (let col = 0; col < 8; col++) {
                        const colorIdx = ((tileLsb & 0x01) << 1) | (tileMsb & 0x01);
                        const color = this.getColorFromPaletteTable(colorIdx, palette);
                        const pixelX = tileX * 8 + (7 - col);
                        const pixelY = tileY * 8 + row;
                        this.setPatternTablePixel(pixelX, pixelY, color, idx);
                        tileLsb >>= 1;
                        tileMsb >>= 1;
                    }
                }
            }
        }

        return this.patternTableSprites[idx];
    }

    setPatternTablePixel(x, y, color, patternTableIdx) {
        const idx = ((y * 128) + x) * 4;
        this.patternTableSprites[patternTableIdx][idx] = color[0];
        this.patternTableSprites[patternTableIdx][idx + 1] = color[1];
        this.patternTableSprites[patternTableIdx][idx + 2] = color[2];
        this.patternTableSprites[patternTableIdx][idx + 3] = 255;
    }

    cpuRead(addr) {
        let data = 0x00;

        switch (addr) {
        case 0x0000: // Control
            // Not readable
            break;
        case 0x0001: // Mask
            // Not readable
            break;
        case 0x0002: // Status
            data = this.getStatus();
            this.verticalBlank = false;
            this.addrLatch = 0;
            break;
        case 0x0003: // OAM Address
            break;
        case 0x0004: // OAM Data
            data = this.oam[this.oamAddr];
            break;
        case 0x0005: // Scroll
            break;
        case 0x0006: // PPU Address
            // Not readable
            break;
        case 0x0007: // PPU Data
            this.vramAddr = this.getVramAddr();

            data = this.ppuDataBuffer;
            this.ppuDataBuffer = this.ppuRead(this.vramAddr);

            if (this.vramAddr >= 0x3F00) data = this.ppuDataBuffer;

            this.vramAddr += this.incrementMode ? 32 : 1;
            this.setVramAddr(this.vramAddr);
            break;
        }

        return data;
    }

    cpuWrite(addr, data) {
        switch (addr) {
        case 0x0000: // Control
            this.setControl(data);
            this.tramNametableX = this.nametableX;
            this.tramNametableY = this.nametableY;
            break;
        case 0x0001: // Mask
            this.setMask(data);
            break;
        case 0x0002: // Status
            // Not writable
            break;
        case 0x0003: // OAM Address
            this.oamAddr = data;
            break;
        case 0x0004: // OAM Data
            this.oam[this.oamAddr] = data;
            break;
        case 0x0005: // Scroll
            if (this.addrLatch === 0) {
                this.fineX = data & 0x07;
                this.tramCoarseX = data >> 3;
                this.addrLatch = 1;
            } else {
                this.tramFineY = data & 0x07;
                this.tramCoarseY = data >> 3;
                this.addrLatch = 0;
            }
            break;
        case 0x0006: // PPU Address
            this.tramAddr = this.getTramAddr();

            if (this.addrLatch === 0) {
                this.tramAddr = ((data & 0x3F) << 8) | (this.tramAddr & 0x00FF);
                this.setTramAddr(this.tramAddr);
                this.addrLatch = 1;
            } else {
                this.tramAddr = (this.tramAddr & 0xFF00) | data;
                this.setTramAddr(this.tramAddr);
                this.setVramAddr(this.tramAddr);
                this.addrLatch = 0;
            }
            break;
        case 0x0007: // PPU Data
            this.vramAddr = this.getVramAddr();
            this.ppuWrite(this.vramAddr, data);
            this.vramAddr += this.incrementMode ? 32 : 1;
            this.setVramAddr(this.vramAddr);
            break;
        }
    }

    ppuRead(addr, readOnly) {
        addr &= 0x3FFF;
        let data = 0x00;
        const romReadData = this.rom.ppuRead(addr);

        if (romReadData !== false) {
            //
            data = romReadData;
        } else if (addr >= 0x0000 && addr <= 0x1FFF) {
            // Pattern mem
            data = this.patternTables[(addr & 0x1000) >> 12][addr & 0x0FFF];
        } else if (addr >= 0x2000 && addr <= 0x3EFF) {
            // Name table mem
            addr &= 0x0FFF;
            if (this.nes.rom.mirror === 'VERTICAL') {
                if (addr >= 0x0000 && addr <= 0x03FF) {
                    data = this.nameTables[0][addr & 0x03FF];
                } else if (addr >= 0x0400 && addr <= 0x07FF) {
                    data = this.nameTables[1][addr & 0x03FF];
                } else if (addr >= 0x0800 && addr <= 0x0BFF) {
                    data = this.nameTables[0][addr & 0x03FF];
                } else if (addr >= 0x0C00 && addr <= 0x0FFF) {
                    data = this.nameTables[1][addr & 0x03FF];
                }
            } else if (this.nes.rom.mirror === 'HORIZONTAL') {
                if (addr >= 0x0000 && addr <= 0x03FF) {
                    data = this.nameTables[0][addr & 0x03FF];
                } else if (addr >= 0x0400 && addr <= 0x07FF) {
                    data = this.nameTables[0][addr & 0x03FF];
                } else if (addr >= 0x0800 && addr <= 0x0BFF) {
                    data = this.nameTables[1][addr & 0x03FF];
                } else if (addr >= 0x0C00 && addr <= 0x0FFF) {
                    data = this.nameTables[1][addr & 0x03FF];
                }
            }
        } else if (addr >= 0x3F00 && addr <= 0x3FFF) {
            // Palette mem
            // ???
            addr &= 0x001F;
            if (addr === 0x0010) addr = 0x0000;
            if (addr === 0x0014) addr = 0x0004;
            if (addr === 0x0018) addr = 0x0008;
            if (addr === 0x001C) addr = 0x000C;
            data = this.paletteTable[addr];
        }

        return data;
    }

    ppuWrite(addr, data) {
        addr &= 0x3FFF;

        if (this.rom.ppuWrite(addr, data)) {
            //
        } else if (addr >= 0x0000 && addr <= 0x1FFF) {
            // Pattern mem
            this.patternTables[(addr & 0x1000) >> 12][addr & 0x0FFF] = data;
        } else if (addr >= 0x2000 && addr <= 0x3EFF) {
            // Name table mem
            addr &= 0x0FFF;
            if (this.nes.rom.mirror === 'VERTICAL') {
                if (addr >= 0x0000 && addr <= 0x03FF) {
                    this.nameTables[0][addr & 0x03FF] = data;
                } else if (addr >= 0x0400 && addr <= 0x07FF) {
                    this.nameTables[1][addr & 0x03FF] = data;
                } else if (addr >= 0x0800 && addr <= 0x0BFF) {
                    this.nameTables[0][addr & 0x03FF] = data;
                } else if (addr >= 0x0C00 && addr <= 0x0FFF) {
                    this.nameTables[1][addr & 0x03FF] = data;
                }
            } else if (this.nes.rom.mirror === 'HORIZONTAL') {
                if (addr >= 0x0000 && addr <= 0x03FF) {
                    this.nameTables[0][addr & 0x03FF] = data;
                } else if (addr >= 0x0400 && addr <= 0x07FF) {
                    this.nameTables[0][addr & 0x03FF] = data;
                } else if (addr >= 0x0800 && addr <= 0x0BFF) {
                    this.nameTables[1][addr & 0x03FF] = data;
                } else if (addr >= 0x0C00 && addr <= 0x0FFF) {
                    this.nameTables[1][addr & 0x03FF] = data;
                }
            }
        } else if (addr >= 0x3F00 && addr <= 0x3FFF) {
            // Palette mem
            // ???
            addr &= 0x001F;
            if (addr === 0x0010) addr = 0x0000;
            if (addr === 0x0014) addr = 0x0004;
            if (addr === 0x0018) addr = 0x0008;
            if (addr === 0x001C) addr = 0x000C;
            this.paletteTable[addr] = data;
        }
    }

    incrementScrollX() {
        if (this.renderBackground || this.renderSprites) {
            if (this.vramCoarseX === 31) {
                this.vramCoarseX = 0;
                this.vramNametableX = !this.vramNametableX;
            } else {
                this.vramCoarseX++;
            }
        }
    }

    incrementScrollY() {
        if (this.renderBackground || this.renderSprites) {
            if (this.vramFineY < 7) {
                this.vramFineY++;
            } else {
                this.vramFineY = 0;

                if (this.vramCoarseY === 29) {
                    this.vramCoarseY = 0;
                    this.vramNametableY = !this.vramNametableY;
                } else if (this.vramCoarseY === 31) {
                    this.vramCoarseY = 0;
                } else {
                    this.vramCoarseY++;
                }
            }
        }
    }

    transferAddrX() {
        if (this.renderBackground || this.renderSprites) {
            this.vramNametableX = this.tramNametableX;
            this.vramCoarseX = this.tramCoarseX;
        }
    }

    transferAddrY() {
        if (this.renderBackground || this.renderSprites) {
            this.vramFineY = this.tramFineY;
            this.vramNametableY = this.tramNametableY;
            this.vramCoarseY = this.tramCoarseY;
        }
    }

    loadBackgroundShifters() {
        this.bgShifterPatternLo = (this.bgShifterPatternLo & 0xFF00) | this.bgNextTileLsb;
        this.bgShifterPatternHi = (this.bgShifterPatternHi & 0xFF00) | this.bgNextTileMsb;
        this.bgShifterAttrLo = (this.bgShifterAttrLo & 0xFF00) | ((this.bgNextTileAttr & 0b01) ? 0xFF : 0x00);
        this.bgShifterAttrHi = (this.bgShifterAttrHi & 0xFF00) | ((this.bgNextTileAttr & 0b10) ? 0xFF : 0x00);
    }

    updateShifters() {
        if (this.renderBackground) {
            this.bgShifterPatternLo <<= 1;
            this.bgShifterPatternHi <<= 1;
            this.bgShifterAttrLo <<= 1;
            this.bgShifterAttrHi <<= 1;
        }

        if (this.renderSprites && this.cycle >= 1 && this.cycle < 258) {
            for (let i = 0; i < this.spriteCount; i++) {
                if (this.spriteScanline[i].x > 0) {
                    this.spriteScanline[i].x -= 1;
                } else {
                    this.spriteShifterPatternLo[i] <<= 1;
                    this.spriteShifterPatternHi[i] <<= 1;
                }
            }
        }
    }

    clock() {
        if (this.scanline >= -1 && this.scanline < 240) {
            if (this.scanline === 0 && this.cycle === 0) {
                this.cycle = 1;
            }
            if (this.scanline === -1 && this.cycle === 1) {
                this.verticalBlank = false;
                this.spriteOverflow = false;
                this.spriteZeroHit = false;

                for (let i = 0; i < 8; i++) {
                    this.spriteShifterPatternLo[i] = 0x00;
                    this.spriteShifterPatternHi[i] = 0x00;
                }
            }
            if ((this.cycle >= 2 && this.cycle < 258) || (this.cycle >= 321 && this.cycle < 338)) {
                this.updateShifters();
                switch ((this.cycle - 1) % 8) {
                case 0:
                    this.loadBackgroundShifters();
                    this.bgNextTileId = this.ppuRead(0x2000 | (this.getVramAddr() & 0x0FFF));
                    // if (this.bgNextTileId === 42) debugger
                    break;
                case 2:
                    this.bgNextTileAttr = this.ppuRead(0x23C0 | ((this.vramNametableY ? 1 : 0) << 11)
                    | ((this.vramNametableX ? 1 : 0) << 10)
                    | ((this.vramCoarseY >> 2) << 3)
                    | (this.vramCoarseX >> 2));
                    if (this.vramCoarseY & 0x02) this.bgNextTileAttr >>= 4;
                    if (this.vramCoarseX & 0x02) this.bgNextTileAttr >>= 2;
                    this.bgNextTileAttr &= 0x03;
                    break;
                case 4:
                    // if (window.DEBUG) debugger;
                    // const a = (this.patternBackground ? 1 : 0) << 12;
                    // const b = this.bgNextTileId << 4;
                    // const c = (this.vramFineY);
                    // const d = 0;
                    // const e = a+b+c+d;
                    this.bgNextTileLsb = this.ppuRead(((this.patternBackground ? 1 : 0) << 12)
                    + (this.bgNextTileId << 4)
                    + (this.vramFineY) + 0);
                    break;
                case 6:
                    this.bgNextTileMsb = this.ppuRead(((this.patternBackground ? 1 : 0) << 12)
                    + (this.bgNextTileId << 4)
                    + (this.vramFineY) + 8);
                    break;
                case 7:
                    this.incrementScrollX();
                    break;
                }
            }
            if (this.cycle === 256) {
                this.incrementScrollY();
            }
            if (this.cycle === 257) {
                this.loadBackgroundShifters();
                this.transferAddrX();
            }
            if (this.cycle === 338 || this.cycle === 340) {
                this.bgNextTileId = this.ppuRead(0x2000 | (this.getVramAddr() & 0x0FFF));
            }
            if (this.scanline === -1 && this.cycle >= 280 && this.cycle < 305) {
                this.transferAddrY();
            }


            // foreground
            if (this.cycle === 257 && this.scanline >= 0) {
                this.spriteScanline = [];
                this.spriteCount = 0;

                for (let i = 0; i < 8; i++) {
                    this.spriteShifterPatternLo[i] = 0;
                    this.spriteShifterPatternHi[i] = 0;
                }

                // sprite evaluation
                let nOAMEntry = 0;
                this.spriteZeroHitPossible = false;
                while (nOAMEntry < 64 && this.spriteCount < 9) {
                    const oamEntry = this.oamRead(nOAMEntry);
                    const diff = this.scanline - oamEntry.y;

                    if (diff >= 0 && diff < (this.spriteSize ? 16 : 8)) {
                        // sprite visible in next scanline
                        if (this.spriteCount < 8) {
                            if (nOAMEntry === 0) {
                                this.spriteZeroHitPossible = true;
                            }

                            this.spriteScanline.push(oamEntry);
                            this.spriteCount++;
                        }
                    }

                    nOAMEntry++;
                }
                this.spriteOverflow = this.spriteCount > 8;
            }

            if (this.cycle === 340) {
                for (let i = 0; i < this.spriteCount; i++) {
                    let spritePatternBitsLo;
                    let spritePatternBitsHi;
                    let spritePatternAddrLo;
                    let spritePatternAddrHi;

                    if (!this.spriteSize) {
                        // 8x8 mode
                        if (!(this.spriteScanline[i].attribute & 0x80)) {
                            // not flipped vertically
                            spritePatternAddrLo = ((this.patternSprite ? 1 : 0) << 12)
                                | (this.spriteScanline[i].id << 4)
                                | (this.scanline - this.spriteScanline[i].y);
                        } else {
                            // flipped vertically
                            spritePatternAddrLo = ((this.patternSprite ? 1 : 0) << 12)
                            | (this.spriteScanline[i].id << 4)
                            | (7 - (this.scanline - this.spriteScanline[i].y));
                        }
                    } else {
                        // 8x16 mode
                        if (!(this.spriteScanline[i].attribute & 0x80)) {
                            // not flipped vertically
                            if (this.scanline - this.spriteScanline[i].y < 8) {
                                spritePatternAddrLo = ((this.spriteScanline[i].id & 0x01) << 12)
                                | ((this.spriteScanline[i].id & 0xFE) << 4)
                                | ((this.scanline - this.spriteScanline[i].y) & 0x07);
                            } else {
                                if (this.scanline - this.spriteScanline[i].y < 8) {
                                    spritePatternAddrLo = ((this.spriteScanline[i].id & 0x01) << 12)
                                    | (((this.spriteScanline[i].id & 0xFE) + 1) << 4)
                                    | ((this.scanline - this.spriteScanline[i].y) & 0x07);
                                }
                            }
                        } else {
                            // flipped vertically
                            if (this.scanline - this.spriteScanline[i].y < 8) {
                                spritePatternAddrLo = ((this.spriteScanline[i].id & 0x01) << 12)
                                | (((this.spriteScanline[i].id & 0xFE) + 1) << 4)
                                | (7 - ((this.scanline - this.spriteScanline[i].y) & 0x07));
                            } else {
                                if (this.scanline - this.spriteScanline[i].y < 8) {
                                    spritePatternAddrLo = ((this.spriteScanline[i].id & 0x01) << 12)
                                    | ((this.spriteScanline[i].id & 0xFE) << 4)
                                    | (7 - ((this.scanline - this.spriteScanline[i].y) & 0x07));
                                }
                            }
                        }
                    }
                    spritePatternAddrHi = spritePatternAddrLo + 8;
                    spritePatternBitsLo = this.ppuRead(spritePatternAddrLo);
                    spritePatternBitsHi = this.ppuRead(spritePatternAddrHi);

                    if ((this.spriteScanline[i].attribute & 0x40)) {
                        // flipped horizontally
                        spritePatternBitsLo = this.flipByte(spritePatternBitsLo);
                        spritePatternBitsHi = this.flipByte(spritePatternBitsHi);
                    }

                    this.spriteShifterPatternLo[i] = spritePatternBitsLo;
                    this.spriteShifterPatternHi[i] = spritePatternBitsHi;
                }
            }
        }

        if (this.scanline === 240) {
            // Do nothing
        }

        if (this.scanline >= 241 && this.scanline < 261) {
            if (this.scanline === 241 && this.cycle === 1) {
                this.verticalBlank = true;
                if (this.enableNmi) {
                    this.nmi = true;
                }
            }
        }

        // Render pixel on screen
        let bgPixel = 0x00;
        let bgPalette = 0x00;
        if (this.renderBackground) {
            const bitMask = 0x8000 >> this.fineX;

            const p0Pixel = ((this.bgShifterPatternLo & bitMask) > 0) ? 1 : 0;
            const p1Pixel = ((this.bgShifterPatternHi & bitMask) > 0) ? 1 : 0;
            bgPixel = (p1Pixel << 1) | p0Pixel;

            const bgPalette0 = ((this.bgShifterAttrLo & bitMask) > 0) ? 1 : 0;
            const bgPalette1 = ((this.bgShifterAttrHi & bitMask) > 0) ? 1 : 0;
            bgPalette = (bgPalette1 << 1) | bgPalette0;
        }

        let fgPixel = 0x00;
        let fgPalette = 0x00;
        let fgPriority = 0x00;
        if (this.renderSprites) {
            this.spriteZeroBeingRendered = false;

            for (let i = 0; i < this.spriteCount; i++) {
                if (this.spriteScanline[i].x === 0) {
                    const fgPixelLo = ((this.spriteShifterPatternLo[i] & 0x80) > 0) ? 1 : 0;
                    const fgPixelHi = ((this.spriteShifterPatternHi[i] & 0x80) > 0) ? 1 : 0;
                    fgPixel = (fgPixelHi << 1) | fgPixelLo;
                    fgPalette = (this.spriteScanline[i].attribute & 0x03) + 0x04;
                    fgPriority = (this.spriteScanline[i].attribute & 0x20) === 0;

                    if (fgPixel !== 0) {
                        if (i === 0) {
                            this.spriteZeroBeingRendered = true;
                        }
                        break;
                    }
                }
            }
        }

        let pixel;
        let palette;

        if (bgPixel === 0 && fgPixel === 0) {
            pixel = 0x00;
            palette = 0x00;
        } else if (bgPixel === 0 && fgPixel > 0) {
            pixel = fgPixel;
            palette = fgPalette;
        } else if (bgPixel > 0 && fgPixel === 0) {
            pixel = bgPixel;
            palette = bgPalette;
        } else if (bgPixel > 0 && fgPixel > 0) {
            pixel = fgPriority ? fgPixel : bgPixel;
            palette = fgPriority ? fgPalette : bgPalette;
            if (this.spriteZeroHitPossible && this.spriteZeroBeingRendered) {
                if (this.renderBackground && this.renderSprites) {
                    if (!(this.renderBackgroundLeft || this.renderSpritesLeft)) {
                        if (this.cycle >= 9 && this.cycle < 258) {
                            this.spriteZeroHit = true;
                        }
                    } else {
                        if (this.cycle >= 1 && this.cycle < 258) {
                            this.spriteZeroHit = true;
                        }
                    }
                }
            }
        }

        this.setScreenPixel(this.cycle - 1, this.scanline, this.getColorFromPaletteTable(pixel, palette));


        this.cycle++;
        if (this.cycle >= 341) {
            this.cycle = 0;
            this.scanline++;

            if (this.scanline >= 261) {
                this.scanline = -1;
                this.nes.frameCounter++;
            }
        }

        this.clockCounter++;
    }

    // oam
    oamRead(addr) {
        addr *= 4;
        return {
            y: this.oam[addr],
            id: this.oam[addr + 1],
            attribute: this.oam[addr + 2],
            x: this.oam[addr + 3],
        };
    }

    // Registers
    getStatus() {
        let status = 0x00;
        status |= (this.verticalBlank === true) ? 0x80 : 0x00;
        status |= (this.spriteZeroHit === true) ? 0x40 : 0x00;
        status |= (this.spriteOverflow === true) ? 0x20 : 0x00;
        status |= this.ppuDataBuffer & 0x1F;
        return status;
    }

    setStatus(status) {
        this.verticalBlank = !!((status >> 7) & 0x01);
        this.spriteZeroHit = !!((status >> 6) & 0x01);
        this.spriteOverflow = !!((status >> 5) & 0x01);
    }

    getMask() {
        let mask = 0x00;
        mask |= (this.enhanceBlue === true) ? 0x80 : 0x00;
        mask |= (this.enhanceGreen === true) ? 0x40 : 0x00;
        mask |= (this.enhanceRed === true) ? 0x20 : 0x00;
        mask |= (this.renderSprites === true) ? 0x10 : 0x00;
        mask |= (this.renderBackground === true) ? 0x08 : 0x00;
        mask |= (this.renderSpritesLeft === true) ? 0x04 : 0x00;
        mask |= (this.renderBackgroundLeft === true) ? 0x02 : 0x00;
        mask |= (this.grayscale === true) ? 0x01 : 0x00;
        return mask;
    }

    setMask(mask) {
        this.enhanceBlue = !!((mask >> 7) & 0x01);
        this.enhanceGreen = !!((mask >> 6) & 0x01);
        this.enhanceRed = !!((mask >> 5) & 0x01);
        this.renderSprites = !!((mask >> 4) & 0x01);
        this.renderBackground = !!((mask >> 3) & 0x01);
        this.renderSpritesLeft = !!((mask >> 2) & 0x01);
        this.renderBackgroundLeft = !!((mask >> 1) & 0x01);
        this.grayscale = !!((mask >> 0) & 0x01);
    }

    getControl() {
        let control = 0x00;
        control |= (this.enableNmi === true) ? 0x80 : 0x00;
        control |= (this.slaveMode === true) ? 0x40 : 0x00;
        control |= (this.spriteSize === true) ? 0x20 : 0x00;
        control |= (this.patternBackground === true) ? 0x10 : 0x00;
        control |= (this.patternSprite === true) ? 0x08 : 0x00;
        control |= (this.incrementMode === true) ? 0x04 : 0x00;
        control |= (this.nametableY === true) ? 0x02 : 0x00;
        control |= (this.nametableX === true) ? 0x01 : 0x00;
        return control;
    }

    setControl(control) {
        this.enableNmi = !!((control >> 7) & 0x01);
        this.slaveMode = !!((control >> 6) & 0x01);
        this.spriteSize = !!((control >> 5) & 0x01);
        this.patternBackground = !!((control >> 4) & 0x01);
        this.patternSprite = !!((control >> 3) & 0x01);
        this.incrementMode = !!((control >> 2) & 0x01);
        this.nametableY = !!((control >> 1) & 0x01);
        this.nametableX = !!((control >> 0) & 0x01);
    }

    getVramAddr() {
        let vramAddr = 0x00;
        vramAddr |= this.vramCoarseX;
        vramAddr |= (this.vramCoarseY << 5);
        vramAddr |= (this.vramNametableX === true) ? 0x400 : 0x00;
        vramAddr |= (this.vramNametableY === true) ? 0x800 : 0x00;
        vramAddr |= (this.vramFineY << 12);
        vramAddr &= 0x7FFF; // set last bit to 0
        return vramAddr;
    }

    setVramAddr(vramAddr) {
        this.vramCoarseX = vramAddr & 0x1F; // 5 bits
        this.vramCoarseY = (vramAddr >> 5) & 0x1F; // 5 bits
        this.vramNametableX = !!((vramAddr >> 10) & 0x01); // 1 bit
        this.vramNametableY = !!((vramAddr >> 11) & 0x01); // 1 bit
        this.vramFineY = (vramAddr >> 12) & 0x07; // 3 bits
    }

    getTramAddr() {
        let tramAddr = 0x00;
        tramAddr |= this.tramCoarseX;
        tramAddr |= (this.tramCoarseY << 5);
        tramAddr |= (this.tramNametableX === true) ? 0x400 : 0x00;
        tramAddr |= (this.tramNametableY === true) ? 0x800 : 0x00;
        tramAddr |= (this.tramFineY << 12);
        tramAddr &= 0x7FFF; // set last bit to 0
        return tramAddr;
    }

    setTramAddr(tramAddr) {
        this.tramCoarseX = tramAddr & 0x1F; // 5 bits
        this.tramCoarseY = (tramAddr >> 5) & 0x1F; // 5 bits
        this.tramNametableX = !!((tramAddr >> 10) & 0x01); // 1 bit
        this.tramNametableY = !!((tramAddr >> 11) & 0x01); // 1 bit
        this.tramFineY = (tramAddr >> 12) & 0x07; // 3 bits
    }

    // utils 
    // https://stackoverflow.com/questions/2602823
    flipByte(b) {
        b = ((b & 0xF0) >> 4) | ((b & 0x0F) << 4);
        b = ((b & 0xCC) >> 2) | ((b & 0x33) << 2);
        b = ((b & 0xAA) >> 1) | ((b & 0x55) << 1);
        return b;
    }
}

export default PPU;
