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
          
          return {
            name: entry.name,
            config: _config,
          };
        });

      return skills;
    },
    async contentLoaded({ content, actions }) {
      console.log('contentLoaded', content)
      const { createData, addRoute } = actions;

    },
  };
};