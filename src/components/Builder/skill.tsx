
export class SkillBuilder {
  libs: string[] = ['import * as ds from "@devicescript/core"'];
  instances: Record<string, string> = {};
  main: string = '';
  skills: Skill[] = []

  addLib(lib: string) {
    if (lib.startsWith('import ') || lib.startsWith('from ')) {
      this.libs.push(lib)
    } else {
      this.libs.push(`from ${lib} import *`)
    }
  }

  addInstance(id: string, instance: string) {
    this.instances[id] = instance
  }

  addMain(main: string) {
    this.main += main + '\n'
  }

  buildAll() {
    for (const skill of this.skills) {
      skill.build(this)
    }
    let code = ''
    for (const lib of this.libs) {
      code += `${lib}\n`
    }
    for (const [id, instance] of Object.entries(this.instances)) {
      code += `const ${id} = ${instance}\n`
    }
    code += this.main
    return code
  }

}


abstract class Skill {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  devs: string; // device script to run
  instance?: string;
  libs: string[] = [] // libraries to import in the devicescript builder
  params?: Record<string, any> // parameters to replace in the script
  isEvent?: boolean // is an event

  constructor(id: string, name: string, options: any = {}) {
    this.id = id
    this.name = name
    this.params = options.params || {}
  }

  build(builder: SkillBuilder) {
    if (this.isEvent){
      return
    }
    for (const lib of this.libs) {
      builder.addLib(lib)
    }
    if (this.instance) {
      builder.addInstance(this.id, this.instance)
    }
    let code = this.devs
    for (const [key, value] of Object.entries(this.params)) {
      const re = new RegExp(key, 'g')
      if (typeof value === 'string') {
        code = code.replace(re, value)
      } else if (value instanceof Skill) {
        const _event = value as Skill
        code = code.replace(re, _event.getCode(this.params))
      }
    }
    builder.addMain(code)
  }

  getCode(params: Record<string, any> = {}) {
    const _params = { ...this.params, ...params}
    let code = this.devs
    for (const [key, value] of Object.entries(_params)) {
      const re = new RegExp(key, 'g')
      code = code.replace(re, value)
    }
    return code
  }
}

export class SkillButton extends Skill {
  event: string;
  constructor(name: string, event: string, options: any = {}) {
    super(`button_${name}`, name, options)
    this.instance = `new ds.Button()`
    this.devs = `btn.${event}.subscribe(async()=>{\n  $EVENT \n})`
    if (!this.params['$EVENT']) {
      this.params['$EVENT'] = 'console.log("button clicked")'
    }
  }
}

export class SkillOpenUrl extends Skill {
  constructor(name: string, options: any = {}) {
    super(`cd`, name, options)
    this.instance = `await new ds.PCEvent()`
    this.devs = `await cd.openUrl("$URL")`
  }
}
