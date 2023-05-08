const { SPI } = require('spi');
const MCP3008 = require('./index.js'); // replace this with `mcp3008` in your code and package.json.

const SPI_BUS = 0;
const CLOCK_SELECT_PIN = 17;

// Setup our chip select pin for the mcp3008
// we have to set it to output, and set default to HIGH.
// this pin will be pulled down to LOW when we want to read 
// from the MCP3008 peripheral.
pinMode(17, OUTPUT);
digitalWrite(17, HIGH);

// Setup our SPI bus that we'll use to communicate with the MCP3008
const spi = new SPI(SPI_BUS);
const mcp3008 = new MCP3008(spi, CLOCK_SELECT_PIN);

let value;

function loop() {

  // this read function will automatically set the state of the provided
  // chip select pin so it can communicate to the mcp3008 peripheral.
  // all you have to provide is the channel you wish to read (0-7)
  value = mcp3008.read(1);
  console.log(value);

  setTimeout(loop, 10);
}

loop();