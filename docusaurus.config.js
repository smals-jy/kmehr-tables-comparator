// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'KMEHR tables comparator',
  tagline: 'A tool to compare table changes between KMEHR versions',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: process.env.GITHUB_ORIGIN || "http://localhost:3000",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.GITHUB_BASE || "/",
  trailingSlash: false, // Needed for Gh pages - https://github.com/facebook/docusaurus/issues/5026

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'smals-jy', // Usually your GitHub org/user name.
  projectName: 'kmehr-tables-comparator', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        debug: true,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      "./src/plugins/kmehr/docusaurus-kmehr.js",
      {}
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'KMEHR tables comparator',
        logo: {
          alt: 'KMEHR tables comparator Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            href: 'https://github.com/smals-jy/kmehr-tables-comparator',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} KMEHR tables comparator, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
