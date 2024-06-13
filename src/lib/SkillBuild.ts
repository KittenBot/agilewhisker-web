
export interface SkillParam {
  type: 'string' | 'number' | 'boolean'
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
  categoryThumbnail?: string // the thumbnail of the category, maybe should be in the category config
}

export interface SkillCategory {
  name: string
  thumbnail?: string
  skills: Record<string, SkillConfig>
}

export interface SkillEvtParam {
  text: string
  value: string
}
  
export interface SkillEvent {
  id: string // the id of the skill
  params?: Record<string, string | SkillEvtParam> // the parameters of the skill, calculated by the builder??
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

export function getSkillById (id: string, skills: Record<string, SkillCategory>) {
  for (const category in skills) {
      if (skills[category].skills[id]) {
          return skills[category].skills[id]
      }
  }
  return null
}

export function generateDeviceScript(build: Build, skills: Record<string, SkillCategory>): string {
  let code = ''
  const _imports = []
  const _instances = {}
  
  console.log("build: ", build, skills)

  for (const evt of build.events) {
    const skill = getSkillById(evt.id, skills)
    if (!skill) {
      console.error('Skill not found', evt)
      continue
    }
    let _code = skill.devs
    // params replace
    for (const key in evt.params) {
      let value = evt.params[key]
      if (typeof value === 'object') {
        value = value.value
      }
      _code = _code.replace(new RegExp(`#${key}#`, 'g'), value)
    }
    
    const _lines = _code.split('\n')
    for (const line of _lines) {
      if (line.startsWith('import')) {
        if (!_imports.includes(line)) _imports.push(line)
      } else if (line.startsWith('const')) {
        const _id = line.split(' ')[1]
        _instances[_id] = line
      } else if(line) {
        code += line + '\n'
      }
    }
  }

  // instances process
  const _instancesDs = []
  const _instancesCode = []
  for (const id in _instances) {
    const line = _instances[id]
    if (line.includes('new')) {
      _instancesDs.push(line)
    } else {
      _instancesCode.push(line)
    }
  }
  // join code in inverse order
  code = _instancesCode.join('\n') + '\n' + code
  code = _instancesDs.join('\n') + '\n' + code

  // imports process
  code = _imports.join('\n') + '\n' + code
  
  return code
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
