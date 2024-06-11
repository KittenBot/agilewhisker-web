import { SkillConfig } from '@/lib/SkillBuild';
import fs from 'fs-extra';
import path from 'path';

const buildSkillPage = (jsCode) => {
  let markdown = '' // markdown content
  let config: SkillConfig = {
    id: 'unknown',
    name: 'unknown',
    category: 'others',
    description: 'Description not available',
  }
  const awagent = (content) => {
    console.log('awagent', content)
    config = {...config, ...content}
  }

  const md = (content) => {
    markdown = content
    // append docusaurus markdown title
    if (!markdown.startsWith('---')) {
      markdown = `---
title: ${config.name}
---

${markdown}`
    }
  }

  const evaluateInContext = (js, context) => {
    return function() { return eval(js); }.call(context);
  }
  try {
    evaluateInContext(jsCode, { awagent, md })
  } catch (e) {
    console.warn(e)
  }
  return {config, markdown}
}

export default async function skillGenerate(context, options) {

  // console.log('options', context, options);
  return {
    name: 'docusaurus-plugin-skills',
    async loadContent() {
      const skillsDirectory = path.join(__dirname, '..', 'skills');
      const entries = fs.readdirSync(skillsDirectory, { withFileTypes: true });
      const skills = entries
        .filter(entry => entry.isFile && entry.name.endsWith('.js'))
        .map(entry => {
          // copy the file to static/skills
          fs.copyFileSync(path.join(skillsDirectory, entry.name), path.join(__dirname, '..', 'static', 'js', entry.name))
          const _txt = fs.readFileSync(path.join(skillsDirectory, entry.name), 'utf-8');
          const {config, markdown} = buildSkillPage(_txt)
          config.jsSrc = `/js/${entry.name}`
          const name = entry.name.replace('.js', '.md');
          return {
            name,
            config,
            markdown
          };
        });

      return skills;
    },
    async contentLoaded({ content, actions }) {
      console.log('contentLoaded', content)
      const { createData, addRoute } = actions;
      const skills: SkillConfig[] = []

      // skills_page for /skills/xxx docs page
      if (!fs.existsSync(path.join(__dirname, '..', 'skills_page'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'skills_page'))
      }

      for (const skill of content) {
        const _path = path.join(__dirname, '..', 'skills_page', skill.name)
        const _mdContent = skill.markdown
        // too much trouble to create a md render, just save to skills_page and let page plugin render it
        if (fs.existsSync(_path)) {
          // compare content and update if needed
          const _oldContent = fs.readFileSync(_path, 'utf-8')
          if (_oldContent === _mdContent) {
            continue
          }
          fs.writeFileSync(_path, _mdContent)
        } else {
          fs.writeFileSync(_path, _mdContent)
        }
      }

      const skillsJsonPath = await createData('skills.json', JSON.stringify(skills, null, 2));

      addRoute({
        path: '/builder',
        component: '@site/src/components/Builder/skillbuild.tsx',
        exact: true,
        modules: {
          skills: skillsJsonPath,
        }
      })

    },
  };
};