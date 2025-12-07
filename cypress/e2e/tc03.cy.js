describe('TC03 - Login User with incorrect email and password', () => {

    it('Deve exibir erro ao tentar logar com credenciais inválidas', () => {

        // 1 e 2 - Acessar URL
        cy.visit('https://automationexercise.com/');

        // 3 - Verificar se a página inicial está visível
        cy.get('img[src="/static/images/home/logo.png"]', { timeout: 10000 })
            .should('be.visible');

        // 4 - Ir para a página de Login
        cy.get('a[href="/login"]').click();

        // 5 - Verificar se "Login to your account" está visível
        cy.contains('Login to your account').should('be.visible');

        // 6 - Inserir email e senha ERRADOS
        cy.get('input[data-qa="login-email"]').type('emailinvalido123@gmail.com');
        cy.get('input[data-qa="login-password"]').type('senhaerrada');

        // 7 - Clicar no botão Login
        cy.get('button[data-qa="login-button"]').click();

        // 8 - Validação: deve aparecer mensagem de erro
        cy.contains('Your email or password is incorrect!')
            .should('be.visible');

    });

});
