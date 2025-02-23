import {expect, use} from 'chai';  
import chaiHttp from 'chai-http';
import * as dotenv from 'dotenv';
dotenv.config();

const chai = use(chaiHttp);
const request = chai.request.execute;

const server = process.env.TEST_SERVER;

export {expect, request, server};