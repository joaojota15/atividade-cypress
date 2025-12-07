describe('TC05 - Register User with existing email', () => {

    it('Deve exibir erro ao tentar cadastrar um email já existente', () => {

        // Carrega o email criado no TC01
        cy.fixture('user').then((user) => {

            cy.visit('https://automationexercise.com/');

            // Ir para página de Login/Signup
            cy.get('a[href="/login"]').click();

            // Tentar se cadastrar novamente com o mesmo email
            cy.get('input[data-qa="signup-name"]').type('Teste Existente');
            cy.get('input[data-qa="signup-email"]').type(user.email);

            cy.get('button[data-qa="signup-button"]').click();

            // Validação: mensagem deve aparecer
            cy.get('p')
                .should('contain.text', 'Email Address already exist!')
                .and('be.visible');

        });

    });

});
