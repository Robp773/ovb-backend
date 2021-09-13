"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

const getDrillCategoryData = async (article) => {
  for (let i = 0; i < article.drills.length; i++) {
    const curDrill = article.drills[i];
    const drillCategory = await strapi.services["drill-category"].findOne({
      id: curDrill.drill_category,
    });

    article.drills[i].category = drillCategory.name;
  }
};

module.exports = {
  async find(ctx) {
    let articles;
    if (ctx.query._q) {
      articles = await strapi.services.article.search(ctx.query);
    } else {
      articles = await strapi.services.article.find(ctx.query);
    }

    for (let i = 0; i < articles.length; i++) {
      await getDrillCategoryData(articles[i]);
    }

    return articles.map((article) =>
      sanitizeEntity(article, { model: strapi.models.article })
    );
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const article = await strapi.services.article.findOne({ id });
    await getDrillCategoryData(article);
    return sanitizeEntity(article, { model: strapi.models.article });
  },
};
