import { create } from 'zustand'
import {
    SkillConfig,
    SkillParam,
    SkillEvent, 
    Build,
    generateDeviceScript
} from '../lib/SkillBuild'

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
    load: (key: string) => void
    addEvent: (skill: SkillEvent) => void
    saveEvent: (skill: SkillEvent) => void
    // delete: (key: string) => void
}>((set, get) => ({
    build: {id: '', name: '', hardware: '', events: []},
    builds: [],
    skills: [],
    loadSkills: (skills: SkillConfig[]) => {
        const _builds = initialBuilds()
        // load first build
        const _build = loadOrCreateBuild(_builds[0])
        
        set({ skills, builds: _builds, build: _build })
        // TODO: load user indexdb saved skills ??
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
        const { build, skills } = get()
        const code = generateDeviceScript(build, skills)
        return code
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
        localStorage.setItem(_build.id, JSON.stringify(_build))
        set({ build: _build })
    },
    saveEvent: (skill: SkillEvent) => {
        const _build = get().build
        if (!_build) {
            console.error('No build found')
            return
        }
        // update the build event
        for (let i = 0; i < _build.events.length; i++) {
            if (_build.events[i].id === skill.id && _build.events[i].key === skill.key) {
                _build.events[i] = skill
                break
            }
        }
        localStorage.setItem(_build.id, JSON.stringify(_build))
        set({ build: _build })
    }
}))
