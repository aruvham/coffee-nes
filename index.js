/* eslint-disable */
import NES from './src/NES';
import * as roms from './roms/js';

const FPS = 20;
const romFile = roms.donkey_kong;

const preload = () => {
    window.retroFont = loadFont('./assets/retro_gaming.ttf');
};

const setup = () => {
    createCanvas(500, 500);
    background(255);
    textFont(retroFont);
    textSize(14);

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
    background('darkgrey');

    nesFrame();

    drawScreen();
    drawPatternTables();
    drawPaletteTable();

    drawFrameRate();
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

const drawFrameRate = () => {
    fill(255, 0, 0);
    noStroke();
    const currFrameRate = frameRate().toFixed(1);
    text(currFrameRate + ' FPS', 261, 240);
};
