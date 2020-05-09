const fs = require("fs");

function extractSource(path) {
  return fs
    .readFileSync(path, {
      encoding: "utf8",
    })
    .toString();
}

class InlineChunkHtmlPlugin {
  constructor(htmlWebpackPlugin, config = {}) {
    this.htmlWebpackPlugin = htmlWebpackPlugin;
    this.config = Object.assign(
      {
        maxSize: 20 * 1024,
        js: [],
        css: [],
      },
      config
    );
  }

  getInlinedTag(publicPath, assets, tag) {
    const maxSize = this.config.maxSize;
    if (
      (tag.tagName !== "script" || !(tag.attributes && tag.attributes.src)) &&
      (tag.tagName !== "link" || !(tag.attributes && tag.attributes.href))
    ) {
      return tag;
    }

    if (tag.tagName === "script") {
      const scriptName = publicPath
        ? tag.attributes.src.replace(publicPath, "")
        : tag.attributes.src;

      const asset = assets[scriptName];
      if (asset == null || asset.size() > maxSize) {
        return tag;
      }
      return { tagName: "script", innerHTML: asset.source(), closeTag: true };
    }

    if (tag.tagName === "link") {
      const scriptName = publicPath
        ? tag.attributes.href.replace(publicPath, "")
        : tag.attributes.href;

      const asset = assets[scriptName];
      if (asset == null || asset.size() > maxSize) {
        return tag;
      }
      return { tagName: "style", innerHTML: asset.source(), closeTag: true };
    }
  }

  apply(compiler) {
    let publicPath = compiler.options.output.publicPath || "";
    if (publicPath && !publicPath.endsWith("/")) {
      publicPath += "/";
    }

    compiler.hooks.compilation.tap("InlineChunkHtmlPlugin", (compilation) => {
      const js = this.config.js;
      const css = this.config.css;

      const tagFunction = (tag) =>
        this.getInlinedTag(publicPath, compilation.assets, tag);

      const hooks = this.htmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTagGroups.tap("InlineChunkHtmlPlugin", (assets) => {
        assets.headTags = assets.headTags.map(tagFunction);
        assets.bodyTags = assets.bodyTags.map(tagFunction);

        for (let i = 0; i < js.length; i++) {
          assets.bodyTags.unshift({
            tagName: "script",
            innerHTML: extractSource(js[i]),
            closeTag: true,
          });
        }
        for (let i = 0; i < css.length; i++) {
          assets.bodyTags.unshift({
            tagName: "style",
            innerHTML: extractSource(css[i]),
            closeTag: true,
          });
        }
      });
    });
  }
}

module.exports = InlineChunkHtmlPlugin;
