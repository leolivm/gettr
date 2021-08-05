import puppetter from "puppeteer";

class SearchController {
  async index(req, res) {
    const { search } = req.body;
    const browser = await puppetter.launch();
    const page = await browser.newPage();

    await page.goto(
      `https://lista.mercadolivre.com.br/${search}#D[A:${search}]`
    );

    const searchInput = await page.evaluate(() => {
      const prices = [];

      const search = document.querySelectorAll(".price-tag-amount");
      search.forEach((item) => {
        prices.push(item.textContent);
      });
      return prices;
    });

    console.log(searchInput);

    browser.close();
    return res.json(searchInput);
  }
}

export default new SearchController();
