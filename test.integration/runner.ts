import assert from 'assert';
import { Container } from 'typedi';
import request from 'supertest';

import { SnsApp } from '../src/app';


describe('integration test', () => {
    it('init supertest', () => {
        const snsApp = Container.get(SnsApp);

        request(snsApp.app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('expect unauthorized error against private page', () => {
        const snsApp = Container.get(SnsApp);

        request(snsApp.app)
        .get('/hideout')
        .expect(401);
    });

    //auth

    //relate peers

    //timeline
});