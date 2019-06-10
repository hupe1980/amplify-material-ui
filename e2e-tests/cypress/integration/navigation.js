describe('navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it(`displays content`, () => {
        cy.get('[data-testid=signInForm]').should('be.visible');
    });
});
