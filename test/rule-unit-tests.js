'use strict';

var Code = require('code');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var experiment = lab.experiment;
var test = lab.test;

var expect = Code.expect;

var Rbac = require('../');


experiment('Rule unit tests (permit)', () => {

    var rule = {
        target: ['all-of', { type: 'group', value: 'administrator' }, { type: 'group', value: 'publisher' }],
        effect: 'permit'
    };

    test('should permit publisher administrator', (done) => {

        var information = {
            username: 'user00001',
            group: ['administrator', 'publisher']
        };

        Rbac.evaluatePolicy(rule, information, (err, result) => {

            expect(err).to.not.exist();

            expect(result).to.exist().and.to.equal(Rbac.PERMIT);

            done();
        });
    });

    test('should be undetermined access to publisher', (done) => {

        var information = {
            username: 'user00002',
            group: ['publisher']
        };

        Rbac.evaluatePolicy(rule, information, (err, result) => {

            expect(err).to.not.exist();

            expect(result).to.exist().and.to.equal(Rbac.UNDETERMINED);

            done();
        });
    });

    test('should be undetermined access to administrator', (done) => {

        var information = {
            username: 'user00003',
            group: ['administrator']
        };

        Rbac.evaluatePolicy(rule, information, (err, result) => {

            expect(err).to.not.exist();

            expect(result).to.exist().and.to.equal(Rbac.UNDETERMINED);

            done();
        });
    });

});

experiment('Rule unit tests (deny)', () => {

    var rule = {
        target: ['any-of', { type: 'group', value: 'blacklist' }, { type: 'group', value: 'anonymous' }, {
            type: 'verified',
            value: false
        }],
        effect: 'deny'
    };

    test('should deny user in blacklist group', (done) => {

        var information = {
            username: 'user00001',
            group: ['blacklist', 'publisher'],
            verified: true
        };

        Rbac.evaluatePolicy(rule, information, (err, result) => {

            expect(err).to.not.exist();

            expect(result).to.exist().and.to.equal(Rbac.DENY);

            done();
        });
    });

    test('should deny user in anonymous group', (done) => {

        var information = {
            username: 'user00001',
            group: ['anonymous'],
            verified: true
        };

        Rbac.evaluatePolicy(rule, information, (err, result) => {

            expect(err).to.not.exist();

            expect(result).to.exist().and.to.equal(Rbac.DENY);

            done();
        });
    });

    test('should deny not verified user', (done) => {

        var information = {
            username: 'user00001',
            group: ['administrator', 'publisher'],
            verified: false
        };

        Rbac.evaluatePolicy(rule, information, (err, result) => {

            expect(err).to.not.exist();

            expect(result).to.exist().and.to.equal(Rbac.DENY);

            done();
        });
    });

    test('should be undetermined', (done) => {

        var information = {
            username: 'user00001',
            group: ['administrator', 'publisher'],
            verified: true
        };

        Rbac.evaluatePolicy(rule, information, (err, result) => {

            expect(err).to.not.exist();

            expect(result).to.exist().and.to.equal(Rbac.UNDETERMINED);

            done();
        });
    });

});
