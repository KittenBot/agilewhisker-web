import React, { useEffect, useState } from 'react'
import styles from './card.module.css'
import {useCurrentSidebarCategory} from '@docusaurus/theme-common'
import Card from './Card'

export default function Cards({getSkills}): JSX.Element {
  const [skills,setSkills] = useState([])
  const [loading,setLoading] = useState(true)
  
  const items = useCurrentSidebarCategory().items
    
  getSkills&&loading&&getSkills(items).then(allSkills=>{
    setSkills(allSkills)
    setLoading(false)
  })
  
  return (
    <div id={styles.cardsBox}>
      {skills.map(skill=>{
        const newKey = skill.name+(Math.random()*100).toFixed(6)
        return <Card key={newKey} href={skill.href} image={skill.img} title={skill.title} describe={skill.describe} author={skill.author} />
      })}
    </div>
  )
}