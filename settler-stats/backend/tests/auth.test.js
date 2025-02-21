import { expect, request, server } from './test-utils.js';

describe("Auth API Service", function() {
    let userId;
    it('should POST a new user', async () => {
        const testUser = {
            firstName: 'Abigail',
            middleName: 'Leslie',
            lastName: 'Frankfurt',
            birthdate: '05/23/1985',
            email: 'abigail.frankfurt@email.com',
            username: 'abfrankfurt',
            password: 'sillyPassword'
        }

        const expectedUser = {
            firstName: 'Abigail',
            middleName: 'Leslie',
            lastName: 'Frankfurt',
            birthdate: '05/23/1985',
            email: 'abigail.frankfurt@email.com',
            username: 'abfrankfurt'
        }

        const res = await request(server).post('/api/auth/register').send(testUser);
        
        expect(res.status).to.be.eql(201); 
        expect(res.body.user.firstName).to.be.eql(expectedUser.firstName);
        expect(res.body.user.middleName).to.be.eql(expectedUser.middleName);
        expect(res.body.user.lastName).to.be.eql(expectedUser.lastName);
        expect(res.body.user.username).to.be.eql(expectedUser.username);
        expect(res.body.user).to.not.have.property('password');

        userId = res.body.user._id;
    });

    it('should fail to POST a new user because of same username', async () => {
        const testUser = {
            firstName: 'Adam',
            middleName: 'Truance',
            lastName: 'Frankfurt',
            birthdate: '05/25/1987',
            email: 'adam.frankfurt@email.com',
            username: 'abfrankfurt',
            password: 'sillyPassword'
        }

        
        const res = await request(server).post('/api/auth/register').send(testUser);
        expect(res.status).to.be.eql(409);
    });
    

    it('should fail to POST a new user because of no firstname', async () => {
        const testUser = {
            middleName: 'Truance',
            lastName: 'Frankfurt',
            birthdate: '05/25/1987',
            email: 'adam.frankfurt@email.com',
            username: 'atfrankfurt',
            password: 'sillyPassword'
        }

        
        const res = await request(server).post('/api/auth/register').send(testUser);
        expect(res.status).to.be.eql(400);
    });

    it('should Delete a single user', async () => { 
        let res = await request(server).delete(`/api/user/${userId}`);
        expect(res.status).to.be.eql(200);
    
        res = await request(server).get(`/api/user/${userId}`);
        expect(res.status).to.be.eql(404);
    });


});