describe('TC09 - Search Product', () => {

    it('Deve buscar um produto e listar os resultados corretamente', () => {

        cy.visit('https://automationexercise.com/');

        cy.get('a[href="/products"]').click();
        cy.url().should('include', '/products');

        cy.get('#search_product').type('dress');
        cy.get('#submit_search').click();

        cy.get('h2.title.text-center')
            .should('contain.text', 'Searched Products');

        cy.get('.product-image-wrapper')
            .should('have.length.greaterThan', 0);

        // Verifica se pelo menos um item contém o texto pesquisado
        cy.get('.product-image-wrapper p').then(($texts) => {
            const found = Array.from($texts).some(el =>
                el.innerText.toLowerCase().includes('dress')
            );
            expect(found).to.be.true;
        });

    });

});
