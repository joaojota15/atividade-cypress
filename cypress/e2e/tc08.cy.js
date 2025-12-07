describe('TC08 - Verify All Products and Product Detail Page', () => {

    beforeEach(() => {
        Cypress.on('uncaught:exception', () => {
            return false; // ignorar erros da página
        });
    });

    it('Deve listar todos os produtos e abrir detalhe de um produto', () => {

        cy.visit('https://automationexercise.com/');

        // Clicar no menu Products
        cy.get('a[href="/products"]').click();

        // Verificar se está na página de produtos
        cy.url().should('include', '/products');
        cy.get('.features_items').should('be.visible');

        // Validar que há produtos listados
        cy.get('.product-image-wrapper')
            .should('have.length.greaterThan', 0);

        // Clicar no primeiro produto (View Product)
        cy.get('.product-image-wrapper')
            .first()
            .contains('View Product')
            .click();

        // Agora está na página de detalhes

        // Validar URL
        cy.url().should('include', '/product_details');

        // Validar elementos do produto
        cy.get('.product-information').within(() => {
            cy.get('h2').should('be.visible');                     // Nome do produto
            cy.contains('Category').should('be.visible');          // Categoria
            cy.contains('Rs.').should('be.visible');               // Preço
            cy.contains('Availability').should('be.visible');      // Disponibilidade
            cy.contains('Condition').should('be.visible');         // Condição
            cy.contains('Brand').should('be.visible');             // Marca
        });

    });

});
