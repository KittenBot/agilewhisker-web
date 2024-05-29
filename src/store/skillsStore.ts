import { create } from 'zustand'
import { Skill } from '../components/Builder/skill'

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

export const useSkillsStore = create<{
    current: string // current skill build
    builds: string[]
    skills: Record<string, Skill>
    generate: () => string // generate code for current build
    save: (key: string) => void
    load: (key: string) => void
}>((set, get) => ({
    current: '',
    builds: initialBuilds(),
    skills: {},
    save: (key: string) => {
        console.log('save current skill to loc with key', key)
    },
    load: (key: string) => {
        if (key === get().current) return
        const _buildsStr = localStorage.getItem(key)
        if (!_buildsStr) return
        const _builds = JSON.parse(_buildsStr)
        console.log('load skill build', key, _builds)
        set({ current: key })
    },
    generate: () => {
        return Skill.builder.buildAll()
    }
}))
