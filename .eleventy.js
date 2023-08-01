module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  // Copy the `css` directory to the output
  eleventyConfig.addPassthroughCopy('src/assets/css');
  // Watch the `css` directory for changes
  eleventyConfig.addWatchTarget('src/assets/css');

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
  