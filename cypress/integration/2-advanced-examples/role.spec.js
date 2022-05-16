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
    // test role
    cy.get(':nth-child(3) > .ant-menu-submenu-title').click();
    cy.get('a').contains('Phân quyền').click({ force: true });

    //đổi trang
    cy.contains('trang').click();
    cy.contains('5 / trang').click();

    //filter
    cy.get('.ant-picker-range').click('left', { multiple: true, force: true });
    cy.get(
      'div > div > div > div.ant-picker-panel-container > div.ant-picker-panels > div:nth-child(1) > div > div.ant-picker-body > table > tbody > tr:nth-child(3) > td:nth-child(4) > div'
    ).click('left', { multiple: true });
    cy.get(
      'div > div > div > div.ant-picker-panel-container > div.ant-picker-panels > div:nth-child(1) > div > div.ant-picker-body > table > tbody > tr:nth-child(4) > td:nth-child(4) > div'
    ).click('left', { multiple: true });
    cy.get('.ant-select-selector').click({ multiple: true, force: true });
    cy.get(
      ' div > div > div > div > div.rc-virtual-list > div.rc-virtual-list-holder > div > div > div:nth-child(1) > .ant-select-item-option-content'
    ).click('left', { multiple: true });
    cy.get(
      'div > div > div > div > div:nth-child(6) > button'
    ).click();
    cy.get('.ant-input-affix-wrapper > .ant-input').type('test');

    //tạo role
    cy.get(
      '#root > div > section > div.ant-layout > main > div.ant-pro-table > div > div > div.ant-pro-table-list-toolbar > div > div.ant-space.ant-space-horizontal.ant-space-align-center.ant-pro-table-list-toolbar-right > div > div > div:nth-child(2) > button'
    ).click();
    cy.get(
      '.ant-modal-content'
    ).should('be.visible');
    cy.get('#role').type('newtestrole');
    cy.get('#description').type('description');
    cy.get(
      'div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div:nth-child(4) > div.ant-col.ant-col-19.ant-form-item-control > div > div > div:nth-child(1) > div > div.ant-collapse-header'
    ).click('right', { multiple: true });
    cy.get(
      'div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div:nth-child(4) > div.ant-col.ant-col-19.ant-form-item-control > div > div > div:nth-child(1) > div > div.ant-collapse-header > :nth-child(2)'
    ).click('right', { multiple: true });
    cy.get(
      'div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div:nth-child(5) > button.ant-btn.ant-btn-primary'
    ).click({ multiple: true });
    cy.get('.ant-modal-content').then(($modal) => {
      if ($modal.has('.ant-modal-body')) {
        cy.get(
          'div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div:nth-child(5) > button:nth-child(1)'
        ).click({ multiple: true });
      }
    });
    cy.get(
      '.ant-modal-content'
    ).should('not.exist');
    //xoá filter
    cy.get(
      '    #root > div > section > div.ant-layout > main > div.ant-pro-table > div > div > div.ant-pro-table-list-toolbar > div > div.ant-pro-table-list-toolbar-left > div > div > div > div:nth-child(1) > div.ant-col.ant-form-item-control > div > div > div > span.ant-picker-clear'
    ).click({ multiple: true });
    cy.get('.ant-select-selector').click({ multiple: true, force: true });
    cy.get(
      ' div > div > div > div > div.rc-virtual-list > div.rc-virtual-list-holder > div > div > div:nth-child(1) > .ant-select-item-option-content'
    ).click('left', { multiple: true });
    cy.get(
      'div > div > div > div > div:nth-child(6) > button'
    ).click();
    cy.get(
      '#root > div > section > div.ant-layout > main > div.ant-pro-table > div > div > div.ant-pro-table-list-toolbar > div > div.ant-space.ant-space-horizontal.ant-space-align-center.ant-pro-table-list-toolbar-right > div > div > div:nth-child(1) > span > span.ant-input-suffix > span'
    ).click({ multiple: true });

    //sửa role
    cy.contains('newtestrole').click({ force: true });
    cy.get(
      '.ant-modal-content'
    ).should('be.visible');
    cy.get('div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div:nth-child(4) > div.ant-col.ant-col-19.ant-form-item-control > div > div > div:nth-child(2) > div').then(($check) => {
      if (!$check.contents('.ant-collapse-content').is(':visible')) {
        cy.get(
          'div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div:nth-child(4) > div.ant-col.ant-col-19.ant-form-item-control > div > div > div:nth-child(2) > div > div'
        ).click('right', { multiple: true });
      }
    });

    cy.get(
      '#Call\\ Data\\ Management > label:nth-child(1) > span.ant-checkbox > input'
    ).click('right', { multiple: true });
    cy.get(
      'div > div.ant-modal-wrap > div > div.ant-modal-content > div > form > div:nth-child(5) > button.ant-btn.ant-btn-primary'
    ).click({ multiple: true });
    cy.get(
      '.ant-modal-content'
    ).should('not.exist');

    // xoá role
    cy.get('.ant-input-affix-wrapper > .ant-input').type('newtestrole').wait(2000);
    cy.get(
      '#root > div > section > div.ant-layout > main > div.ant-pro-table > div > div > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr.ant-table-row.ant-table-row-level-0 > td.ant-table-cell.ant-table-selection-column > label > span > input'
    ).click({ multiple: true, force: true });
    cy.get(
      '.ant-alert'
    ).should('be.visible');
    cy.get(
      '#root > div > section > div.ant-layout > main > div.ant-pro-table > div > div > div.ant-pro-table-alert > div > div > div > div > div > div > div:nth-child(2) > button'
    ).click({ multiple: true });
    cy.get(
      '.ant-modal-body'
    ).should('be.visible');
    cy.get(
      'div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.footer___36nVm > button.ant-btn.yesButton___lYhS1'
    ).click({ multiple: true });
    cy.get(
      '.ant-modal-body'
    ).should('not.exist');
    cy.get(
      'div > div > div.ant-pro-table-list-toolbar > div > div.ant-space.ant-space-horizontal.ant-space-align-center.ant-pro-table-list-toolbar-right > div > div > div:nth-child(1) > span > span.ant-input-suffix > span'
    ).click({ multiple: true });
  });
});
