import { GamePage } from './app.po';

describe('game App', function() {
  let page: GamePage;

  beforeEach(() => {
    page = new GamePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
