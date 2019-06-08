describe('navigation', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it(`displays content`, () => {
        cy.get('[data-test=firstTest]')
            .invoke('text')
            .should('equal', 'Test');
    });
});
