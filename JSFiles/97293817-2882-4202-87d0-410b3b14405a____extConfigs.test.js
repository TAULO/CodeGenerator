const httpMocks = require('node-mocks-http');
const extConfigController = require('../../controller/extConfigController');
const extConfigService = require('../../service/extConfigService');
const newCustomExtension = require('../data/newCustomExtension.json');
const customExtensionToDel = require('../data/customExtensionToDel.json');
const allCustomExtension = require('../data/allCustomExtension.json');
const allFixExtension = require('../data/allFixExtension.json');
const fixExtensionToToggle = require('../data/fixExtensionToToggle.json');

describe('Test in Controller Layer', () => {
  extConfigService.addCustomExtConfig = jest.fn();
  extConfigService.getCustomExtConfig = jest.fn();
  extConfigService.deleteCustomExtConfig = jest.fn();
  extConfigService.getFixExtConfig = jest.fn();
  extConfigService.toggleFixConfig = jest.fn();

  let req, res, next;
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('Create Custom in Extension Config Controller', () => {
    beforeEach(() => {
      req.body = newCustomExtension;
    });
    it('should have a addCustomExtConfig function', () => {
      expect(typeof extConfigController.addCustomExtConfig).toBe('function');
    });
    it('should call addCustonExtConfig in service layer', async () => {
      await extConfigController.addCustomExtConfig(req, res, next);
      expect(extConfigService.addCustomExtConfig).toBeCalledWith(
        newCustomExtension
      );
    });
    it('should return 201 response code', async () => {
      await extConfigController.addCustomExtConfig(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
    });
    it('should return json body in response', async () => {
      await extConfigController.addCustomExtConfig(req, res, next);
      expect(res._getJSONData()).toStrictEqual({
        status: 'SUCCESS',
        message: `${req.body.extension} is banned`,
      });
    });

    it('should handle duplicated errors', async () => {
      const duplicatedError = { messsage: 'The Extension is already added' };
      const rejectedPromise = Promise.reject(duplicatedError);
      extConfigService.addCustomExtConfig.mockReturnValue(rejectedPromise);
      await extConfigController.addCustomExtConfig(req, res, next);
      expect(next).toBeCalledWith(duplicatedError);
    });

    it('should handle max count errors', async () => {
      const maxCountError = {
        message: 'You cannot add extension more than 200',
      };
      const rejectedPromise = Promise.reject(maxCountError);
      extConfigService.addCustomExtConfig.mockReturnValue(rejectedPromise);
      await extConfigController.addCustomExtConfig(req, res, next);
      expect(next).toBeCalledWith(maxCountError);
    });
  });

  describe('Get Custom in Extension Config Controller', () => {
    it('should have a getCustomExtConfig function', () => {
      expect(typeof extConfigController.addCustomExtConfig).toBe('function');
    });
    it('should call getCustonExtConfig in service layer', async () => {
      await extConfigController.getCustomExtConfig(req, res, next);
      expect(extConfigService.getCustomExtConfig).toBeCalledWith();
    });
    it('should return 200 response code', async () => {
      await extConfigController.getCustomExtConfig(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });
    it('should return json body in response', async () => {
      extConfigService.getCustomExtConfig.mockReturnValue(allCustomExtension);
      await extConfigController.getCustomExtConfig(req, res, next);
      expect(res._getJSONData()).toStrictEqual({
        status: 'SUCCESS',
        result: allCustomExtension,
      });
    });
  });

  describe('Delete Custom in Extension Config Controller', () => {
    beforeEach(() => {
      req.body = customExtensionToDel;
    });
    it('should have a deleteCustomExtConfig function', () => {
      expect(typeof extConfigController.deleteCustomExtConfig).toBe('function');
    });
    it('should call delelteCustonExtConfig in service layer', async () => {
      await extConfigController.deleteCustomExtConfig(req, res, next);
      expect(extConfigService.deleteCustomExtConfig).toBeCalledWith(
        customExtensionToDel
      );
    });
    it('should return 200 response code', async () => {
      await extConfigController.deleteCustomExtConfig(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle duplicated errors', async () => {
      await extConfigController.deleteCustomExtConfig(req, res, next);
      expect(res._getJSONData()).toStrictEqual({
        status: 'SUCCESS',
        message: `You can upload ${req.body.extension} file.`,
      });
    });
    it('should handle no match data errors', async () => {
      const noMatchError = {
        messsage: 'There is no extension data you want to delete',
      };
      const rejectedPromise = Promise.reject(noMatchError);
      extConfigService.deleteCustomExtConfig.mockReturnValue(rejectedPromise);
      await extConfigController.deleteCustomExtConfig(req, res, next);
      expect(next).toBeCalledWith(noMatchError);
    });
  });

  describe('Get Fix in Extension Config Controller', () => {
    it('should have a getCustomExtConfig function', () => {
      expect(typeof extConfigController.addCustomExtConfig).toBe('function');
    });
    it('should call getFixExtConfig in service layer', async () => {
      await extConfigController.getFixExtConfig(req, res, next);
      expect(extConfigService.getFixExtConfig).toBeCalledWith();
    });
    it('should return 200 response code', async () => {
      await extConfigController.getFixExtConfig(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });
    it('should return json body in response', async () => {
      extConfigService.getFixExtConfig.mockReturnValue(allFixExtension);
      await extConfigController.getFixExtConfig(req, res, next);
      expect(res._getJSONData()).toStrictEqual({
        status: 'SUCCESS',
        result: allFixExtension,
      });
    });
  });

  describe('Toggle Fix in Extension Config Controller', () => {
    beforeEach(() => {
      req.body = fixExtensionToToggle;
    });
    it('should have a toggleFixConfig function', () => {
      expect(typeof extConfigController.toggleFixConfig).toBe('function');
    });
    it('should call toggleFixConfig in service layer', async () => {
      await extConfigController.toggleFixConfig(req, res, next);
      expect(extConfigService.toggleFixConfig).toBeCalledWith(
        fixExtensionToToggle
      );
    });
    it('should return 200 response code', async () => {
      await extConfigController.toggleFixConfig(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._isEndCalled()).toBeTruthy();
    });
    it('should return json body in response', async () => {
      await extConfigController.toggleFixConfig(req, res, next);
      expect(res._getJSONData()).toStrictEqual({
        status: 'SUCCESS',
        message: `${req.body.extension} is banned`,
      });
    });
  });
});
