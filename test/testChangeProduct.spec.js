import chai from "chai";
import chaiHttp from "chai-http";
import * as constant from "../env";
import * as functionValidId from "../functions/functionValidId"; 
import * as requestCreateProduct from "../requests/requestCreateProduct";
import * as requestLogin from "../requests/requestLogin";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request(constant.ENDPOINT_SHOP);


describe('Alterar pedido', () => {
    var userToken;
    var productId;

    before((done) => {
        context('quando informo o id de um pedido existente', () => {
            request
                .post(constant.SHOP + constant.VALUE_ENDPOINT_LOGIN)
                .send(requestLogin.bodyRequestLogin("leo.padilha", "123456"))
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    expect(res.body.message).to.equals("Sucesso ao realizar o login");
                    userToken = res.body.data.token;
                    done();
                })
        })
    })

    it('cadastrar o pedido com sucesso', (done) => {
        request
            .post(constant.SHOP + constant.URL_PRODUCT)
            .set(constant.TOKEN, userToken)
            .send(requestCreateProduct.bodyRequestCreateProduct("Monitor de Vídeo", 500.99, "azul", "Controle", 1))
            .end((err, res) => {
                expect(res).to.has.status(201)
                expect(res.body.message).to.equals("Produto adicionado com sucesso");
                productId = res.body.data.produtoid;
                expect(res.body.data.produtoid).to.not.equals(functionValidId.validId(productId));
                done();
            })
    })

    it('busco pelo produto cadastrado', (done) => {
        request
            .get(constant.SHOP + constant.URL_PRODUCT + '/' + productId)
            .set(constant.TOKEN, userToken)
            .end((err, res) => {
                expect(res).to.has.status(200)
                expect(res.body.data.produtoid).to.equals(productId)
                expect(res.body.data.produtocores[0]).to.contains('azul')
                done();
            })
    })

    it('e altero a descrição desejada', (done) => {
        request
            .put(constant.SHOP + constant.URL_PRODUCT + '/' + productId)
            .set(constant.TOKEN, userToken)
            .send(requestCreateProduct.bodyRequestCreateProduct("Monitor de Vídeo", 500.99, "preto", "Controle", 1))
            .end((err, res) => {
                expect(res).to.has.status(200);
                expect(res.body.message).to.contains('alterado com sucesso');
                done();
            })
    })

    it('então confirmo que a alteração foi realizada com sucesso', (done) => {
        request
            .get(constant.SHOP + constant.URL_PRODUCT + '/' + productId)
            .set(constant.TOKEN, userToken)
            .end((err, res) => {
                expect(res).to.has.status(200)
                expect(res.body.data.produtoid).to.equals(productId)
                expect(res.body.data.produtocores[0]).to.contains('preto')
                done();
            })
    })
})
