import chai from 'chai';
import chaiHttp from 'chai-http';
import * as constant from "../env";
import * as requestLogin from "../requests/requestLogin";
import * as functionValidId from "../functions/functionValidId";
import * as requestCreateProduct from "../requests/requestCreateProduct";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request(constant.ENDPOINT_SHOP);

describe('Realizar busca de pedido por id', () => {

    var productId;
    var userToken;

    before((done) => {
        context('quando realizo o login corretamente', () => {

            request
                .post(constant.SHOP + constant.VALUE_ENDPOINT_LOGIN)
                .send(requestLogin.bodyRequestLogin("leo.padilha", "123456"))
                .end((err, res) => {
                    expect(res).to.has.status(200);
                    userToken = res.body.data.token;
                    expect(res.body.message).to.equals("Sucesso ao realizar o login");
                    done();
                })
        })
    })

    it('cadastro um produto', (done) => {
        request
            .post(constant.SHOP + constant.URL_PRODUCT)
            .set(constant.TOKEN, userToken)
            .send(requestCreateProduct.bodyRequestCreateProduct("PS6", 356.99, "branco", "Controles", 2))
            .end((err, res) => {
                expect(res).to.has.status(201);
                expect(res.body.message).to.equals("Produto adicionado com sucesso");
                productId = res.body.data.produtoid;
                expect(res.body.data.produtoid).to.not.equals(functionValidId.validId(productId));
                done();
            })
    })

    it('o pedido com o id selecionado deve ser exibido corretamente', (done) => {
        request
            .get(constant.SHOP + constant.URL_PRODUCT + '/' + productId)
            .set(constant.TOKEN, userToken)
            .end((err, res) => {
                expect(res).to.has.status(200);
                expect(res.body.data.produtoid).to.not.equals(functionValidId.validId(productId));
                expect(res.body.data.produtoid).to.equals(productId);
                done();
            })
    })
})