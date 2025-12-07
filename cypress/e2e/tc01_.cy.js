import { faker } from '@faker-js/faker';

describe('Automation Exercise - TC01 Completo', () => {

   it('TC01: Cadastro Completo de Usuário', () => {

        const nome = faker.person.firstName();
        const sobrenome = faker.person.lastName();
        const email = faker.internet.email({ firstName: nome, lastName: sobrenome });
        const password = "12345";

        cy.visit('https://automationexercise.com/');
        cy.get('img[src="/static/images/home/logo.png"]', { timeout: 10000 }).should('be.visible');
        cy.get('a[href="/login"]').click();
        cy.contains('New User Signup!').should('be.visible');

        cy.get('input[data-qa="signup-name"]').type(nome);
        cy.get('input[data-qa="signup-email"]').type(email);
        cy.get('button[data-qa="signup-button"]').click();

        cy.contains('Enter Account Information').should('be.visible');

        cy.get('#id_gender2').check();
        cy.get('#password').type(password);
        cy.get('#days').select('10');
        cy.get('#months').select('May');
        cy.get('#years').select('2006');

        cy.get('#newsletter').check();
        cy.get('#optin').check();

        cy.get('input[data-qa="first_name"]').type(nome);
        cy.get('input[data-qa="last_name"]').type(sobrenome);
        cy.get('input[data-qa="company"]').type(faker.company.name());
        cy.get('input[data-qa="address"]').type(faker.location.streetAddress());
        cy.get('input[data-qa="address2"]').type('Casa 02');
        cy.get('select[data-qa="country"]').select('Canada');
        cy.get('input[data-qa="state"]').type('Pernambuco');
        cy.get('input[data-qa="city"]').type('Caruaru');
        cy.get('input[data-qa="zipcode"]').type(faker.location.zipCode());
        cy.get('input[data-qa="mobile_number"]').type(faker.phone.number());

        cy.get('button[data-qa="create-account"]').click();

        cy.contains('Account Created!').should('be.visible');

        cy.get('[data-qa="continue-button"]').click();

        cy.contains(`Logged in as ${nome}`).should('be.visible');

        cy.writeFile('cypress/fixtures/user.json', {
            email: email,
            password: password
        });
        // TIREI PARTE DE EXCLUIR CONTA PARA QUE PUDESSE USAR NO TESTE DE CASO 2 A MESMA CONTA
   });
});
