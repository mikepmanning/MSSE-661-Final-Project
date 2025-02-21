import {expect, use} from 'chai';  
import chaiHttp from 'chai-http';
require('dotenv').config();
console.log(process.env.TEST_SERVER);

const chai = use(chaiHttp);
const request = chai.request.execute;

const server = process.env.TEST_SERVER;

export {expect, request, server};