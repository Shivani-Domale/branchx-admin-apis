// __tests__/admin-service.test.js
const adminService = require('../src/service/admin-service');
const adminRepo = require('../src/repositories/admin-repository');
const sendCredentialsEmail = require('../src/utils/sendCredentialsEmail');
const sendResetCodeEmail = require('../src/utils/sendResetCodeEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../src/config');

jest.mock('../src/repositories/admin-repository');
jest.mock('../src/utils/sendCredentialsEmail');
jest.mock('../src/utils/sendResetCodeEmail');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AdminService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('registerAdmin', () => {
    it('should register a new admin and send credentials email', async () => {
      adminRepo.findByEmail.mockResolvedValue(null);
      adminRepo.createAdmin.mockResolvedValue({ id: 1, email: 'test@admin.com' });
      bcrypt.hash.mockResolvedValue('hashed_password');

      const result = await adminService.registerAdmin({ name: 'Test', email: 'test@admin.com' });
      expect(result).toHaveProperty('id');
      expect(sendCredentialsEmail).toHaveBeenCalled();
    });

    it('should throw error if email is already registered', async () => {
      adminRepo.findByEmail.mockResolvedValue({ id: 1 });
      await expect(adminService.registerAdmin({ name: 'X', email: 'x@x.com' }))
        .rejects.toThrow('Email already registered');
    });
  });

  describe('loginAdmin', () => {
    it('should login as org admin with env credentials', async () => {
      const mockAdmin = { id: 1, email: ServerConfig.ORG_ADMIN_EMAIL, role: 'ORG_ADMIN' };
      adminRepo.findByEmail.mockResolvedValue(mockAdmin);
      jwt.sign.mockReturnValue('mocked.token');

      const result = await adminService.loginAdmin({
        email: ServerConfig.ORG_ADMIN_EMAIL,
        password: ServerConfig.ORG_ADMIN_PASSWORD
      });

      expect(result.token).toBe('mocked.token');
    });

    it('should login regular admin with valid credentials', async () => {
      const admin = { id: 2, email: 'admin@x.com', role: 'ADMIN', password: 'hashed' };
      adminRepo.findByEmail.mockResolvedValue(admin);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      const result = await adminService.loginAdmin({ email: 'admin@x.com', password: 'pass' });
      expect(result.token).toBe('token123');
    });

    it('should throw error for invalid credentials', async () => {
      adminRepo.findByEmail.mockResolvedValue(null);
      await expect(adminService.loginAdmin({ email: 'a', password: 'b' }))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('forgotPassword', () => {
    it('should generate and email reset token', async () => {
      adminRepo.findByEmail.mockResolvedValue({ email: 'test@admin.com' });
      adminRepo.updateAdmin.mockResolvedValue();
      await adminService.forgotPassword('test@admin.com');
      expect(sendResetCodeEmail).toHaveBeenCalled();
    });

    it('should throw error if admin not found', async () => {
      adminRepo.findByEmail.mockResolvedValue(null);
      await expect(adminService.forgotPassword('notfound@x.com'))
        .rejects.toThrow('Admin not found');
    });
  });

  describe('verifyResetCode', () => {
    it('should succeed if token is valid and not expired', async () => {
      const futureDate = new Date(Date.now() + 100000);
      adminRepo.findByEmail.mockResolvedValue({ resetToken: 'abc123', resetTokenExpire: futureDate });

      await expect(adminService.verifyResetCode({ email: 'x@x.com', resetToken: 'abc123' }))
        .resolves.not.toThrow();
    });

    it('should throw error if token is invalid or expired', async () => {
      const pastDate = new Date(Date.now() - 100000);
      adminRepo.findByEmail.mockResolvedValue({ resetToken: 'abc123', resetTokenExpire: pastDate });

      await expect(adminService.verifyResetCode({ email: 'x@x.com', resetToken: 'wrong' }))
        .rejects.toThrow('Invalid or expired reset token.');
    });
  });

  describe('resetPassword', () => {
    it('should reset password if token is valid', async () => {
      const future = new Date(Date.now() + 60000);
      adminRepo.findByEmail.mockResolvedValue({ resetToken: 'token123', resetTokenExpire: future });
      bcrypt.hash.mockResolvedValue('hashedNew');
      adminRepo.updateAdmin.mockResolvedValue();

      await expect(adminService.resetPassword({
        email: 'a', resetToken: 'token123', newPassword: 'pass'
      })).resolves.not.toThrow();
    });

    it('should throw if reset token does not match', async () => {
      const future = new Date(Date.now() + 60000);
      adminRepo.findByEmail.mockResolvedValue({ resetToken: 'expected', resetTokenExpire: future });

      await expect(adminService.resetPassword({
        email: 'a', resetToken: 'wrong', newPassword: 'pass'
      })).rejects.toThrow('Invalid reset token');
    });
  });

  describe('changePassword', () => {
    it('should update password if old password is correct', async () => {
      adminRepo.findByEmail.mockResolvedValue({ password: 'hashedOld' });
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashedNew');
      adminRepo.updateAdmin.mockResolvedValue();

      await expect(adminService.changePassword({
        email: 'a', oldPassword: 'old', newPassword: 'new'
      })).resolves.not.toThrow();
    });

    it('should throw if old password is incorrect', async () => {
      adminRepo.findByEmail.mockResolvedValue({ password: 'hashedOld' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(adminService.changePassword({
        email: 'a', oldPassword: 'wrong', newPassword: 'new'
      })).rejects.toThrow('Old password is incorrect');
    });
  });

  describe('getAdminById', () => {
    it('should return admin if found', async () => {
      const adminMock = { id: 1, name: 'Test' };
      adminRepo.findById.mockResolvedValue(adminMock);
      const result = await adminService.getAdminById(1);
      expect(result).toEqual(adminMock);
    });

    it('should throw if admin not found', async () => {
      adminRepo.findById.mockResolvedValue(null);
      await expect(adminService.getAdminById(1)).rejects.toThrow('Admin not found');
    });
  });

  describe('getAllAdmins', () => {
    it('should return list of all admins', async () => {
      const mockAdmins = [{ id: 1 }, { id: 2 }];
      adminRepo.findAll.mockResolvedValue(mockAdmins);
      const result = await adminService.getAllAdmins();
      expect(result).toEqual(mockAdmins);
    });
  });

  describe('updateAdminDetails', () => {
    it('should update admin details successfully', async () => {
      const admin = { id: 1, email: 'admin@x.com' };
      adminRepo.findById.mockResolvedValue(admin);
      adminRepo.updateAdmin.mockResolvedValue();

      const result = await adminService.updateAdminDetails(1, { name: 'Updated' });
      expect(result).toEqual({ message: 'Admin details updated successfully' });
    });

    it('should throw error if admin not found', async () => {
      adminRepo.findById.mockResolvedValue(null);
      await expect(adminService.updateAdminDetails(1, {}))
        .rejects.toThrow('Admin not found');
    });

    it('should throw error when trying to update Org Admin', async () => {
      adminRepo.findById.mockResolvedValue({ email: ServerConfig.ORG_ADMIN_EMAIL });
      await expect(adminService.updateAdminDetails(1, {}))
        .rejects.toThrow('Cannot update Org Admin details');
    });
  });
});
