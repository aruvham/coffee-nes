/* eslint-disable */
import NES from './src/NES';
import * as roms from './roms';

const FPS = 59;
const romFile = roms.donkey_kong;
const nameTablePatterIdx = 0;
const nameTableHex = false;

const preload = () => {
    window.retroFont = loadFont('./assets/retro_gaming.ttf');
};

const setup = () => {
    createCanvas(512 * 2, 960);
    background(255);
    textFont(retroFont);

    if (!FPS) {
        noLoop();
    } else {
        frameRate(FPS % 60);
    }

    // NES
    window.nes = new NES();
    nes.loadRom(romFile);

    // Rendering & Sprites
    window.screenSprite = createImage(256, 240);
    window.nameTableSprites = [createImage(256, 240), createImage(256, 240)];
    window.patternTableSprites = [createImage(128, 128), createImage(128, 128)];
    window.selectedPalette = 0;
};

const draw = () => {
    background('#1b1b1b');

    updateInputs();
    nesFrame();

    drawFrameRate();
    drawScreen();
    drawPatternTables();
    drawPaletteTable();
    drawNameTable(0);
    drawNameTable(1);
};

const updateInputs = () => {
    let controller = 0x00;
    if (keyIsDown(75)) controller |= 0x80; // x a
    if (keyIsDown(76)) controller |= 0x40; // z b
    if (keyIsDown(SHIFT)) controller |= 0x20; // select
    if (keyIsDown(ENTER)) controller |= 0x10; // start
    if (keyIsDown(87)) controller |= 0x08;
    if (keyIsDown(83)) controller |= 0x04;
    if (keyIsDown(65)) controller |= 0x02;
    if (keyIsDown(68)) controller |= 0x01;
    nes.setController(0, controller);
};

const keyPressed = () => {
    // P
    if (keyCode === 80) {
        selectedPalette++;
        selectedPalette &= 0x07;
    }
    return false;
};

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

// Utils
const nesFrame = () => {
    const currFrame = nes.frameCounter;
    while (nes.frameCounter === currFrame) {
        nes.clock();
    }
};

// Render utils
const drawSprite = (sprite, x, y, pixelData) => {
    sprite.loadPixels();
    const len = sprite.pixels.length;
    for (let i = 0; i < len; i++) {
      sprite.pixels[i] = pixelData[i];
    }
    sprite.updatePixels();
    image(sprite, x, y);
};

const drawScreen = () => {
    stroke(0);
    strokeWeight(2);
    noFill();
    rect(0, 0, 256, 240);
    const screenPixelData = nes.ppu.getScreen();
    drawSprite(screenSprite, 0, 0, screenPixelData);
};

const drawPatternTables = () => {
    stroke(0);
    strokeWeight(2);
    noFill();
    rect(0, 250, 128, 128);
    rect(138, 250, 128, 128);
    const patternTablePixelData0 = nes.ppu.getPatternTable(0, selectedPalette);
    drawSprite(patternTableSprites[0], 0, 250, patternTablePixelData0);
    const patternTablePixelData1 = nes.ppu.getPatternTable(1, selectedPalette);
    drawSprite(patternTableSprites[1], 138, 250, patternTablePixelData1);
};

const drawPaletteTable = () => {
    stroke(0);
    strokeWeight(2);
    noFill();

    for (let i = 0; i < 8; i++) {
        const x = i * 20;
        stroke(0);
        rect(x, 388, 15, 40);

        for (let j = 0; j < 4; j++) {
            const y = 388 + (j * 10);
            const color = [...nes.ppu.getColorFromPaletteTable(j, i), 255];
            noStroke();
            fill(color);
            rect(x, y, 15, 10);

            if (j < 3) {
                stroke(0);
                line(x, y + 10, x + 15, y + 10);
            }
        }

        if (i === selectedPalette) {
            fill(255, 0, 0);
            noStroke();
            text('*', x, 443);
        }
    }
};

const drawNameTable = (idx) => {
    const offsetX = idx * 512;
    stroke(0);
    strokeWeight(2);
    noFill();
    rect(offsetX, 448, 512, 480);
    textSize(8);
    fill(255, 0, 0);
    noStroke();
    const sprite = patternTableSprites[nameTablePatterIdx]; // Which pattern table to use to render bg
    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 32; x++) {
            const value = nes.ppu.nameTables[idx][(y * 32) + x];
            const imageX = (value % 16) * 8;
            const imageY = (Math.floor(value / 16)) * 8;
            image(sprite, (x * 16) + offsetX, (y * 16) + 448, 16, 16, imageX, imageY, 8, 8);
            if (nameTableHex) {
                text(value.toString(16), (x * 16) + offsetX, (y * 16) + 464);
            }
        }
    }
};

const drawFrameRate = () => {
    textSize(14);
    fill(255, 0, 0);
    noStroke();
    const currFrameRate = frameRate().toFixed(1);
    text(currFrameRate + ' FPS', 261, 240);
};
