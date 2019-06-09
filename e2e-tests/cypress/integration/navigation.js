describe('navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it(`displays content`, () => {
        cy.get('[data-test=signInForm]').should('be.visible');
    });
});
