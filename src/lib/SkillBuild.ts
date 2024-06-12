
export interface SkillParam {
  type: string
  description: string
  default?: any
  constant?: boolean // user can't edit this parameter
}

export interface SkillConfig {
  id: string
  category: string // the category this skill may renderin
  index?: number // index render order in the category
  target?: string // the target may accept this skill
  name: string
  description: string
  thumbnail?: string
  params?: Record<string, SkillParam>
  devs?: string // the device script to run
  jsSrc?: string // the js source code to skill, filled by the build plugin
}

export interface SkillEvent {
  id: string // the id of the skill
  params?: Record<string, string> // the parameters of the skill, calculated by the builder??
  key: string // the unique key to the component
  thumbnail?: string // set by skill loader
}

export interface Build {
  id: string
  name: string
  hardware: string
  modules?: string[]
  events: SkillEvent[]
}


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
