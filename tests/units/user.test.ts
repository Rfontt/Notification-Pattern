import {
    describe,
    test,
    expect
} from '@jest/globals';
import User from '../../src/entinties/User';

describe('Unit tests for user', () => {
    test('Should return an exception when id is invalid', () => {
        // const user = new User(undefined, 'Jhon', 'jhontest15252@gmail.com');

        // console.log(user)

        expect(() => {
            new User(undefined, 'Jhon', 'jhontest15252@gmail.com')
        }).toThrowError('User: ID is required');
    });

    test('Should return an exception when name is invalid', () => {
        expect(() => {
            new User(1, '', 'jhontest15252@gmail.com');
        }).toThrowError('User: Name is required');
    });

    test('Should return an exception when email is invalid', () => {
        expect(() => {
            new User(1, 'Jhon', '');
        }).toThrowError('User: Email is required');
    });

    test('Should return an exception when id, name and email are invalid with all exceptions.', () => {
        expect(() => {
            new User(undefined, '', '');
        }).toThrowError('User: ID is required,User: Name is required,User: Email is required');
    });
})