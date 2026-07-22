const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { registerUser } = require('../services/authService');

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
});