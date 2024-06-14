
export class SkillBuilder {
  libs: string[] = ['import * as ds from "@devicescript/core"'];
  instances: Record<string, string> = {};
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
    for (const skill of this.skills) {
      if (skill.code_generated && skill.parent === undefined) {
        code += skill.code_generated
      }
    }
    return code
  }

}


export abstract class Skill {
  static builder: SkillBuilder
  description: string;
  thumbnail: string;
  devs: string; // device script to run
  instance?: string;
  libs: string[] = [] // libraries to import in the devicescript builder
  params: Record<string, any> = {}// parameters to replace in the script
  code_generated?: string // generated code
  parent?: Skill // parent skill

  constructor(public id: string, public name: string, public key0: string, public options: any = {}) {
    if (!Skill.builder) {
      Skill.builder = new SkillBuilder()
    }
    if (this.key0) { // the default parameter key, most skill has only one parameter
      this.key0 = key0
      if (typeof options === 'string') {
        this.params = { [this.key0]: options }
        this.options = {}
      } else if (options instanceof Skill) {
        this.params = { [this.key0]: options }
        this.options = {}
      }
    } else {
      this.params = { ...this.params, ...options.params }
    }
    Skill.builder.skills.push(this)
  }

  build(builder: SkillBuilder) {
    for (const lib of this.libs) {
      builder.addLib(lib)
    }
    if (this.instance) {
      builder.addInstance(this.id, this.instance)
    }
    let code = this.devs
    for (const [key, value] of Object.entries(this.params)) {
      const re = new RegExp(`\\${key}`, 'g')
      if (typeof value === 'string') {
        code = code.replace(re, value)
      } else if (value instanceof Skill) {
        const _event = value as Skill
        _event.parent = this
        code = code.replace(re, _event.getCode(this.params))
      }
    }
    this.code_generated = code
  }

  getCode(params: Record<string, any> = {}) {
    const _params = { ...this.params, ...params}
    let code = this.devs
    for (const [key, value] of Object.entries(_params)) {
      const re = new RegExp(`\\${key}`, 'g')
      code = code.replace(re, value)
    }
    return code
  }
}

export class SkillButton extends Skill {
  event: string;
  constructor(name: string, options: any = {},  event: string = 'down') {
    super(`button_${name}`, name, '$EVENT', options)
    this.instance = `new ds.Button()`
    this.devs = `${this.id}.${event}.subscribe(async()=>{\n  $EVENT \n})`
    if (!this.params['$EVENT']) {
      this.params['$EVENT'] = 'console.log("button clicked")'
    }
    this.description = `${name}->${this.params['$EVENT'].description}`
  }
}

export class SkillOpenUrl extends Skill {
  constructor(name: string, options: any = {}) {
    super(`cd`, name, '$URL', options)
    this.instance = `await new ds.PCEvent()`
    this.devs = `await cd.openUrl("$URL")`
    this.description = `Open ${this.params['$URL']}`
  }
}

export class SkillStartApp extends Skill {
  constructor(name: string, options: any = {}) {
    super(`cd`, name, '$APP', options)
    this.instance = `await new ds.PCEvent()`
    this.devs = `await cd.openApp("$APP")`
    this.description = `Open ${this.params['$APP']}`
  }
}

export class SkillAiService extends Skill {
  constructor(name: string, options: any = {}) {
    super(`cd`, name, '$SCRIPT', options)
    this.instance = `await new ds.PCEvent()`
    // run ai script with name $SCRIPT, $PARAMS 
    this.devs = `await cd.runScript("aiscript://$SCRIPT?$PARAMS")`
    this.description = `Run AI script`
  }
}

export class SkillSendText extends Skill {
  constructor(name: string, options: any = {}) {
    super(`cd`, name, '$TXT', options)
    this.instance = `await new ds.PCEvent()`
    this.devs = `await cd.sendText("$TXT")`
    this.description = `Send text`
  }
}