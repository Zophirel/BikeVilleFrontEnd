import { SignUpData } from './sign-up-data.model';

describe('SignUpData', () => {
  it('should create an instance', () => {
    expect(new SignUpData('name', 'email', 'password', 'confirmPassword', 'address', 'phone')).toBeTruthy();
  });
});
