import {
    describe,
    test,
    expect
} from '@jest/globals';
import User from '../src/entinties/User';

describe('Unit tests for user', () => {
    test('Should return an exception when id is invalid', () => {
        expect(() => {
            new User(undefined, 'Jhon', 'jhontest15252@gmail.com');
        }).toThrowError('ID is required');
    });

    test('Should return an exception when name is invalid', () => {
        expect(() => {
            new User(1, '', 'jhontest15252@gmail.com');
        }).toThrowError('Name is required');
    });

    test('Should return an exception when email is invalid', () => {
        expect(() => {
            new User(1, 'Jhon', '');
        }).toThrowError('Email is required');
    });

    test('Should return an exception when id, name and email are invalid with all exceptions.', () => {
        expect(() => {
            new User(undefined, '', '');
        }).toThrowError('ID is required, Name is required, Email is required');
    });
})