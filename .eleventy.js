module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  // Watch CSS files for changes
  eleventyConfig.setBrowserSyncConfig({
		files: './_site/css/**/*.css'
	});
  // Obtain the `year` from the template
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  

    return {
      dir: {
        input: "src",
        data: "_data",
        includes: "_includes",
        layouts: "_layouts"
      }
    };
  }
  