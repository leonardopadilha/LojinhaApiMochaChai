import chai from 'chai';
import chaiHttp from 'chai-http';
import * as constant from "../env";
import * as requestLogin from "../requests/requestLogin";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request(constant.ENDPOINT_SHOP);

describe('Realizar login do usuário', () => {
    context('quando informo os dados corretos do usuário', () => {
        it('o login deve ser cadastrado com sucesso', (done) => {
            request
                .post(constant.SHOP + constant.VALUE_ENDPOINT_LOGIN)
                .send(requestLogin.bodyRequestLogin("leo.padilha", "123456"))
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.message).to.equals("Sucesso ao realizar o login");
                    expect(res.body).to.not.be.an("array");
                    done();
                })
        })
    })

    context('quando informo o usuário inválido com a senha válida', () => {
        it('o login não é realizado com sucesso', (done) => {
            request
                .post(constant.SHOP + constant.VALUE_ENDPOINT_LOGIN)
                .send(requestLogin.bodyRequestLogin("nome.qualquer", "123456"))
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res).to.not.property(res.body);
                    expect(1).to.equals(1);
                    done();
                })
        })
    })

    context('quando informo o usuário válido com a senha inválida', () => {
        it('o login não é realizado com sucesso', (done) => {
            request
                .post(constant.SHOP + constant.VALUE_ENDPOINT_LOGIN)
                .send(requestLogin.bodyRequestLogin("leo.padilha", "123457"))
                .end((err, res) => {
                    expect(res).to.has.status(404);
                    expect(res).to.not.property(res.body);
                    expect(1).to.equals(1);
                    done();
                })
        })
    })
})