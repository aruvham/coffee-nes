class CPU {
    constructor(nes) {
        this.nes = nes;
        this.reset();
    }

    // Connectivity
    read(addr) {
        return this.nes.readCpu(addr, false);
    }

    write(addr, data) {
        this.nes.writeCpu(addr, data);
    }

    stackPop() {
        return this.read(0x0100 + this.sp++);
    }

    stackPush(data) {
        this.write(0x0100 + this.sp--, data);
    }

    // External Inputs
    reset() {
        this.a = 0x00;
        this.x = 0x00;
        this.y = 0x00;
        this.pc = (this.read(0xFFFD) << 8) | this.read(0xFFFC);
        this.sp = 0xFD;

        this.N = false;
        this.V = false;
        this.U = true;
        this.B = false;
        this.D = false;
        this.I = true;
        this.Z = false;
        this.C = false;

        this.opcode = 0x00;
        this.addrAbs = 0x0000;
        this.addrRel = 0x00;
        this.fetched = 0x00;

        this.cycles = 8;
        this.clockCounter = 0;
    }

    irq() {
        // TODO
    }

    nmi() {
        // TODO
    }

    clock() {
        if (this.cycles === 0) {
            this.opcode = this.read(this.pc++);
            const instruction = instructionLookup[this.opcode];

            // Execute instruction, storing any extra cycles needed
            this.U = true; // ???
            const extraCycleFromAddrMode = this[instruction.addrmode]();
            const extraCycleFromInstruction = this[instruction.name]();
            this.U = true; // ???

            this.cycles += instruction.cycles;
            this.cycles += (extraCycleFromAddrMode & extraCycleFromInstruction);
        }

        this.cycles--;
        this.clockCounter++;
    }

    // Status flag functions
    getStatus() {
        let status = 0x00;
        status |= (this.N === true) ? 0x80 : 0x00;
        status |= (this.V === true) ? 0x40 : 0x00;
        status |= (this.U === true) ? 0x20 : 0x00;
        status |= (this.B === true) ? 0x10 : 0x00;
        status |= (this.D === true) ? 0x08 : 0x00;
        status |= (this.I === true) ? 0x04 : 0x00;
        status |= (this.Z === true) ? 0x02 : 0x00;
        status |= (this.C === true) ? 0x01 : 0x00;
        return status;
    }

    setStatus(status) {
        this.N = (status >> 7) & 0x01;
        this.V = (status >> 6) & 0x01;
        this.U = (status >> 5) & 0x01;
        this.B = (status >> 4) & 0x01;
        this.D = (status >> 3) & 0x01;
        this.I = (status >> 2) & 0x01;
        this.Z = (status >> 1) & 0x01;
        this.C = (status >> 0) & 0x01;
    }

    // Address Modes
    // Address Mode: Implied
    IMP() {
        this.fetched = this.a;
        return 0;
    }

    // Address Mode: Immediate
    IMM() {
        this.addrAbs = this.pc++;
        return 0;
    }

    // Address Mode: Zero Page
    ZP0() {
        this.addrAbs = this.read(this.pc++) & 0x00FF;
        return 0;
    }

    // Address Mode: Zero Page with X Offset
    ZPX() {
        this.addrAbs = (this.read(this.pc++) + this.x) & 0x00FF;
        return 0;
    }

    // Address Mode: Zero Page with Y Offset
    ZPY() {
        this.addrAbs = (this.read(this.pc++) + this.y) & 0x00FF;
        return 0;
    }

    // Address Mode: Relative
    REL() {
        this.addrRel = this.read(this.pc++);
        if (this.addrRel & 0x80) {
            this.addrRel -= 0x0100;
        }
        return 0;
    }

    // Address Mode: Absolute
    ABS() {
        const lo = this.read(this.pc++);
        const hi = this.read(this.pc++) << 8;
        this.addrAbs = hi | lo;
        return 0;
    }

    // Address Mode: Absolute with X Offset
    ABX() {
        const lo = this.read(this.pc++);
        const hi = this.read(this.pc++) << 8;
        this.addrAbs = hi | lo;
        this.addrAbs += this.x;

        if ((this.addrAbs & 0xFF00) !== hi) {
            return 1;
        }

        return 0;
    }

    // Address Mode: Absolute with Y Offset
    ABY() {
        const lo = this.read(this.pc++);
        const hi = this.read(this.pc++) << 8;
        this.addrAbs = hi | lo;
        this.addrAbs += this.y;

        if ((this.addrAbs & 0xFF00) !== hi) {
            return 1;
        }

        return 0;
    }

    // Address Mode: Indirect
    IND() {
        const lo = this.read(this.pc++);
        const hi = this.read(this.pc++) << 8;
        const pointer = hi | lo;

        if (lo === 0x00FF) {
            this.addrAbs = (this.read(pointer & 0xFF00) << 8) | this.read(pointer);
        } else {
            this.addrAbs = (this.read(pointer + 1) << 8) | this.read(pointer);
        }

        return 0;
    }

    // Address Mode: Indirect X
    IZX() {
        const temp = this.read(this.pc++);
        const lo = this.read((temp + this.x) & 0x00FF);
        const hi = (this.read((temp + this.x + 1) & 0x00FF)) << 8;
        this.addrAbs = hi | lo;
        return 0;
    }

    // Address Mode: Indirect Y
    IZY() {
        const temp = this.read(this.pc++);
        const lo = this.read(temp & 0x00FF);
        const hi = (this.read((temp + 1) & 0x00FF)) << 8;
        this.addrAbs = hi | lo;
        this.addrAbs += this.y;

        if ((this.addrAbs & 0xFF00) !== hi) {
            return 1;
        }

        return 0;
    }

    // Instructions
}

export default CPU;
