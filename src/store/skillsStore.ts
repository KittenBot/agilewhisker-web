import { create } from 'zustand'
import {
    SkillConfig,
    SkillParam,
    SkillEvent, 
    Build
} from '@/lib/SkillBuild'

const loadOrCreateBuild = (key: string): Build => {
    let _build: Build = null
    const _buildStr = localStorage.getItem(key)
    if (!_buildStr) {
        // init a initial build
        _build = {
            id: key,
            name: key,
            hardware: '',
            events: []
        }
    } else {
        _build = JSON.parse(_buildStr)
        // compatibility check
        if (!_build.events) {
            _build.events = []
        }
    }
    return _build
}

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
        const _temp_build = loadOrCreateBuild('My Build')
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
    addEvent: (skill: SkillEvent) => void
    // delete: (key: string) => void
}>((set, get) => ({
    build: null,
    builds: [],
    skills: [],
    loadSkills: (skills: SkillConfig[]) => {
        const _builds = initialBuilds()
        // load first build
        const _build = loadOrCreateBuild(_builds[0])
        
        set({ skills, builds: _builds, build: _build })
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
    },
    addEvent: (skill: SkillEvent) => {
        const _build = get().build
        if (!_build) {
            console.error('No build found')
            return
        }
        // find if the event exists, both id and key are same
        if (_build.events.find((e) => e.id === skill.id && e.key === skill.key)) {
            _build.events = _build.events.filter((e) => e.id !== skill.id && e.key !== skill.key)
        }
        _build.events.push(skill)
        console.log('add event', _build)
        set({ build: _build })
    }
}))
