import { create } from 'zustand'
import {
    SkillConfig,
    SkillParam,
    Skill, 
    Build
} from '@/lib/SkillBuild'

const initialBuilds = (): string[] => {
    let builds: string[] = []
    // ssr check
    if (typeof window == 'undefined') {
        return builds
    }
    let _buildsStr = localStorage.getItem('skillbuilds')
    if (!_buildsStr) {
        builds = ["My Build"]
        // init a initial build
        const _temp_build: Build = {
            id: 'My Build',
            name: 'My Build',
            hardware: '',
        }
        localStorage.setItem('My Build', JSON.stringify(_temp_build))
        localStorage.setItem('skillbuilds', JSON.stringify(builds))
    } else {
        builds = JSON.parse(_buildsStr)
    }
    return builds
}


export const useSkillsStore = create<{
    build: Build
    builds: string[]
    skills: SkillConfig[]
    loadSkills: (skills: SkillConfig[]) => void
    generate: () => string // generate code for current build
    save: (key: string) => void
    load: (key: string) => void
    // delete: (key: string) => void
}>((set, get) => ({
    build: null,
    builds: initialBuilds(),
    skills: [],
    loadSkills: (skills: SkillConfig[]) => {
        set({ skills })
        // TODO: load user indexdb saved skills ??
    },
    save: (key: string) => {
        console.log('save current skill to loc with key', key)
        const _build = get().build
        localStorage.setItem(key, JSON.stringify(_build))
        const builds = get().builds
        // find if the key exists
        if (!builds.includes(key)) {
            builds.push(key)
            localStorage.setItem('skillbuilds', JSON.stringify(builds))
        }
    },
    load: (key: string) => {
        if (key === get().build?.id) return
        const _buildStr = localStorage.getItem(key)
        if (!_buildStr) {
            console.error('No build found with key', key)
            return
        }
        const _build: Build = JSON.parse(_buildStr)
        set({ build: _build })
    },
    generate: () => {
        // return Skill.builder.buildAll()
        return 'str'
    }
}))
