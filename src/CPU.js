const instructionLookup = [
    { name: 'BRK', addrmode: 'IMP', cycles: 7 }, // 0x00
    { name: 'ORA', addrmode: 'IZX', cycles: 6 }, // 0x01
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x02
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x03
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x04
    { name: 'ORA', addrmode: 'ZP0', cycles: 3 }, // 0x05
    { name: 'ASL', addrmode: 'ZP0', cycles: 5 }, // 0x06
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x07
    { name: 'PHP', addrmode: 'IMP', cycles: 3 }, // 0x08
    { name: 'ORA', addrmode: 'IMM', cycles: 2 }, // 0x09
    { name: 'ASL', addrmode: 'IMP', cycles: 2 }, // 0x0A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x0B
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x0C
    { name: 'ORA', addrmode: 'ABS', cycles: 4 }, // 0x0D
    { name: 'ASL', addrmode: 'ABS', cycles: 6 }, // 0x0E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x0F

    { name: 'BPL', addrmode: 'REL', cycles: 2 }, // 0x10
    { name: 'ORA', addrmode: 'IZY', cycles: 5 }, // 0x11
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x12
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x13
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x14
    { name: 'ORA', addrmode: 'ZPX', cycles: 4 }, // 0x15
    { name: 'ASL', addrmode: 'ZPX', cycles: 6 }, // 0x16
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x17
    { name: 'CLC', addrmode: 'IMP', cycles: 2 }, // 0x18
    { name: 'ORA', addrmode: 'ABY', cycles: 4 }, // 0x19
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x1A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x1B
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x1C
    { name: 'ORA', addrmode: 'ABX', cycles: 4 }, // 0x1D
    { name: 'ASL', addrmode: 'ABX', cycles: 7 }, // 0x1E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x1F

    { name: 'JSR', addrmode: 'ABS', cycles: 6 }, // 0x20
    { name: 'AND', addrmode: 'IZX', cycles: 6 }, // 0x21
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x22
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x23
    { name: 'BIT', addrmode: 'ZP0', cycles: 3 }, // 0x24
    { name: 'AND', addrmode: 'ZP0', cycles: 3 }, // 0x25
    { name: 'ROL', addrmode: 'ZP0', cycles: 5 }, // 0x26
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x27
    { name: 'PLP', addrmode: 'IMP', cycles: 4 }, // 0x28
    { name: 'AND', addrmode: 'IMM', cycles: 2 }, // 0x29
    { name: 'ROL', addrmode: 'IMP', cycles: 2 }, // 0x2A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x2B
    { name: 'BIT', addrmode: 'ABS', cycles: 4 }, // 0x2C
    { name: 'AND', addrmode: 'ABS', cycles: 4 }, // 0x2D
    { name: 'ROL', addrmode: 'ABS', cycles: 6 }, // 0x2E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x2F

    { name: 'BMI', addrmode: 'REL', cycles: 2 }, // 0x30
    { name: 'AND', addrmode: 'IZY', cycles: 5 }, // 0x31
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x32
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x33
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x34
    { name: 'AND', addrmode: 'ZPX', cycles: 4 }, // 0x35
    { name: 'ROL', addrmode: 'ZPX', cycles: 6 }, // 0x36
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x37
    { name: 'SEC', addrmode: 'IMP', cycles: 2 }, // 0x38
    { name: 'AND', addrmode: 'ABY', cycles: 4 }, // 0x39
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x3A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x3B
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x3C
    { name: 'AND', addrmode: 'ABX', cycles: 4 }, // 0x3D
    { name: 'ROL', addrmode: 'ABX', cycles: 7 }, // 0x3E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x3F

    { name: 'RTI', addrmode: 'IMP', cycles: 6 }, // 0x40
    { name: 'EOR', addrmode: 'IZX', cycles: 6 }, // 0x41
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x42
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x43
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x44
    { name: 'EOR', addrmode: 'ZP0', cycles: 3 }, // 0x45
    { name: 'LSR', addrmode: 'ZP0', cycles: 5 }, // 0x46
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x47
    { name: 'PHA', addrmode: 'IMP', cycles: 3 }, // 0x48
    { name: 'EOR', addrmode: 'IMM', cycles: 2 }, // 0x49
    { name: 'LSR', addrmode: 'IMP', cycles: 2 }, // 0x4A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x4B
    { name: 'JMP', addrmode: 'ABS', cycles: 3 }, // 0x4C
    { name: 'EOR', addrmode: 'ABS', cycles: 4 }, // 0x4D
    { name: 'LSR', addrmode: 'ABS', cycles: 6 }, // 0x4E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x4F

    { name: 'BVC', addrmode: 'REL', cycles: 2 }, // 0x50
    { name: 'EOR', addrmode: 'IZY', cycles: 5 }, // 0x51
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x52
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x53
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x54
    { name: 'EOR', addrmode: 'ZPX', cycles: 4 }, // 0x55
    { name: 'LSR', addrmode: 'ZPX', cycles: 6 }, // 0x56
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x57
    { name: 'CLI', addrmode: 'IMP', cycles: 2 }, // 0x58
    { name: 'EOR', addrmode: 'ABY', cycles: 4 }, // 0x59
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x5A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x5B
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x5C
    { name: 'EOR', addrmode: 'ABX', cycles: 4 }, // 0x5D
    { name: 'LSR', addrmode: 'ABX', cycles: 7 }, // 0x5E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x5F

    { name: 'RTS', addrmode: 'IMP', cycles: 6 }, // 0x60
    { name: 'ADC', addrmode: 'IZX', cycles: 6 }, // 0x61
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x62
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x63
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x64
    { name: 'ADC', addrmode: 'ZP0', cycles: 3 }, // 0x65
    { name: 'ROR', addrmode: 'ZP0', cycles: 5 }, // 0x66
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x67
    { name: 'PLA', addrmode: 'IMP', cycles: 4 }, // 0x68
    { name: 'ADC', addrmode: 'IMM', cycles: 2 }, // 0x69
    { name: 'ROR', addrmode: 'IMP', cycles: 2 }, // 0x6A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x6B
    { name: 'JMP', addrmode: 'IND', cycles: 5 }, // 0x6C
    { name: 'ADC', addrmode: 'ABS', cycles: 4 }, // 0x6D
    { name: 'ROR', addrmode: 'ABS', cycles: 6 }, // 0x6E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x6F

    { name: 'BVS', addrmode: 'REL', cycles: 2 }, // 0x70
    { name: 'ADC', addrmode: 'IZY', cycles: 5 }, // 0x71
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x72
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x73
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x74
    { name: 'ADC', addrmode: 'ZPX', cycles: 4 }, // 0x75
    { name: 'ROR', addrmode: 'ZPX', cycles: 6 }, // 0x76
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x77
    { name: 'SEI', addrmode: 'IMP', cycles: 2 }, // 0x78
    { name: 'ADC', addrmode: 'ABY', cycles: 4 }, // 0x79
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x7A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x7B
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x7C
    { name: 'ADC', addrmode: 'ABX', cycles: 4 }, // 0x7D
    { name: 'ROR', addrmode: 'ABX', cycles: 7 }, // 0x7E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x7F

    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x80
    { name: 'STA', addrmode: 'IZX', cycles: 6 }, // 0x81
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x82
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x83
    { name: 'STY', addrmode: 'ZP0', cycles: 3 }, // 0x84
    { name: 'STA', addrmode: 'ZP0', cycles: 3 }, // 0x85
    { name: 'STX', addrmode: 'ZP0', cycles: 3 }, // 0x86
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x87
    { name: 'DEY', addrmode: 'IMP', cycles: 2 }, // 0x88
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x89
    { name: 'TXA', addrmode: 'IMP', cycles: 2 }, // 0x8A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x8B
    { name: 'STY', addrmode: 'ABS', cycles: 4 }, // 0x8C
    { name: 'STA', addrmode: 'ABS', cycles: 4 }, // 0x8D
    { name: 'STX', addrmode: 'ABS', cycles: 4 }, // 0x8E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x8F

    { name: 'BCC', addrmode: 'REL', cycles: 2 }, // 0x90
    { name: 'STA', addrmode: 'IZY', cycles: 6 }, // 0x91
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x92
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x93
    { name: 'STY', addrmode: 'ZPX', cycles: 4 }, // 0x94
    { name: 'STA', addrmode: 'ZPX', cycles: 4 }, // 0x95
    { name: 'STX', addrmode: 'ZPY', cycles: 4 }, // 0x96
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x97
    { name: 'TYA', addrmode: 'IMP', cycles: 2 }, // 0x98
    { name: 'STA', addrmode: 'ABY', cycles: 5 }, // 0x99
    { name: 'TXS', addrmode: 'IMP', cycles: 2 }, // 0x9A
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x9B
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x9C
    { name: 'STA', addrmode: 'ABX', cycles: 5 }, // 0x9D
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x9E
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0x9F

    { name: 'LDY', addrmode: 'IMM', cycles: 2 }, // 0xA0
    { name: 'LDA', addrmode: 'IZX', cycles: 6 }, // 0xA1
    { name: 'LDX', addrmode: 'IMM', cycles: 2 }, // 0xA2
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xA3
    { name: 'LDY', addrmode: 'ZP0', cycles: 3 }, // 0xA4
    { name: 'LDA', addrmode: 'ZP0', cycles: 3 }, // 0xA5
    { name: 'LDX', addrmode: 'ZP0', cycles: 3 }, // 0xA6
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xA7
    { name: 'TAY', addrmode: 'IMP', cycles: 2 }, // 0xA8
    { name: 'LDA', addrmode: 'IMM', cycles: 2 }, // 0xA9
    { name: 'TAX', addrmode: 'IMP', cycles: 2 }, // 0xAA
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xAB
    { name: 'LDY', addrmode: 'ABS', cycles: 4 }, // 0xAC
    { name: 'LDA', addrmode: 'ABS', cycles: 4 }, // 0xAD
    { name: 'LDX', addrmode: 'ABS', cycles: 4 }, // 0xAE
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xAF

    { name: 'BCS', addrmode: 'REL', cycles: 2 }, // 0xB0
    { name: 'LDA', addrmode: 'IZY', cycles: 5 }, // 0xB1
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xB2
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xB3
    { name: 'LDY', addrmode: 'ZPX', cycles: 4 }, // 0xB4
    { name: 'LDA', addrmode: 'ZPX', cycles: 4 }, // 0xB5
    { name: 'LDX', addrmode: 'ZPY', cycles: 4 }, // 0xB6
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xB7
    { name: 'CLV', addrmode: 'IMP', cycles: 2 }, // 0xB8
    { name: 'LDA', addrmode: 'ABY', cycles: 4 }, // 0xB9
    { name: 'TSX', addrmode: 'IMP', cycles: 2 }, // 0xBA
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xBB
    { name: 'LDY', addrmode: 'ABX', cycles: 4 }, // 0xBC
    { name: 'LDA', addrmode: 'ABX', cycles: 4 }, // 0xBD
    { name: 'LDX', addrmode: 'ABY', cycles: 4 }, // 0xBE
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xBF

    { name: 'CPY', addrmode: 'IMM', cycles: 2 }, // 0xC0
    { name: 'CMP', addrmode: 'IZX', cycles: 6 }, // 0xC1
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xC2
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xC3
    { name: 'CPY', addrmode: 'ZP0', cycles: 3 }, // 0xC4
    { name: 'CMP', addrmode: 'ZP0', cycles: 3 }, // 0xC5
    { name: 'DEC', addrmode: 'ZP0', cycles: 5 }, // 0xC6
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xC7
    { name: 'INY', addrmode: 'IMP', cycles: 2 }, // 0xC8
    { name: 'CMP', addrmode: 'IMM', cycles: 2 }, // 0xC9
    { name: 'DEX', addrmode: 'IMP', cycles: 2 }, // 0xCA
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xCB
    { name: 'CPY', addrmode: 'ABS', cycles: 4 }, // 0xCC
    { name: 'CMP', addrmode: 'ABS', cycles: 4 }, // 0xCD
    { name: 'DEC', addrmode: 'ABS', cycles: 6 }, // 0xCE
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xCF

    { name: 'BNE', addrmode: 'REL', cycles: 2 }, // 0xD0
    { name: 'CMP', addrmode: 'IZY', cycles: 5 }, // 0xD1
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xD2
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xD3
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xD4
    { name: 'CMP', addrmode: 'ZPX', cycles: 4 }, // 0xD5
    { name: 'DEC', addrmode: 'ZPX', cycles: 6 }, // 0xD6
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xD7
    { name: 'CLD', addrmode: 'IMP', cycles: 2 }, // 0xD8
    { name: 'CMP', addrmode: 'ABY', cycles: 4 }, // 0xD9
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xDA
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xDB
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xDC
    { name: 'CMP', addrmode: 'ABX', cycles: 4 }, // 0xDD
    { name: 'DEC', addrmode: 'ABX', cycles: 7 }, // 0xDE
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xDF

    { name: 'CPX', addrmode: 'IMM', cycles: 2 }, // 0xE0
    { name: 'SBC', addrmode: 'IZX', cycles: 6 }, // 0xE1
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xE2
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xE3
    { name: 'CPX', addrmode: 'ZP0', cycles: 3 }, // 0xE4
    { name: 'SBC', addrmode: 'ZP0', cycles: 3 }, // 0xE5
    { name: 'INC', addrmode: 'ZP0', cycles: 5 }, // 0xE6
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xE7
    { name: 'INX', addrmode: 'IMP', cycles: 2 }, // 0xE8
    { name: 'SBC', addrmode: 'IMM', cycles: 2 }, // 0xE9
    { name: 'NOP', addrmode: 'IMP', cycles: 2 }, // 0xEA
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xEB
    { name: 'CPX', addrmode: 'ABS', cycles: 4 }, // 0xEC
    { name: 'SBC', addrmode: 'ABS', cycles: 4 }, // 0xED
    { name: 'INC', addrmode: 'ABS', cycles: 6 }, // 0xEE
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xFF

    { name: 'BEQ', addrmode: 'REL', cycles: 2 }, // 0xF0
    { name: 'SBC', addrmode: 'IZY', cycles: 5 }, // 0xF1
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xF2
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xF3
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xF4
    { name: 'SBC', addrmode: 'ZPX', cycles: 4 }, // 0xF5
    { name: 'INC', addrmode: 'ZPX', cycles: 6 }, // 0xF6
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xF7
    { name: 'SED', addrmode: 'IMP', cycles: 2 }, // 0xF8
    { name: 'SBC', addrmode: 'ABY', cycles: 4 }, // 0xF9
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xFA
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xFB
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xFC
    { name: 'SBC', addrmode: 'ABX', cycles: 4 }, // 0xFD
    { name: 'INC', addrmode: 'ABX', cycles: 7 }, // 0xFE
    { name: 'XXX', addrmode: 'XXX', cycles: 0 }, // 0xFF
];

class CPU {
    constructor(nes) {
        this.nes = nes;

        this.a = 0x00;
        this.x = 0x00;
        this.y = 0x00;
        this.pc = 0x0000;
        this.sp = 0x00;

        this.N = false;
        this.V = false;
        // this.U = true;
        // this.B = false;
        this.D = false;
        this.I = true;
        this.Z = false;
        this.C = false;

        this.opcode = 0x00;
        this.addrAbs = 0x0000;
        this.addrRel = 0x00;
        this.fetched = 0x00;

        this.cycles = 0;
        this.clockCounter = 0;
    }

    // Connectivity
    read(addr) {
        if (addr < 0 || addr > 0xFFFF) console.error('Error | Reading from mem', addr);
        return this.nes.cpuRead(addr, false);
    }

    // read16(addr) {
    //     return (this.read(addr + 1) << 8) | this.read(addr);
    // }

    write(addr, data) {
        if (addr < 0 || addr > 0xFFFF) console.error('Error | Writing to mem', addr);
        this.nes.cpuWrite(addr & 0xFFFF, data);
    }

    stackPop() {
        this.sp = (this.sp + 1) & 0xFF;
        return this.read(0x0100 | this.sp);
    }

    stackPush(data) {
        if (data < 0 || data > 0xFF) console.error('Error | Writing to stack', data);
        if (this.sp < 0 || this.sp > 0xFF) console.error('Error | Stack Pointer', this.sp);
        this.write(0x0100 | this.sp, data);
        this.sp = (this.sp - 1) & 0xFF;
    }

    // External Inputs
    reset() {
        if (this.nes.rom) {
            this.a = 0x00;
            this.x = 0x00;
            this.y = 0x00;
            this.pc = (this.read(0xFFFD) << 8) | this.read(0xFFFC);
            this.sp = 0xFD;

            this.N = false;
            this.V = false;
            this.D = false;
            this.I = true;
            this.Z = false;
            this.C = false;

            this.opcode = 0x00;
            this.addrAbs = 0x0000;
            this.addrRel = 0x00;
            this.fetched = 0x00;

            this.cycles = 8;
        }
    }

    irq() {
        console.error('irq');
    }

    nmi() {
        this.stackPush(this.pc >> 8);
        this.stackPush(this.pc & 0x00FF);
        this.stackPush(this.getStatus());
        this.I = true;
        this.pc = (this.read(0xFFFB) << 8) | this.read(0xFFFA);
        this.cycles = 8;
    }

    clock() {
        // if (this.clockCounter === 351849) debugger;
        if (this.cycles === 0) {
            this.opcode = this.read(this.pc++);
            // if (this.opcode === 0x00) debugger;
            const instruction = instructionLookup[this.opcode];
            const extraCycleFromAddrMode = this[instruction.addrmode]();
            const extraCycleFromInstruction = this[instruction.name]();

            this.cycles += instruction.cycles;
            this.cycles += (extraCycleFromAddrMode & extraCycleFromInstruction);

            if (this.a < 0 || this.a > 0xFF) console.error('Error | A', this.a);
            if (this.x < 0 || this.x > 0xFF) console.error('Error | X', this.x);
            if (this.y < 0 || this.y > 0xFF) console.error('Error | Y', this.Y);
            if (this.addrAbs < 0 || this.addrAbs > 0xFFFF) console.error('Error | this.addrAbs ', this.addrAbs);
            if (instruction.name === 'XXX') console.error('XXX', this.opcode.toString(16), this.clockCounter);
        }

        this.cycles--;
        this.clockCounter++;
    }

    // Status flag functions
    getStatus() {
        let status = 0x20;
        status |= (this.N === true) ? 0x80 : 0x00;
        status |= (this.V === true) ? 0x40 : 0x00;
        // status |= (this.U === true) ? 0x20 : 0x00;
        // status |= (this.B === true) ? 0x10 : 0x00;
        status |= (this.D === true) ? 0x08 : 0x00;
        status |= (this.I === true) ? 0x04 : 0x00;
        status |= (this.Z === true) ? 0x02 : 0x00;
        status |= (this.C === true) ? 0x01 : 0x00;
        return status;
    }

    setStatus(status) {
        this.N = !!((status >> 7) & 0x01);
        this.V = !!((status >> 6) & 0x01);
        // this.U = (status >> 5) & 0x01;
        // this.B = (status >> 4) & 0x01;
        this.D = !!((status >> 3) & 0x01);
        this.I = !!((status >> 2) & 0x01);
        this.Z = !!((status >> 1) & 0x01);
        this.C = !!((status >> 0) & 0x01);
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
        this.addrAbs &= 0xFFFF;

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
        this.addrAbs &= 0xFFFF;

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
        this.addrAbs &= 0xFFFF;

        if ((this.addrAbs & 0xFF00) !== hi) {
            return 1;
        }

        return 0;
    }

    fetch() {
        if (instructionLookup[this.opcode].addrmode !== 'IMP') {
            this.fetched = this.read(this.addrAbs);
        }
    }

    // Instructions
    // Add Memory to Accumulator with Carry
    ADC() {
        this.fetch();
        const temp = this.a + this.fetched + (this.C ? 1 : 0);
        this.V = !!((~(this.a ^ this.fetched) & (this.a ^ temp)) & 0x80);
        this.C = !!(temp & 0x0100);
        this.a = temp & 0xFF;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 1;
    }

    // AND Memory with Accumulator
    AND() {
        this.fetch();
        this.a &= this.fetched;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 1;
    }

    // Shift Left One Bit (Memory or Accumulator)
    ASL() {
        this.fetch();
        this.C = !!(this.fetched & 0x80);
        const temp = (this.fetched << 1) & 0xFF;
        this.Z = temp === 0;
        this.N = !!(temp & 0x80);

        if (instructionLookup[this.opcode].addrmode === 'IMP') {
            this.a = temp;
        } else {
            this.write(this.addrAbs, temp);
        }

        return 0;
    }

    branchInstruction(condition) {
        if (condition) {
            this.cycles++;
            const addr = this.pc + this.addrRel;

            // Page crossed
            if ((this.pc & 0xFF00) !== (addr & 0xFF00)) {
                this.cycles++;
            }

            this.pc = addr;
        }
        return 0;
    }

    // Branch on Carry Clear
    BCC() {
        return this.branchInstruction(!this.C);
    }

    // Branch on Carry Set
    BCS() {
        return this.branchInstruction(this.C);
    }

    // Branch on Result Zero
    BEQ() {
        return this.branchInstruction(this.Z);
    }

    // Test Bits in Memory with Accumulator
    BIT() {
        this.fetch();
        this.V = !!((this.fetched >> 6) & 1);
        this.N = !!((this.fetched >> 7) & 1);
        this.Z = (this.a & this.fetched) === 0;
        return 0;
    }

    // Branch on Result Minus
    BMI() {
        this.branchInstruction(this.N);
    }

    // Branch on Result not Zero
    BNE() {
        this.branchInstruction(!this.Z);
    }

    // Branch on Result Plus
    BPL() {
        this.branchInstruction(!this.N);
    }

    // Force Break
    BRK() {
        // debugger;
        this.pc++;
        this.stackPush((this.pc >> 8) & 0x00FF);
        this.stackPush(this.pc & 0x00FF);
        this.stackPush(this.getStatus() | 0x10);
        this.I = true;
        this.pc = (this.read(0xFFFF) << 8) | this.read(0xFFFE);
        // this.pc = (this.read(0xFFFD) << 8) | this.read(0xFFFC);
        // this.pc--;
        return 0;
    }

    BVC() {
        this.branchInstruction(!this.V);
    }

    BVS() {
        this.branchInstruction(this.V);
    }

    // Clear Carry Flag
    CLC() {
        this.C = false;
        return 0;
    }

    // Clear Decimal Mode
    CLD() {
        this.D = false;
        return 0;
    }

    // Clear Interrupt Disable Bit
    CLI() {
        this.I = false;
        return 0;
    }

    // Clear Overflow Flag
    CLV() {
        this.V = false;
        return 0;
    }

    // Compare Memory with Accumulator
    CMP() {
        this.fetch();
        const temp = this.a - this.fetched;
        this.C = temp >= 0;
        this.Z = temp === 0;
        this.N = !!(temp & 0x80);
        return 1;
    }

    // Compare Memory and Index X
    CPX() {
        this.fetch();
        const temp = this.x - this.fetched;
        this.C = temp >= 0;
        this.Z = temp === 0;
        this.N = !!(temp & 0x80);
        return 0;
    }

    // Compare Memory and Index Y
    CPY() {
        this.fetch();
        const temp = this.y - this.fetched;
        this.C = temp >= 0;
        this.Z = temp === 0;
        this.N = !!(temp & 0x80);
        return 0;
    }

    // Decrement Memory by One
    DEC() {
        this.fetch();
        const temp = (this.fetched - 1) & 0xFF;
        this.N = !!(temp & 0x80);
        this.Z = temp === 0;
        this.write(this.addrAbs, temp);
        return 0;
    }

    // Decrement Index X by One
    DEX() {
        this.x--;
        this.x &= 0xFF;
        this.Z = this.x === 0;
        this.N = !!(this.x & 0x80);
        return 0;
    }

    // Decrement Index Y by One
    DEY() {
        this.y--;
        this.y &= 0xFF;
        this.Z = this.y === 0;
        this.N = !!(this.y & 0x80);
        return 0;
    }

    // Exclusive-OR Memory with Accumulator
    EOR() {
        this.fetch();
        this.a ^= this.fetched;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 1;
    }

    // Increment Memory by One
    INC() {
        this.fetch();
        const temp = (this.fetched + 1) & 0xFF;
        this.N = !!(temp & 0x80);
        this.Z = temp === 0;
        this.write(this.addrAbs, temp);
        return 0;
    }

    // Increment Index X by One
    INX() {
        this.x++;
        this.x &= 0xFF;
        this.Z = this.x === 0;
        this.N = !!(this.x & 0x80);
        return 0;
    }

    // Increment Index Y by One
    INY() {
        this.y++;
        this.y &= 0xFF;
        this.Z = this.y === 0;
        this.N = !!(this.y & 0x80);
        return 0;
    }

    // Jump to New Location
    JMP() {
        this.pc = this.addrAbs;
        return 0;
    }

    // Jump to New Location Saving Return Address
    JSR() {
        this.pc--;
        this.stackPush(this.pc >> 8);
        this.stackPush(this.pc & 0x00FF);
        this.pc = this.addrAbs;
        return 0;
    }

    // Load Accumulator with Memory
    LDA() {
        this.fetch();
        this.a = this.fetched;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 1;
    }

    // Load Accumulator with Memory
    LDX() {
        this.fetch();
        this.x = this.fetched;
        this.Z = this.x === 0;
        this.N = !!(this.x & 0x80);
        return 1;
    }

    // Load Index Y with Memory
    LDY() {
        this.fetch();
        this.y = this.fetched;
        this.Z = this.y === 0;
        this.N = !!(this.y & 0x80);
        return 1;
    }

    // Shift One Bit Right (Memory or Accumulator)
    LSR() {
        this.fetch();
        this.C = !!(this.fetched & 0x01);
        const temp = (this.fetched >> 1) & 0xFF;
        this.Z = temp === 0;
        this.N = false;

        if (instructionLookup[this.opcode].addrmode === 'IMP') {
            this.a = temp;
        } else {
            this.write(this.addrAbs, temp);
        }

        return 0;
    }

    // No Operation
    NOP() {
        return 0;
    }

    // Exclusive-OR Memory with Accumulator
    ORA() {
        this.fetch();
        this.a |= this.fetched;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 1;
    }

    PHA() {
        this.stackPush(this.a);
        return 0;
    }

    PHP() {
        this.stackPush(this.getStatus() | 0x10);
        return 0;
    }

    // Pull Accumulator from Stack
    PLA() {
        this.a = this.stackPop();
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 0;
    }

    // Pull Processor Status from Stack
    PLP() {
        const temp = this.stackPop();
        this.setStatus(temp);
        return 0;
    }

    // Rotate One Bit Left (Memory or Accumulator)
    ROL() {
        this.fetch();
        const carry = this.C ? 1 : 0;
        const temp = ((this.fetched << 1) | carry) & 0xFF;
        this.C = !!(this.fetched & 0x80);
        this.Z = temp === 0;
        this.N = !!(temp & 0x80);

        if (instructionLookup[this.opcode].addrmode === 'IMP') {
            this.a = temp;
        } else {
            this.write(this.addrAbs, temp);
        }
    }

    // Rotate One Bit Right (Memory or Accumulator)
    ROR() {
        this.fetch();
        const carry = this.C ? 1 : 0;
        const temp = (this.fetched >> 1) | (carry << 7);
        this.C = !!(this.fetched & 0x01);
        this.Z = temp === 0;
        this.N = !!carry;

        if (instructionLookup[this.opcode].addrmode === 'IMP') {
            this.a = temp;
        } else {
            this.write(this.addrAbs, temp);
        }
    }

    // Return from Interrupt
    RTI() {
        this.setStatus(this.stackPop());
        // console.log(this.getStatus())
        const lo = this.stackPop();
        const hi = this.stackPop() << 8;
        this.pc = hi | lo;
        return 0;
    }

    // Return from Subroutine
    RTS() {
        const lo = this.stackPop();
        const hi = this.stackPop() << 8;
        this.pc = hi | lo;
        this.pc++;
        return 0;
    }

    // Subtract Memory from Accumulator with Borrow
    SBC() {
        this.fetch();
        const temp = this.a + ~this.fetched + (this.C ? 1 : 0);
        this.V = !!(((this.a ^ this.fetched) & (this.a ^ temp)) & 0x80);
        this.C = !(temp & 0x100);
        this.a = temp & 0xFF;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 1;
    }

    // Set Carry Flag
    SEC() {
        this.C = true;
        return 0;
    }

    // Set Decimal Flag
    SED() {
        this.D = true;
        return 0;
    }

    // Set Interrupt Disable Status
    SEI() {
        this.I = true;
        return 0;
    }

    // Store Accumulator in Memory
    STA() {
        this.write(this.addrAbs, this.a);
        return 0;
    }

    // Store Index X in Memory
    STX() {
        this.write(this.addrAbs, this.x);
        return 0;
    }

    // Sore Index Y in Memory
    STY() {
        this.write(this.addrAbs, this.y);
        return 0;
    }

    // Transfer Accumulator to Index X
    TAX() {
        this.x = this.a;
        this.Z = this.x === 0;
        this.N = !!(this.x & 0x80);
        return 0;
    }

    // Transfer Accumulator to Index Y
    TAY() {
        this.y = this.a;
        this.Z = this.y === 0;
        this.N = !!(this.y & 0x80);
        return 0;
    }

    // Transfer Stack Pointer to Index X
    TSX() {
        this.x = this.sp;
        this.Z = this.x === 0;
        this.N = !!(this.x & 0x80);
        return 0;
    }

    // Transfer Index X to Accumulator
    TXA() {
        this.a = this.x;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 0;
    }

    // Transfer Index X to Stack Register
    TXS() {
        this.sp = this.x;
        return 0;
    }

    // Transfer Index Y to Accumulator
    TYA() {
        this.a = this.y;
        this.Z = this.a === 0;
        this.N = !!(this.a & 0x80);
        return 0;
    }

    // Unoficial instruction
    XXX() {
        return this.NOP();
    }
}

export default CPU;
