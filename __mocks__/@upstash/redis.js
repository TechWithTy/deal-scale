const jsonMock = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
};

class Redis {
        constructor() {
                this.json = jsonMock;
        }
}

module.exports = { Redis };
