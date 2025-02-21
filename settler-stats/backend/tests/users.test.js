import { expect, request, server } from './test-utils.js';

describe('User API Service', function () {

  
  let userId;
  it('should Post a single user', async () => { 
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

        const res = await request(server).post('/api/user').send(testUser);
        
        expect(res.status).to.be.eql(201); 
        expect(res.body.user.firstName).to.be.eql(expectedUser.firstName);
        expect(res.body.user.middleName).to.be.eql(expectedUser.middleName);
        expect(res.body.user.lastName).to.be.eql(expectedUser.lastName);
        expect(res.body.user.username).to.be.eql(expectedUser.username);
        expect(res.body.user).to.not.have.property('password');

        userId = res.body.user._id;
    });

  it('should GET a single user', async () => {
    const expectedUser = 
          {
            _id: userId,
            firstName: 'Abigail',
            middleName: 'Leslie',
            lastName: 'Frankfurt',
            birthdate: '05/23/1985',
            email: 'abigail.frankfurt@email.com',
            username: 'abfrankfurt'
          };

        const res = await request(server).get(`/api/user/${userId}`);

        expect(res.status).to.be.eql(200);
        expect(res.body.firstName).to.be.eql(expectedUser.firstName);
        expect(res.body.middleName).to.be.eql(expectedUser.middleName);
        expect(res.body.lastName).to.be.eql(expectedUser.lastName);
        expect(res.body.username).to.be.eql(expectedUser.username);
        expect(res.body).to.not.have.property('password');
  });

  
  it('should GET all users', async () => { 
    const res = await request(server).get('/api/user');

    expect(res.status).to.be.eql(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf.at.least(1); 
  });

    
  it('should Delete a single user', async () => { 

    let res = await request(server).delete(`/api/user/${userId}`);

    expect(res.status).to.be.eql(200);

    res = await request(server).get(`/api/user/${userId}`);
    expect(res.status).to.be.eql(404);
  });
});


