const sharp = require('sharp')
const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');
require('dotenv').config();
const W3F_API_KEY = process.env.W3F_API_KEY;
const fs = require("fs");
const NOT_FOUND_PATH = "_site/404.html";

module.exports = function(eleventyConfig){

  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  // Add this line to recognize the data directory
  eleventyConfig.addPassthroughCopy('_data');
  // Official plugins
	eleventyConfig.addPlugin(pluginRss);
  // .env
  eleventyConfig.addGlobalData('env', process.env);
  
  eleventyConfig.setBrowserSyncConfig({
    // Watch CSS files for changes
		files: './_site/css/**/*.css',
    // 404 routing by passing a callback
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }
          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
	});
  
  // Enable collection in descending order
  eleventyConfig.addCollection('posts', collection => {
  return collection.getFilteredByGlob('.src/posts/**/*.md').reverse();
  });
  // Obtain the `year` from the template
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  // Obtain the 'htmlDateString' from the template
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });
  // Obtain the `readableDate` from the template
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy');
    
  });
  
  // Generate favicon from svg input
  // Only run on production build
  
    eleventyConfig.on('eleventy.before', async () => {
      console.log('[11ty] Generating Favicon')
      await sharp('src/assets/images/favicon.svg')
        .png()
        .resize(96, 96)
        .toFile('_site/assets/images/icon-96x96.png')
        .catch(function (err) {
          console.log('[11ty] ERROR Generating favicon')
          console.log(err)
        })
    })
  
  eleventyConfig.watchIgnores.add('_site/assets/images/icon-96x96.png')

  return {
    dir: {
      input: "src",
      output: "_site",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: [
      'html',
      'md',
      'njk'
    ],
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk"
  }
};

  