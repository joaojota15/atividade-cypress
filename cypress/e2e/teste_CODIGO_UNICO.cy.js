import { faker } from '@faker-js/faker';

describe('Automation Exercise Tests', () => {

  // TC01 - Cadastro Completo
  describe('TC01 - Cadastro Completo de Usuário', () => {
    it('Deve cadastrar usuário e salvar credenciais', () => {
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

      cy.writeFile('cypress/fixtures/user.json', { email, password });
    });
  });

  // TC02 - Login com credenciais corretas
  describe('TC02 - Login User with correct email and password', () => {
    it('Deve fazer login com sucesso usando o mesmo cadastro do TC01', () => {
      cy.fixture('user').then((user) => {
        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();
        cy.get('input[data-qa="login-email"]').type(user.email);
        cy.get('input[data-qa="login-password"]').type(user.password);
        cy.get('button[data-qa="login-button"]').click();
        cy.get('a').contains('Logged in as').should('be.visible');
      });
    });
  });

  // TC03 - Login com credenciais inválidas
  describe('TC03 - Login User with incorrect email and password', () => {
    it('Deve exibir erro ao tentar logar com credenciais inválidas', () => {
      cy.visit('https://automationexercise.com/');
      cy.get('img[src="/static/images/home/logo.png"]', { timeout: 10000 }).should('be.visible');
      cy.get('a[href="/login"]').click();
      cy.contains('Login to your account').should('be.visible');
      cy.get('input[data-qa="login-email"]').type('emailinvalido123@gmail.com');
      cy.get('input[data-qa="login-password"]').type('senhaerrada');
      cy.get('button[data-qa="login-button"]').click();
      cy.contains('Your email or password is incorrect!').should('be.visible');
    });
  });

  // TC04 - Logout
  describe('TC04 - Logout User', () => {
    it('Deve logar e fazer logout com sucesso', () => {
      cy.fixture('user').then((user) => {
        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();
        cy.get('input[data-qa="login-email"]').type(user.email);
        cy.get('input[data-qa="login-password"]').type(user.password);
        cy.get('button[data-qa="login-button"]').click();
        cy.contains('Logged in as').should('be.visible');
        cy.get('a[href="/logout"]').click();
        cy.url().should('include', '/login');
        cy.get('h2').contains('Login to your account').should('be.visible');
      });
    });
  });

  // TC05 - Cadastro com email existente
  describe('TC05 - Register User with existing email', () => {
    it('Deve exibir erro ao tentar cadastrar um email já existente', () => {
      cy.fixture('user').then((user) => {
        cy.visit('https://automationexercise.com/');
        cy.get('a[href="/login"]').click();
        cy.get('input[data-qa="signup-name"]').type('Teste Existente');
        cy.get('input[data-qa="signup-email"]').type(user.email);
        cy.get('button[data-qa="signup-button"]').click();
        cy.get('p').should('contain.text', 'Email Address already exist!').and('be.visible');
      });
    });
  });

  // TC06 - Formulário de contato
  describe('TC06 - Contact Us Form', () => {
    beforeEach(() => {
      Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('Google Maps API is required')) return false;
      });
    });
    it('Deve enviar o formulário de contato com sucesso', () => {
      cy.visit('https://automationexercise.com/');
      cy.get('a[href="/contact_us"]').click();
      const nomeFalso = faker.person.firstName();
      const emailFalso = faker.internet.email();
      const mensagemFalsa = faker.lorem.paragraph();
      cy.get('input[data-qa="name"]').type(nomeFalso);
      cy.get('input[data-qa="email"]').type(emailFalso);
      cy.get('input[data-qa="subject"]').type('Dúvida sobre o sistema');
      cy.get('textarea[data-qa="message"]').type(mensagemFalsa);
      cy.get('input[name="upload_file"]').selectFile('cypress/fixtures/example.json');
      cy.get('input[data-qa="submit-button"]').click();
      cy.get('.status').should('be.visible').and('contain.text', 'Success! Your details have been submitted successfully.');
      cy.contains('a', 'Home').click();
      cy.url().should('eq', 'https://automationexercise.com/');
    });
  });

  // TC08 - Produtos
  describe('TC08 - Verify All Products and Product Detail Page', () => {
    beforeEach(() => {
      Cypress.on('uncaught:exception', () => false);
    });
    it('Deve listar todos os produtos e abrir detalhe de um produto', () => {
      cy.visit('https://automationexercise.com/');
      cy.get('a[href="/products"]').click();
      cy.url().should('include', '/products');
      cy.get('.features_items').should('be.visible');
      cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);
      cy.get('.product-image-wrapper').first().contains('View Product').click();
      cy.url().should('include', '/product_details');
      cy.get('.product-information').within(() => {
        cy.get('h2').should('be.visible');
        cy.contains('Category').should('be.visible');
        cy.contains('Rs.').should('be.visible');
        cy.contains('Availability').should('be.visible');
        cy.contains('Condition').should('be.visible');
        cy.contains('Brand').should('be.visible');
      });
    });
  });

  // TC09 - Busca de produto
  describe('TC09 - Search Product', () => {
    it('Deve buscar um produto e listar os resultados corretamente', () => {
      cy.visit('https://automationexercise.com/');
      cy.get('a[href="/products"]').click();
      cy.url().should('include', '/products');
      cy.get('#search_product').type('dress');
      cy.get('#submit_search').click();
      cy.get('h2.title.text-center').should('contain.text', 'Searched Products');
      cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);
      cy.get('.product-image-wrapper p').then(($texts) => {
        const found = Array.from($texts).some(el => el.innerText.toLowerCase().includes('dress'));
        expect(found).to.be.true;
      });
    });
  });

  // TC10 - Newsletter
  describe('TC10 - Newsletter Subscription', () => {
    it('Deve assinar a newsletter com sucesso', () => {
      cy.visit('https://automationexercise.com/');
      cy.get('img[src="/static/images/home/logo.png"]', { timeout: 10000 }).should('be.visible');
      cy.get('footer').scrollIntoView();
      cy.contains('Subscription').should('be.visible');
      const emailFalso = faker.internet.email();
      cy.get('#susbscribe_email').type(emailFalso);
      cy.get('#subscribe').click();
      cy.get('#success-subscribe').should('be.visible').and('contain.text', 'You have been successfully subscribed!');
    });
  });

  // TC15 - Compra completa e exclusão
  describe('TC15 - Complete purchase with registration and account deletion', () => {
    it('Should register, make a purchase, and delete the account successfully', () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const password = "12345";

      cy.visit('http://automationexercise.com');
      cy.get('body').should('be.visible');
      cy.contains('Signup / Login', { timeout: 10000 }).click();
      cy.get('input[data-qa="signup-name"]').type(firstName);
      cy.get('input[data-qa="signup-email"]').type(email);
      cy.get('button[data-qa="signup-button"]').click();
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
      cy.get('a[data-qa="continue-button"]', { timeout: 10000 }).should('be.visible').click();
      cy.get('.shop-menu').contains(firstName).should('be.visible');
      cy.get('.product-image-wrapper').first().trigger('mouseover');
      cy.contains('Add to cart').click();
      cy.contains('Continue Shopping').click();
      cy.get('a[href="/view_cart"]').first().click({ force: true });
      cy.url().should('include', '/view_cart');
      cy.contains('Proceed To Checkout').click();
      cy.get('.checkout-information').should('be.visible');
      cy.get('textarea[name="message"]').type('Please deliver quickly!');
      cy.contains('Place Order').click();
      cy.get('input[name="name_on_card"]').type('Joao Paulo');
      cy.get('input[name="card_number"]').type('4111111111111111');
      cy.get('input[name="cvc"]').type('123');
      cy.get('input[name="expiry_month"]').type('12');
      cy.get('input[name="expiry_year"]').type('2027');
      cy.contains('Pay and Confirm Order').click();
      cy.contains('Order Placed!', { timeout: 20000 }).should('be.visible');
      cy.contains('Congratulations! Your order has been confirmed!', { timeout: 20000 }).should('be.visible');
      cy.visit('http://automationexercise.com');
      cy.get('a').contains('Delete Account').click();
      cy.get('a[data-qa="continue-button"]', { timeout: 10000 }).should('be.visible').click();
    });
  });

});
