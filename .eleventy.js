const sharp = require('sharp')
const { DateTime } = require('luxon');

module.exports = function(eleventyConfig){

  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/js');
 // Add this line to recognize the data directory
  eleventyConfig.addPassthroughCopy('_data');
  
  // Watch CSS files for changes
  eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css'
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

  