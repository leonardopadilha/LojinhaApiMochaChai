import chai from "chai";
import chaiHttp from "chai-http";
import * as constant from "../env";
import * as functionValidId from "../functions/functionValidId"; 
import * as requestCreateProduct from "../requests/requestCreateProduct";
import * as requestLogin from "../requests/requestLogin";

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request(constant.ENDPOINT_SHOP);

describe('Realizar cadastro de produto', () => {

    var productId;
    var userToken;

    before((done) => {
        context('quando informo o producto corretamente', () => {

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


    it('o produto é cadastrado com sucesso', (done) => {
        request
            .post(constant.SHOP + constant.URL_PRODUCT)
            .set(constant.TOKEN, userToken)
            .send(requestCreateProduct.bodyRequestCreateProduct("PS5", 200.00, "preto", "Controles", 2))
            .end((err, res) => {
                expect(res).to.status(201)
                productId = res.body.data.produtoid;
                expect(res.body.data.produtoid).to.not.equals(functionValidId.validId(productId));
                expect(res.body.message).to.equals("Produto adicionado com sucesso");
                expect(res.body.data.produtonome).to.equals('PS5');
                expect(res.body.data.produtonome).to.be.an('string');
                expect(res.body.error).to.equals("");
                done();
            })
    })
})

    