const main = require('./main');
const prompt = require('prompt');
let underTest;

describe('submodule updater', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('logger', () => {
    beforeEach(() => {
      underTest = main.logger;
      jest.spyOn(console, 'log').mockImplementation();
    });

    test('logs blue message on success', () => {
      underTest.success('something good');

      expect(console.log).toHaveBeenCalledWith('something good'.blue);
    });

    test('logs red message on error', () => {
      jest.spyOn(process, 'exit').mockImplementation();

      underTest.err('something bad');

      expect(console.log).toHaveBeenCalledWith('Error: '.red, 'something bad'.red);
    });

    test('logs yellow message on warn', () => {
      underTest.warn('something ok');

      expect(console.log).toHaveBeenCalledWith('something ok'.yellow);
    });
  });

  describe('init', () => {
    beforeEach(() => {
      underTest = main.init;
      jest.spyOn(main, 'checkRepo').mockImplementation();
      jest.spyOn(main.logger, 'err').mockImplementation();
    });

    test('fails if no arguments passed', () => {
      underTest([]);

      expect(main.logger.err).toHaveBeenCalled();
      expect(main.checkRepo).not.toHaveBeenCalled();
    });

    test('fails if no -r flag specified', () => {
      underTest([ 'something' ]);

      expect(main.logger.err).toHaveBeenCalled();
      expect(main.checkRepo).not.toHaveBeenCalled();
    });

    test('checks repo flag if provided', () => {
      underTest([ '-r', 'something' ]);

      expect(main.checkRepo).toHaveBeenCalled();
    });
  });

  describe('checkRepo', () => {
    beforeEach(() => {
      underTest = main.checkRepo;

      jest.spyOn(prompt, 'get').mockImplementation();
      jest.spyOn(JSON, 'parse').mockImplementation(() => ({ repos: [ 'some-repo' ] }));
      jest.spyOn(main.logger, 'err').mockImplementation();
    });

    it('fails if repo not found in json file', () => {
      underTest('other-repo');

      expect(main.logger.err).toHaveBeenCalled();
      expect(prompt.get).not.toHaveBeenCalled();
    });

    it('opens prompt if repo found in json file', () => {
      underTest('some-repo');

      expect(prompt.get).toHaveBeenCalled();
    });
  });
})
