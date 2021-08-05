import puppetter from "puppeteer";

class SearchController {
  async index(req, res) {
    const { search } = req.body;
    const browser = await puppetter.launch();
    const page = await browser.newPage();

    // Mercado Livre
    // ___________________________________________________________________
    await page.goto(
      `https://lista.mercadolivre.com.br/${search}#D[A:${search}]`
    );

    const searchMLArray = await page.evaluate(() => {
      const prices = [];

      const search = document.querySelectorAll(".price-tag-amount");
      search.forEach((item) => {
        prices.push(item.textContent);
      });
      return prices;
    });

    const arrMLNumber = searchMLArray.map((item) => {
      return item.replace("R$", "").replace(",", ".");
    });

    const minML = Math.min(...arrMLNumber);
    // Mercado Livre
    // ___________________________________________________________________

    // Lojas Livia
    // ___________________________________________________________________
    await page.goto(`https://www.lojaslivia.com.br/busca?busca=${search}`);

    const searchLLArray = await page.evaluate(() => {
      const prices = [];

      const search = document.querySelectorAll(".precoPor");
      search.forEach((item) => {
        if (item.querySelector(".porcentagem")) {
          item.removeChild(item.childNodes[0]);
        }
        prices.push(item.textContent);
      });
      return prices;
    });

    const arrLLNumber = searchLLArray.map((item) => {
      return item.replace("R$ ", "").replace(",", ".").replace(" à vista", "");
    });

    const minLL = Math.min(...arrLLNumber);
    // Lojas Livia
    // ___________________________________________________________________

    console.log("Mercado Livre", minML);
    console.log("Livia Lojas", minLL);

    const resOjb = {
      searchMLArray,
      searchLLArray,
    };

    const difVal = Math.min(minML, minLL);

    console.log(difVal);

    browser.close();
    return res.status(200).json(resOjb);
  }
}
// aowba
export default new SearchController();
