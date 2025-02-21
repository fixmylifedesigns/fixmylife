const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

class Resource {
  constructor(url, index) {
    this.index = index;
    this.url = url;
  }

  download(config = {}) {
    return axios({
      url: this.url,
      responseType: "stream",
      ...config,
    });
  }
}

class SnapTikClient {
  constructor(config = {}) {
    this.axios = axios.create({
      baseURL: "https://snaptik.app",
      ...config,
    });
  }

  async get_token() {
    const { data } = await this.axios({ url: "/" });
    const $ = cheerio.load(data);
    return $('input[name="token"]').val();
  }

  async get_script(url) {
    const form = new FormData();
    const token = await this.get_token();

    form.append("token", token);
    form.append("url", url);

    const { data } = await this.axios({
      url: "/abc2.php",
      method: "POST",
      data: form,
      headers: form.getHeaders(),
    });

    return data;
  }

  async eval_script(script1) {
    const script2 = await new Promise((resolve) =>
      Function("eval", script1)(resolve)
    );
    return new Promise((resolve, reject) => {
      let html = "";
      const [k, v] = ["keys", "values"].map((x) =>
        Object[x]({
          $: () =>
            Object.defineProperty(
              {
                remove() {},
                style: { display: "" },
              },
              "innerHTML",
              {
                set: (t) => (html = t),
              }
            ),
          app: { showAlert: reject },
          document: { getElementById: () => ({ src: "" }) },
          fetch: (a) => {
            return (
              resolve({ html, oembed_url: a }),
              {
                json: () => ({ thumbnail_url: "" }),
              }
            );
          },
          gtag: () => 0,
          Math: { round: () => 0 },
          XMLHttpRequest: function () {
            return { open() {}, send() {} };
          },
          window: { location: { hostname: "snaptik.app" } },
        })
      );

      Function(...k, script2)(...v);
    });
  }

  async get_hd_video(token) {
    try {
      const { data } = await this.axios({
        url: `/getHdLink.php?token=${token}`,
      });

      if (data.error) throw new Error(data.error);
      return data.url;
    } catch (err) {
      console.error("Error fetching HD video:", err);
      return null;
    }
  }

  async parse_html(html) {
    const $ = cheerio.load(html);
    const is_video = !$("div.render-wrapper").length;

    if (is_video) {
      const hd_token = $("div.video-links > button[data-tokenhd]").data(
        "tokenhd"
      );

      let hd_url = null;
      if (hd_token) {
        hd_url = await this.get_hd_video(hd_token);
      }

      const video_sources = $("div.video-links > a:not(a[href='/'])")
        .toArray()
        .map((elem) => $(elem).attr("href"))
        .map((x) => (x.startsWith("/") ? this.config.baseURL + x : x));

      return {
        type: "video",
        data: {
          sources: [
            new Resource(hd_url || video_sources[0], 0),
            ...video_sources.map((url, index) => new Resource(url, index + 1)),
          ],
        },
      };
    } else {
      return { type: "unknown", data: {} };
    }
  }

  async process(url) {
    const script = await this.get_script(url);
    const { html, oembed_url } = await this.eval_script(script);

    const res = {
      ...(await this.parse_html(html)),
      url,
    };

    return (res.data.oembed_url = oembed_url), res;
  }
}

module.exports = SnapTikClient;
