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
    // test data-api
    cy.get(':nth-child(2) > .ant-menu-submenu-title').click();
    cy.get('a').contains('Quản lý dữ liệu gọi').click({ force: true });
    cy.get(
      '#root > div > section > div.ant-layout > main > div.card-container > div > div.ant-tabs-nav > div.ant-tabs-nav-wrap > div > div:nth-child(2)'
    ).click({ force: true });
    cy.get(
      '.ant-pro-table-list-toolbar'
    ).should('be.visible');
    cy.get(
      '.ant-table-wrapper'
    ).should('be.visible');

    //đổi trang
    cy.contains('trang').click();
    cy.contains('5 / trang').click();

    //filter
    cy.get('#rc-tabs-1-panel-1 > div > div > div > div.ant-pro-table-list-toolbar > div > div.ant-pro-table-list-toolbar-left > div > div > div > div > div.ant-col.ant-form-item-control > div > div > div > div > input').click('left', { multiple: true, force: true });
    cy.get(
      'div > div > div > div > div.ant-picker-date-panel > div.ant-picker-body > table > tbody > tr:nth-child(4) > td:nth-child(4) > div'
    ).click({ multiple: true, force: true });

    cy.get(
      '#rc-tabs-1-panel-1 > div > div > div > div.ant-pro-table-list-toolbar > div > div.ant-space.ant-space-horizontal.ant-space-align-center.ant-pro-table-list-toolbar-right > div > div > div:nth-child(1) > span > input'
    ).type('test');


    //Thêm dữ liệu
    cy.get(
      '#rc-tabs-1-panel-1 > div > div > div > div.ant-pro-table-list-toolbar > div > div.ant-space.ant-space-horizontal.ant-space-align-center.ant-pro-table-list-toolbar-right > div > div > div:nth-child(2) > button'
    ).click({ force: true });

    cy.get(
      '.ant-modal-content'
    ).should('be.visible');

    cy.get(
      '#name'
    ).type('test', { force: true });
    cy.get(
      '#config'
    ).type('test config', { force: true });
    cy.get(
      ' div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div.ant-col.ant-col-14.ant-col-offset-5 > button:nth-child(3)'
    ).click({ force: true });

    //export
    cy.get(
      '#rc-tabs-0-panel-2 > div > div > div > div.ant-tabs-nav > div.ant-tabs-nav-wrap > div > div:nth-child(2)'
    ).click({ force: true });
   

  });
});
