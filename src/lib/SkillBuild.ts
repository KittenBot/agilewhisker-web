
export interface SkillParam {
  type: string
  description: string
  default?: any
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

export interface Skill {
  id: string
  params: Record<string, any>
}

export interface Build {
  id: string
  name: string
  hardware: string
  modules?: string[]
  skills?: Skill[]
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
