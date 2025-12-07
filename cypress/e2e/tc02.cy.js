describe('TC02 - Login User with correct email and password', () => {

    it('Deve fazer login com sucesso usando o mesmo cadastro do TC01', () => {

        // Lê o email e senha gerados pelo TC01
        cy.fixture('user').then((user) => {

            cy.visit('https://automationexercise.com/');

            // Ir para página de Login
            cy.get('a[href="/login"]').click();

            // Inserir email e senha salvos no arquivo user.json
            cy.get('input[data-qa="login-email"]').type(user.email);
            cy.get('input[data-qa="login-password"]').type(user.password);

            // Clicar no botão Login
            cy.get('button[data-qa="login-button"]').click();

            // Validação: deve aparecer "Logged in as <nome>"
            cy.get('a').contains('Logged in as').should('be.visible');
        });
    });

});
