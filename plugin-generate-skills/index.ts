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
          if (config.thumbnail){
            if (!config.thumbnail.startsWith('http') && fs.existsSync(path.join(skillsDirectory, config.thumbnail))) {
              // copy the thumbnail to static/assets
              fs.copyFileSync(path.join(skillsDirectory, config.thumbnail), path.join(__dirname, '..', 'static', 'assets', config.thumbnail))
              config.thumbnail = `/assets/${config.thumbnail}`
            }
          }
          config.jsSrc = `/js/${entry.name}`
          return {
            name: entry.name,
            config,
            markdown
          };
        });

      return skills;
    },
    async contentLoaded({ content, actions }) {
      console.log('contentLoaded', content)
      const { createData, addRoute } = actions;
      const _skills: SkillConfig[] = []

      // skills_page for /skills/xxx docs page
      if (!fs.existsSync(path.join(__dirname, '..', 'skills_page'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'skills_page'))
      }

      for (const skill of content) {
        const _mdName = skill.name.replace('.js', '.md')
        _skills.push(Object.assign({}, skill.config, { path: `/skills/${_mdName}` }))
        const _path = path.join(__dirname, '..', 'skills_page', _mdName)
        const _mdContent = skill.markdown
        // too much trouble to create a md render, just save to skills_page and let page plugin render it
        if (fs.existsSync(_path)) {
          console.log('file exists', _path)
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
      console.log('skills', _skills)
      const skillsJsonPath = await createData('skills.json', JSON.stringify(_skills, null, 2));

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