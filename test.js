const MCP3008 = require('./index');

global.digitalWrite = jest.fn();
global.LOW = 0;
global.HIGH = 1;

// Define a fake SPI transaction for testing
const fakeTransaction = jest.fn(() => new Uint8Array([0x01, 255, 255]));

describe('MCP3008', () => {
  let spi;
  let cs;
  let adc;

  beforeEach(() => {
    // Create a new instance of the Kaluma SPI module for each test
    spi = {
      transfer: jest.fn()
    };
    cs = 10; // Use an integer value for the chip select pin
    adc = new MCP3008(spi, cs);

    // Mock the SPI transfer method to return a fake transaction
    spi.transfer.mockImplementation(fakeTransaction);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('reads voltage from channel 0', () => {
    const value = adc.read(0);
    expect(spi.transfer).toHaveBeenCalledWith(new Uint8Array([0x01, 0x80, 0x00]));
    expect(spi.transfer).toHaveBeenCalledTimes(1);
    expect(value).toBe(1023);
  });

  test('reads voltage from channel 1', () => {
    const value = adc.read(1);
    expect(spi.transfer).toHaveBeenCalledWith(new Uint8Array([0x01, 0x90, 0x00]));
    expect(spi.transfer).toHaveBeenCalledTimes(1);
    expect(value).toBe(1023);
  });

  test('throws error for invalid channel', () => {
    expect(() => adc.read(8)).toThrow('Invalid channel: 8');
    expect(() => adc.read(-1)).toThrow('Invalid channel: -1');
  });
});
