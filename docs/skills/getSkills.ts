type skillType = {
  docId : string
  href : string
  label : string
  type : string
  unlisted : boolean
}

const skills =  (items:skillType[])=>{
  return new Promise(async(resolve)=>{
    const skillsJson = []
    const getSkills = async()=>{
      const skillItems = items
      for(let i = 0;i<skillItems.length;i++){
        const folder = skillItems[i].href.split('/')[3]
        const json = await import(`./${folder}/skill.json`)

        skillsJson.push({...json.default,href:skillItems[i].href})
      }
      
      return skillsJson
    }
    resolve(await getSkills()) 
  })
}



export default skills