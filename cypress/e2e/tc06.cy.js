import { faker } from '@faker-js/faker';

describe('TC06 - Contact Us Form', () => {

    beforeEach(() => {
        Cypress.on('uncaught:exception', (err) => {
            if (err.message.includes('Google Maps API is required')) {
                return false; // ignora erro do Google Maps
            }
        });
    });

    it('Deve enviar o formulário de contato com sucesso', () => {

        cy.visit('https://automationexercise.com/');

        cy.get('a[href="/contact_us"]').click();

        // Gerando dados aleatórios
        const nomeFalso = faker.person.firstName();
        const emailFalso = faker.internet.email();
        const mensagemFalsa = faker.lorem.paragraph();

        // Preenche o formulário
        cy.get('input[data-qa="name"]').type(nomeFalso);
        cy.get('input[data-qa="email"]').type(emailFalso);
        cy.get('input[data-qa="subject"]').type('Dúvida sobre o sistema');
        cy.get('textarea[data-qa="message"]').type(mensagemFalsa);

        // Upload obrigatório
        cy.get('input[name="upload_file"]').selectFile('cypress/fixtures/example.json');

        // Envia
        cy.get('input[data-qa="submit-button"]').click();

        // Valida mensagem de sucesso
        cy.get('.status')
            .should('be.visible')
            .and('contain.text', 'Success! Your details have been submitted successfully.');

        // Voltar ao Home
        cy.contains('a', 'Home').click();  // <-- Clica no link certo

        cy.url().should('eq', 'https://automationexercise.com/');
    });

});
