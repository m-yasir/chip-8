/**
 * ************ CHIP-8 System ************
 */

const programMemory = new Uint8Array(4096);

const stack = new Uint16Array(16);

const registers = new Uint8Array(16);

const programCounter = 0x200;

const indexRegister = 0;

function pairWise(arr) {
  return arr.reduce((acc, curr, i) => {
    if (i % 2 === 0) {
      acc.push([curr, arr[i + 1]]);
    }
    return acc;
  }, []);
}

document.getElementById("rom").addEventListener("change", readRom);

let instructions;

async function readRom(event) {
  const rom = event.target.files[0];
  console.log("Reading ROM file...");

  try {
    const bytes = await rom.arrayBuffer().then((buffer) => {
      return new Uint8Array(buffer);
    });

    instructions = pairWise(bytes).map(
      ([firstByte, secondByte]) => (firstByte << 8) | secondByte
    );

    const instructionsForDisplay = instructions.map((instruction) =>
      instruction.toString(16).padStart(4, "0").toUpperCase()
    );

    document.getElementById("log").innerText =
      instructionsForDisplay.join("\t");
  } catch (error) {
    alert("Error reading ROM file");
    console.error(error);
  }

  console.log("ROM file read successfully");

  // Load ROM into memory
  for (let i = 0; i < instructions.length; i++) {
    programMemory[0x200 + i] = instructions[i];
  }

  console.log("ROM loaded into memory");

  // Execute instructions

  for (let i = 0; i < instructions.length; i++) {
    execute(instructions[i]);
  }
}

/**
 * @param {number} instruction
 */
function execute(instruction) {
  if (instruction === 0x00e0) {
    clearDisplay();
  }

  if ((instruction & 0xf000) === 0x1000) {
    jumpToAddress(instruction & 0x0fff);
  }

  if ((instruction & 0xf000) === 0x6000) {
    setRegister((instruction & 0x0f00) >> 8, instruction & 0x00ff);
  }

  if ((instruction & 0xf000) === 0xA000) {
    setIndexRegister(instruction & 0x0fff);
  }

  if ((instruction & 0xf000) === 0x7000) {
    add((instruction & 0x0f00) >> 8, instruction & 0x00ff);
  }

  if ((instruction & 0xf000) === 0x3000) {
    skipIfEqual((instruction & 0x0f00) >> 8, instruction & 0x00ff);
  }

  if ((instruction & 0xf000) === 0x4000) {
    skipIfNotEqual((instruction & 0x0f00) >> 8, instruction & 0x00ff);
  }

  if ((instruction & 0xf00f) === 0x5000) {
    skipIfRegisterEqual(
      (instruction & 0x0f00) >> 8,
      (instruction & 0x00f0) >> 4
    );
  }

  if ((instruction & 0xf00f) === 0x9000) {
    skipIfRegisterNotEqual(
      (instruction & 0x0f00) >> 8,
      (instruction & 0x00f0) >> 4
    );
  }

  if ((instruction & 0xf000) === 0x2000) {
    callSubroutine(instruction & 0x0fff);
  }

  programCounter += 2;
}

/**
 * ************ INSTRUCTION IMPLEMENTATION ************
 */

function clearDisplay(renderer) {
  // Clear the display
  // TODO: Implement renderer and clear display function
  console.log("Clear the display");
} // 00E0

function setIndexRegister(address) {
  // Set index register
  console.log("Set index register to", address);
  indexRegister = address;
} // ANNN

function setRegister(registerIndex, value) {
  // Set register
  console.log(
    `Set register V${registerIndex} to ${value.toString(16).toUpperCase()}`
  );
  registers[registerIndex] = value;
} // 6XNN

function jumpToAddress(address) {
  // Jump to address
  console.log("Jump to address", address);
  programCounter = address;
} // 1NNN

function add(registerIndex, value) {
  // Add value to register
  console.log(
    `Add ${value.toString(16).toUpperCase()} to register V${registerIndex}`
  );
  registers[registerIndex] += value;
} // 7XNN

function skipIfEqual(registerIndex, value) {
  // Skip next instruction if register value is equal to value
  console.log(
    `Skip next instruction if register V${registerIndex} is equal to ${value.toString(
      16
    ).toUpperCase()}`
  );
  if (registers[registerIndex] === value) {
    programCounter += 2;
  }
} // 3XNN

function skipIfNotEqual(registerIndex, value) {
  // Skip next instruction if register value is not equal to value
  console.log(
    `Skip next instruction if register V${registerIndex} is not equal to ${value.toString(
      16
    ).toUpperCase()}`
  );
  if (registers[registerIndex] !== value) {
    programCounter += 2;
  }
} // 4XNN

function skipIfRegisterEqual(registerIndex1, registerIndex2) {
  // Skip next instruction if register values are equal
  console.log(
    `Skip next instruction if register V${registerIndex1} is equal to register V${registerIndex2}`
  );
  if (registers[registerIndex1] === registers[registerIndex2]) {
    programCounter += 2;
  }
} // 5XY0

function skipIfRegisterNotEqual(registerIndex1, registerIndex2) {
  // Skip next instruction if register values are not equal
  console.log(
    `Skip next instruction if register V${registerIndex1} is not equal to register V${registerIndex2}`
  );
  if (registers[registerIndex1] !== registers[registerIndex2]) {
    programCounter += 2;
  }
} // 9XY0

function callSubroutine(address) {
  // Call subroutine
  console.log("Call subroutine at address", address);
} // 2NNN