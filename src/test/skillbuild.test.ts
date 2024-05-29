import { Skill, SkillButton, SkillOpenUrl } from '../components/Builder/skill'

test('SkillButton', () => {
  const _openurl = new SkillOpenUrl('openurl', 'https://example.com')
  const _btn = new SkillButton('a', _openurl)
  const code = Skill.builder.buildAll()
  console.log(code)
})