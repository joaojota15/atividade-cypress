import { faker } from '@faker-js/faker';

describe('TC15 - Complete purchase with registration and account deletion', () => {
    it('Should register, make a purchase, and delete the account successfully', () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const password = "12345";

        // 1-2: Acessar site
        cy.visit('http://automationexercise.com');
        cy.get('body').should('be.visible');

        // 3-4: Clicar em 'Signup / Login'
        cy.contains('Signup / Login', { timeout: 10000 }).click();

        // 5: Preencher cadastro
        cy.get('input[data-qa="signup-name"]').type(firstName);
        cy.get('input[data-qa="signup-email"]').type(email);
        cy.get('button[data-qa="signup-button"]').click();

        // Preencher detalhes da conta
        cy.get('#id_gender1').check();
        cy.get('#password').type(password);
        cy.get('#days').select('10');
        cy.get('#months').select('May');
        cy.get('#years').select('2000');
        cy.get('#first_name').type(firstName);
        cy.get('#last_name').type(lastName);
        cy.get('#address1').type('123 Example Street');
        cy.get('#city').type('Caruaru');
        cy.get('#state').type('Pernambuco');
        cy.get('#country').select('Canada');
        cy.get('#zipcode').type('55000-000');
        cy.get('#mobile_number').type('81999999999');
        cy.get('button[data-qa="create-account"]').click();

        // 6: Verificar account criada e continuar
        cy.get('a[data-qa="continue-button"]', { timeout: 10000 }).should('be.visible').click();

        // 7: Verificar login
        cy.get('.shop-menu').contains(firstName).should('be.visible');

        // 8: Adicionar produto ao carrinho
        cy.get('.product-image-wrapper').first().trigger('mouseover');
        cy.contains('Add to cart').click();
        cy.contains('Continue Shopping').click(); 

        // 9-10: Ir para o carrinho
        cy.get('a[href="/view_cart"]').first().click({ force: true });
        cy.url().should('include', '/view_cart');

        // 11-12: Checkout
        cy.contains('Proceed To Checkout').click();
        cy.get('.checkout-information').should('be.visible');

        // 13: Comentário e fazer pedido
        cy.get('textarea[name="message"]').type('Please deliver quickly!');
        cy.contains('Place Order').click();

        // 14: Dados do cartão
        cy.get('input[name="name_on_card"]').type('Joao Paulo');
        cy.get('input[name="card_number"]').type('4111111111111111');
        cy.get('input[name="cvc"]').type('123');
        cy.get('input[name="expiry_month"]').type('12');
        cy.get('input[name="expiry_year"]').type('2027');

        // 15-16: Pagar e verificar sucesso
        cy.contains('Pay and Confirm Order').click();
        cy.contains('Order Placed!', { timeout: 20000 }).should('be.visible');
        cy.contains('Congratulations! Your order has been confirmed!', { timeout: 20000 }).should('be.visible');

        // 17-18: Voltar à home para Delete Account
        cy.visit('http://automationexercise.com');
        cy.get('a').contains('Delete Account').click();
        cy.get('a[data-qa="continue-button"]', { timeout: 10000 }).should('be.visible').click();
    });
});
