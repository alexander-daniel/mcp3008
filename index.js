const MCP3008_CHANNEL_COUNT = 8;

class MCP3008 {
  constructor(spi, cs) {
    this.spi = spi; // instance of Kaluma SPI
    this.cs = cs; // chip select pin
  }

  read(channel) {
    if (channel < 0 || channel >= MCP3008_CHANNEL_COUNT) {
      throw new Error(`Invalid channel: ${channel}`);
    }

    const txBuffer = new Uint8Array([
      0b00000001, // Start bit
      (8 + channel) << 4, // Single-ended channel select
      0 // Dummy byte to clock in the data
    ]);

    // Select the device  
    // console.log('tx', txBuffer);
    digitalWrite(this.cs, LOW);

    // Transfer the txBuffer to the device, and read the rxBuffer back in from the device
    const rxBuffer = this.spi.transfer(txBuffer);
    const value = ((rxBuffer[1] & 0x03) << 8) + rxBuffer[2];

    // Deselect the device
    digitalWrite(this.cs, HIGH);

    return value;
  }
}

module.exports = MCP3008;
