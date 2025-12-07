import { faker } from '@faker-js/faker';

describe('TC10 - Newsletter Subscription', () => {

    it('Deve assinar a newsletter com sucesso', () => {

        cy.visit('https://automationexercise.com/');

        // Verifica se a Home está visível
        cy.get('img[src="/static/images/home/logo.png"]', { timeout: 10000 })
          .should('be.visible');

        // Rola até o rodapé
        cy.get('footer').scrollIntoView();

        // Verifica se o texto 'SUBSCRIPTION' está visível
        cy.contains('Subscription').should('be.visible');

        // Insere e-mail e envia
        const emailFalso = faker.internet.email();
        cy.get('#susbscribe_email').type(emailFalso);
        cy.get('#subscribe').click();

        // Verifica mensagem de sucesso
        cy.get('#success-subscribe')
          .should('be.visible')
          .and('contain.text', 'You have been successfully subscribed!');

    });

});
