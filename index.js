const MCP3008_CHANNEL_COUNT = 8;

class MCP3008 {
  constructor(spi, cs) {
    this.spi = spi; // instance of Kaluma SPI
    this.cs = cs; // chip select pin
    this.txBuf = new Uint8Array(3);
    this.rxBuf = new Uint8Array(3);
    this.value = null;
  }

  read(channel) {
    if (channel < 0 || channel >= MCP3008_CHANNEL_COUNT) {
      throw new Error(`Invalid channel: ${channel}`);
    }

    this.txBuf[0] = 0b00000001; // Start bit
    this.txBuf[1] = (8 + channel) << 4; // Single-ended channel select
    this.txBuf[2] = 0; // Dummy byte to clock in the data

    // Select the device  
    digitalWrite(this.cs, LOW);

    // Transfer the txBuffer to the device, and read the rxBuffer back in from the device
    this.rxBuf = this.spi.transfer(this.txBuf);
    this.value = ((this.rxBuf[1] & 0x03) << 8) + this.rxBuf[2];
  
    // Deselect the device
    digitalWrite(this.cs, HIGH);

    return this.value;
  }
}

module.exports = MCP3008;
