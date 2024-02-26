// import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import renderSkill from './src/remark/render-skill'; 

const config: Config = {
  title: 'AgileWhisker',
  tagline: 'AgileWhisker is set of revolutionary PC peripheral widgets that can be programmed with JavaScript.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://w.kittenbot.cc',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Kittenbot', // Usually your GitHub org/user name.
  projectName: 'AgileWhisker', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  staticDirectories: [
    'static',
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          beforeDefaultRemarkPlugins: [renderSkill],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/KittenBot/agilewhisker-web/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/KittenBot/agilewhisker-web/tree/main/blog/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    algolia: {
      apiKey: '3afbce6f67d86e100945c94519cd0ff5',
      indexName: 'w-kittenbot',
      appId: 'XDBZ44J9EH',
      contextualSearch: false,
    },
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'AgileWhisker',
      logo: {
        alt: 'agile-whisker',
        src: 'img/agilewhisker.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        // {to: '/showcase',label: 'Showcase',position:'left' },
        {
          href: 'https://github.com/kittenbot/agilewhisker-web',
          label: 'GitHub',
          position: 'right'
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/9vUbF3za',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/kittenbot1',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/kittenbot/agilewhisker-web',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kittenbot, Inc. Built with Docusaurus.`,
    },
    // prism: {
    //   theme: prismThemes.github,
    //   darkTheme: prismThemes.dracula,
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
