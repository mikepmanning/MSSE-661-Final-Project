import { expect, request, server } from './test-utils.js';


describe('Game API Service', function () {
    let testUsers = [];
    let token;

    before(async() => {
        const userData = [
            {
                firstName: 'Abigail',
                middleName: 'Leslie',
                lastName: 'Frankfurt',
                birthdate: '05/23/1985',
                email: 'abigail.frankfurt@email.com',
                username: 'abfrankfurt',
                password: "testPassword"
            },
            
            {
                firstName: 'Adam',
                middleName: 'Leslie',
                lastName: 'Frankfurt',
                birthdate: '05/23/1986',
                email: 'adam.frankfurt@email.com',
                username: 'adfrankfurt',
                password: "testPassword"
            },
            
            {
                firstName: 'Adalyn',
                middleName: 'Leslie',
                lastName: 'Frankfurt',
                birthdate: '05/23/1987',
                email: 'adalyn.frankfurt@email.com',
                username: 'adafrankfurt',
                password: "testPassword"
            },
            
            {
                firstName: 'Adnan',
                middleName: 'Leslie',
                lastName: 'Frankfurt',
                birthdate: '05/23/1988',
                email: 'adnan.frankfurt@email.com',
                username: 'adnfrankfurt',
                password: "testPassword"
            }
          ];

          for (const user of userData) {
                const res = await request(server).post('/api/user').send(user);
                testUsers.push(res.body.user);
            }

         const loginInfo = {
            username: 'adnfrankfurt',
            password: 'testPassword'
         }   
        //need to login as a user and save the token
        const res = await request(server).post('/api/auth/login').send(loginInfo);
        token = `Bearer ${res.headers['auth-token']}`;
    });

    after(async() => {
        for (const user of testUsers) {
            await request(server).delete(`/api/user/${user._id}`);
        }
        testUsers = [];
    });

  let gameId;
  it('should Post a single game', async () => { 
         
        const game = {
            start_date: '02/25/2025',
            users: testUsers
        }

        const expectedUser = 
        {
          firstName: 'Abigail',
          middleName: 'Leslie',
          lastName: 'Frankfurt',
          birthdate: '05/23/1985',
          email: 'abigail.frankfurt@email.com',
          username: 'abfrankfurt'
        };

        const res = await request(server).post('/api/game').set('Authorization', token).send(game);
        
        expect(res.status).to.be.eql(201); 
        expect(res.body.users[0].firstName).to.be.eql(expectedUser.firstName);
        expect(res.body.users[0].middleName).to.be.eql(expectedUser.middleName);
        expect(res.body.users[0].lastName).to.be.eql(expectedUser.lastName);
        expect(res.body.users[0].username).to.be.eql(expectedUser.username);
        expect(res.body.users[0]).to.not.have.property('password');

        gameId = res.body._id;
    });

  it('should GET a single game', async () => {
    const expectedUser = 
          {
            firstName: 'Abigail',
            middleName: 'Leslie',
            lastName: 'Frankfurt',
            birthdate: '05/23/1985',
            email: 'abigail.frankfurt@email.com',
            username: 'abfrankfurt'
          };

        const res = await request(server).get(`/api/game/${gameId}`).set('Authorization', token);
          
        expect(res.status).to.be.eql(200);
        expect(res.body.users[0].firstName).to.be.eql(expectedUser.firstName);
        expect(res.body.users[0].middleName).to.be.eql(expectedUser.middleName);
        expect(res.body.users[0].lastName).to.be.eql(expectedUser.lastName);
        expect(res.body.users[0].username).to.be.eql(expectedUser.username);
        expect(res.body.users[0]).to.not.have.property('password');
  });

  
  it('should GET all games', async () => { 
    const res = await request(server).get('/api/game').set('Authorization', token);

    expect(res.status).to.be.eql(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf.at.least(1); 
  });

    
  it('should Delete a single game', async () => { 

    let res = await request(server).delete(`/api/game/${gameId}`).set('Authorization', token);

    expect(res.status).to.be.eql(204);

    res = await request(server).get(`/api/game/${gameId}`).set('Authorization', token);
    expect(res.status).to.be.eql(404);
  });
});


