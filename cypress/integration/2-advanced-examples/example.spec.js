/// <reference types="cypress" />

context('Network Requests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9004', { failOnStatusCode: false });
    localStorage.removeItem('rid');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    // cy.request({
    //   method: 'POST',
    //   url: 'http://172.27.228.236:8001/user/sso_verify',
    //   body: {
    //     code: '',
    //     redirect_uri: 'http://localhost:9004/mainpage',
    //     session_state: '',
    //     state: '',
    //   },
    // }).then((resp) => {
    //   localStorage.setItem('rid', resp.body.refresh_token);
    //   localStorage.setItem('access_token', resp.body.access_token);
    //   localStorage.setItem('userId', resp.body.user_id);
    // });
    //cy.visit('https://google.com')
  });

  // Manage HTTP requests in your app

  // it('test login', () => {
  //   // https://on.cypress.io/request
  //   // We use the `cy.get()` command to get all elements that match the selector.
  //   // Then, we use `should` to assert that there are two matched items,
  //   // which are the two default items.
  //   // cy.get('body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input')
  //   // .type('abc')
  //   // cy.get('#root > div > section > aside > div > div:nth-child(2) > ul > li:nth-child(3)').click()
  //   // cy.get('li.ant-menu-item.ant-menu-item-only-child:nth-child(4)').click()
  //   // cy.get('#root > div > div.content___3Paa8 > div > div > div > div.ant-row.body___30_g7 > div:nth-child(2) > form > button').click()
  //   // cy.intercept('/login').as('login')
  //   // cy.wait('@login').then((xhr) => {
  //   //   assert.isNotNull(xhr.response.body.data, 'api call successfull')
  //   // })
  //   // cy.get('#user').type('admin').should('have.value', 'admin');
  //   // cy.get('#password').type('Abcd1234').should('have.value', 'Abcd1234');
  // });

  it('test voicebot', () => {
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      console.log({ err });
      return false;
    });
    cy.visit('http://localhost:9004/mainpage', {
      failOnStatusCode: false,
    });
    cy.get('#email').type('uytkg@fpt.com.vn');
    cy.get('.ant-btn').click();

    cy.get('body').then(($body) => {
      if ($body.contents('.login-pf-page').length !== 0) {
        cy.get('#username').type('uytkg@fpt.com.vn');
        cy.get('#password').type('1');
        cy.get('#kc-login').click();
      }
    });
    // test user management

    cy.get(':nth-child(3) > .ant-menu-submenu-title').click();
    cy.get('a').contains('Danh sách người dùng').click({ force: true });

    //đổi trang
    cy.contains('trang').click();
    cy.contains('5 / trang').click();

    //filter
    cy.get('.ant-select-selector').click({ multiple: true, force: true });
    cy.get(
      ':nth-child(4) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > .rc-virtual-list > .rc-virtual-list-holder > :nth-child(1) > .rc-virtual-list-holder-inner > :nth-child(1) > .ant-select-item-option-content',
    ).click('left', { multiple: true });

    cy.get(
      '[data-inspector-line="122"] > .rc-virtual-list > .rc-virtual-list-holder > :nth-child(1) > .rc-virtual-list-holder-inner > :nth-child(4) > .ant-select-item-option-content',
    ).click('left');

    cy.get(
      ':nth-child(5) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > .rc-virtual-list > .rc-virtual-list-holder > :nth-child(1) > .rc-virtual-list-holder-inner > :nth-child(1) > .ant-select-item-option-content',
    ).click('left');

    cy.get(
      ':nth-child(6) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > .rc-virtual-list > .rc-virtual-list-holder > :nth-child(1) > .rc-virtual-list-holder-inner > :nth-child(1) > .ant-select-item-option-content',
    ).click('left');

    cy.get(
      ':nth-child(7) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > .rc-virtual-list > .rc-virtual-list-holder > :nth-child(1) > .rc-virtual-list-holder-inner > :nth-child(1) > .ant-select-item-option-content',
    ).click('left');

    cy.get(
      ':nth-child(7) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > [data-inspector-line="144"] > .ant-btn',
    ).click();
    cy.get(
      ':nth-child(6) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > [data-inspector-line="144"] > .ant-btn',
    ).click();
    cy.get(
      ':nth-child(5) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > [data-inspector-line="144"] > .ant-btn',
    ).click();
    cy.get(
      ':nth-child(4) > :nth-child(1) > .ant-select-dropdown > :nth-child(1) > [data-inspector-line="122"] > [data-inspector-line="144"] > .ant-btn',
    ).click();

    cy.get('.ant-input-affix-wrapper > .ant-input').type('lan').trigger('enter').type('{enter}');
  });
});
