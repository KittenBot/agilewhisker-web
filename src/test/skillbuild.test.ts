import fs from 'fs-extra'
import SkillBuild from '../lib/SkillBuild'

test('SkillButton', async () => {
  const _txt = fs.readFileSync('src/test/testskill.js', 'utf-8')
  const _skill = await SkillBuild(_txt)
  console.log(_skill)
})