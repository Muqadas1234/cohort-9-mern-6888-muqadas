const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { registerUser, loginUser } = require('../services/authService');

describe('authService - registerUser', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should throw an error if the email already exists', async () => {
    sinon.stub(User, 'findOne').resolves({ email: 'existing@example.com' });

    try {
      await registerUser({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      });
      throw new Error('Expected registerUser to throw, but it did not');
    } catch (error) {
      expect(error.message).to.equal('Email already in use');
      expect(error.statusCode).to.equal(400);
    }
  });

  it('should hash the password and create a new user', async () => {
    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(bcrypt, 'hash').resolves('hashed_password_123');
    sinon.stub(User, 'create').resolves({
      _id: 'fake_id_123',
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'hashed_password_123',
    });

    const user = await registerUser({
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'password123',
    });

    expect(user.email).to.equal('newuser@example.com');
    expect(user.password).to.equal('hashed_password_123');
  });

  it('should throw 409 if duplicate email race condition occurs', async () => {
    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(bcrypt, 'hash').resolves('hashed_password_123');
    const duplicateError = new Error('duplicate key');
    duplicateError.code = 11000;
    sinon.stub(User, 'create').rejects(duplicateError);

    try {
      await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      throw new Error('Expected to throw');
    } catch (error) {
      expect(error.message).to.equal('Email already in use');
      expect(error.statusCode).to.equal(409);
    }
  });
});

describe('authService - loginUser', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should throw 401 if user is not found', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    try {
      await loginUser({ email: 'notfound@example.com', password: '123456' });
      throw new Error('Expected to throw');
    } catch (error) {
      expect(error.message).to.equal('Invalid email or password');
      expect(error.statusCode).to.equal(401);
    }
  });

  it('should throw 401 if password does not match', async () => {
    sinon.stub(User, 'findOne').resolves({
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashed_password',
    });
    sinon.stub(bcrypt, 'compare').resolves(false);

    try {
      await loginUser({ email: 'test@example.com', password: 'wrongpassword' });
      throw new Error('Expected to throw');
    } catch (error) {
      expect(error.message).to.equal('Invalid email or password');
      expect(error.statusCode).to.equal(401);
    }
  });

  it('should return user and token on successful login', async () => {
    const fakeUser = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashed_password',
    };
    sinon.stub(User, 'findOne').resolves(fakeUser);
    sinon.stub(bcrypt, 'compare').resolves(true);

    process.env.JWT_SECRET = 'test_secret';
    const result = await loginUser({ email: 'test@example.com', password: '123456' });

    expect(result).to.have.property('token');
    expect(result).to.have.property('user');
    expect(result.user.email).to.equal('test@example.com');
  });
});