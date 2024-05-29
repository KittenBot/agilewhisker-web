import { create } from 'zustand'
import { 
    Skill,
    SkillBuilder,
    SkillButton,
    SkillOpenUrl,
    SkillStartApp,
    SkillSendText,
    SkillAiService

} from '../components/Builder/skill'

interface SkillConf {
    id: string
    type: string
    param: any
    description: string
}

const initialBuilds = (): string[] => {
    let _builds = []
    let _buildsStr = localStorage.getItem('skillbuilds')
    if (!_buildsStr) {
        _builds = ["My Build"]
        // init a initial build
        const _temp_build = [
            {id: 'button1', type: 'SkillButton', param: {id: 'openurl1', type: 'SkillOpenUrl', param: 'https://example.com'}},
        ]
        localStorage.setItem('My Build', JSON.stringify(_temp_build))
        localStorage.setItem('skillbuilds', JSON.stringify(_builds))
    } else {
        _builds = JSON.parse(_buildsStr)
    }
    return _builds
}

const buildSkill = (skill: SkillConf): Skill => {
    let param = skill.param
    if (!skill.description) {
        skill.description = ''
    }
    if (typeof param === 'object' && param.type) {
        param = buildSkill(skill.param) 
    }
    if (skill.type === 'SkillButton') {
        return new SkillButton(skill.id, param)
    } else if (skill.type === 'SkillOpenUrl') {
        return new SkillOpenUrl(skill.id, param)
    } else if (skill.type === 'SkillStartApp') {
        return new SkillStartApp(skill.id, param)
    } else if (skill.type === 'SkillSendText') {
        return new SkillSendText(skill.id, param)
    } else if (skill.type === 'SkillAiService') {
        return new SkillAiService(skill.id, param)
    }

    throw new Error('Unknown skill type')
}

export const useSkillsStore = create<{
    current: string // current skill build
    builds: string[]
    skills: SkillConf[]
    generate: () => string // generate code for current build
    save: (key: string) => void
    load: (key: string) => void
    delete: (key: string) => void
}>((set, get) => ({
    current: '',
    builds: initialBuilds(),
    skills: [],
    save: (key: string) => {
        console.log('save current skill to loc with key', key)
    },
    load: (key: string) => {
        if (key === get().current) return
        const _buildsStr = localStorage.getItem(key)
        if (!_buildsStr) {
            console.error('No build found with key', key)
            const _builds = get().builds.filter((build) => build !== key)
            localStorage.setItem('skillbuilds', JSON.stringify(_builds))
        }
        const _builds: SkillConf[] = JSON.parse(_buildsStr)
        if (Skill.builder?.skills)
            Skill.builder.skills = []
        for (const _build of _builds) {
            const ret = buildSkill(_build)
            _build.description = ret.description
        }
        set({ 
            current: key,
            skills: _builds
        })
    },
    delete: (key: string) => {
        const _builds = get().builds.filter((build) => build !== key)
        localStorage.removeItem(key)
        localStorage.setItem('skillbuilds', JSON.stringify(_builds))
    },
    generate: () => {
        return Skill.builder.buildAll()
    }
}))
