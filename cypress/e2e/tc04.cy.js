describe('TC04 - Logout User', () => {

    it('Deve logar e fazer logout com sucesso', () => {

        // Carrega email e senha salvos no TC01
        cy.fixture('user').then((user) => {

            cy.visit('https://automationexercise.com/');

            // Ir para a página de Login
            cy.get('a[href="/login"]').click();

            // Preencher login com os dados do TC01
            cy.get('input[data-qa="login-email"]').type(user.email);
            cy.get('input[data-qa="login-password"]').type(user.password);

            cy.get('button[data-qa="login-button"]').click();

            // Verificar se logou (sem depender do nome)
            cy.contains('Logged in as').should('be.visible');

            // Fazer logout
            cy.get('a[href="/logout"]').click();

            // Verificar se voltou para a página de login
            cy.url().should('include', '/login');
            cy.get('h2').contains('Login to your account').should('be.visible');

        });

    });

});
