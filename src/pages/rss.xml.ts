import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const site = context.site?.toString();

  if (!site) {
    throw new Error('Set the site URL in astro.config.mjs before generating the RSS feed.');
  }

  const [posts, reports] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('progress', ({ data }) => !data.draft)
  ]);

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`
    })),
    ...reports.map((report) => ({
      title: report.data.title,
      description: `Progress report covering days ${report.data.dayRange}.`,
      pubDate: report.data.pubDate,
      link: `/progress-reports/${report.id}/`
    }))
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: "Shivam's Blog & Progress Reports",
    description: 'Long-form posts, projects and notes from my learning journey.',
    site,
    items
  });
}
