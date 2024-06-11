import fs from 'fs-extra';
import path from 'path';

const buildSkillPage = (jsCode) => {
  let config = {}
  const awagent = (content) => {
    console.log('awagent', content)
    config = {...config, ...content}
  }

  const evaluateInContext = (js, context) => {
    return function() { return eval(js); }.call(context);
  }
  try {
    evaluateInContext(jsCode, { awagent })
  } catch (e) {
    console.warn(e)
  }
  return config
}

export default async function skillGenerate(context, options) {

  // console.log('options', context, options);
  return {
    name: 'docusaurus-plugin-skills',
    async loadContent() {
      const skillsDirectory = path.join(__dirname, '..', 'skills');
      console.log('loadContent', skillsDirectory);
      const entries = fs.readdirSync(skillsDirectory, { withFileTypes: true });
      console.log('entries', entries);
      const skills = entries
        .filter(entry => entry.isFile && entry.name.endsWith('.js'))
        .map(entry => {
          console.log('entry', entry);
          const _txt = fs.readFileSync(path.join(skillsDirectory, entry.name), 'utf-8');
          const _config = buildSkillPage(_txt)
          console.log('config', _config);
          const name = entry.name.replace('.js', '.md');
          return {
            name: name,
            config: _config,
          };
        });

      return skills;
    },
    async contentLoaded({ content, actions }) {
      console.log('contentLoaded', content)
      const { createData, addRoute } = actions;

      for (const skill of content) {
        const _path = path.join(__dirname, '..', 'skills_page', skill.name)
        const _mdContent = `---
title: ${skill.config.name}
---
# ${skill.config.name}
\`\`\`
${JSON.stringify(skill.config, null, 2)}
\`\`\`
`
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

    },
  };
};