

const SkillBuild = async (text: string) => {
  const config = {}
  const awagent = (content) => {
    const _keys = ['id', 'name', 'description']
    for (const key of _keys) {
      if (content[key]) {
        config[key] = content[key]
      }
    }

  }

  const md = (content) => {
    console.log("md: ", content)
  }

  const evaluateInContext = (js, context) => {
    return function() { return eval(js); }.call(context);
  }
  
  try {
    evaluateInContext(text, { awagent, md })
  } catch (e) {
    console.warn(e)
  }
  return config
}







export default SkillBuild;
