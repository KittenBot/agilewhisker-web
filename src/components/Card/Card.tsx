import React from 'react'
import styles from './card.module.css'
import {UserOutlined} from '@ant-design/icons'

const Card = ({href,image,title,describe,author}:{href:string,image:string,title:string,describe:string,author:string})=>{
  return (
    <div id={styles.cardBox}>
      <a id={styles.cardBg} href={href}>
        <div id={styles.cardContainer}>
          <div id={styles.cardHeader} style={{marginBottom:'0'}}>
            <img id={styles.cardIcon} src={`../../img/${image}`} alt=''/>
            <div id={styles.cardInfo}>
              <h1>{title}</h1>
              <div id={styles.cardAuthor}><UserOutlined />{author}</div>
            </div>
          </div>
          <div id={styles.cardContent}>{describe}</div>
        </div>
      </a>
    </div>
  )
}

export default Card