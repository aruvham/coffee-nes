import CPU from './CPU';

class NES {
    constructor() {
        const cpu = new CPU(this);
        const ram = new Uint8Array(0x0800);

        const clockCounter = 0;
    }

    reset() {
        this.cpu.reset();
        this.clockCounter = 0;
    }

    clock() {
        if (this.clockCounter % 3 === 0) {
            this.cpu.clock();
        }

        this.clockCounter++;
    }
}
