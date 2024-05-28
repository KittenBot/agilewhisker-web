import { SkillBuilder, SkillButton } from '../components/Builder/skill'

test('SkillButton', () => {
  const _builder = new SkillBuilder()
  const _btn = new SkillButton('id', 'name', {params: {}})
  _btn.build(_builder)
  const code = _builder.buildAll()
  console.log(code)
})