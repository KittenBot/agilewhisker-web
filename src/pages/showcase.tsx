import clsx from "clsx";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./showcase.module.css";
import { useEffect, useRef } from "react";
// import { Col, Row, Slider } from 'antd';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import React from "react";

const closSvg = <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 5.01953L4.99988 19.0196" stroke="white" stroke-opacity="0.79" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 5.01953L19.0001 19.0196" stroke="white" stroke-opacity="0.79" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

const openSvg = <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5.01953V19.0195" stroke="white" stroke-opacity="0.79" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12.0195H19" stroke="white" stroke-opacity="0.79" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


const productPng = [
  {
    svg: '../../img/Rectangle93.png',
    dec: 'AgileWhisker Elite'
  },
  {
    svg: '../../img/Rectangle94.png',
    dec: 'AgileWhisker Keypad-Base'
  },
  {
    svg: '../../img/Rectangle95.png',
    dec: 'Jacdac Modules'
  }
]
const secondPng = [
  {
    svg: '../../img/gif_1.gif',
    dec: 'Drive peripherals and create a sense of atmosphere'
  },
  {
    svg: '../../img/gif_2.gif',
    dec: 'Interesting computer interaction, your imagination is unlimited'
  },
  {
    svg: '../../img/gif_3.gif',
    dec: 'PC events, such as an email reminder'
  },
  {
    svg: '../../img/gif_4.gif',
    dec: 'Home assistant'
  },
]
const thirdPng = [
  {
    svg: '../../img/jacdac1.png',
    Text: {
      h1: 'Richly Customizable <br /> Peripherals',
      line: "Experience a wealth of peripherals, simple connections. With Microsoft's latest Jacdac protocol and bus-style connections, there's no fuss about underlying hardware."
    },
    position: 'left'
  },
  {
    svg: '../../img/Rectangle92.png',
    Text: {
      h1: 'Programming in TypeScript',
      line: "Using TypeScript, you can program and reprogram every aspect of the keyboard's hardware. From custom macros to specific workflow actions, tailor every keystroke to fit your unique needs."
    },
    position: 'right'
  },
  {
    svg: '../../img/iot.png',
    Text: {
      h1: 'IoT Interface',
      line: "Embracing IoT, we've introduced an IoT interface. Quickly send MQTT messages via the keyboard to interact with your DIY smart home."
    },
    position: 'left'
  },
  {
    svg: '../../img/coomu.png',
    Text: {
      h1: 'Open Source',
      line: "Hardware and software, fully open source. We empower users by giving back the rights to define their personal input devices."
    },
    position: 'right'
  }
]
const text = `
Hardware and software, fully open source. We empower users by giving back the rights to define their personal input devices.
`;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: 'What is AgileWhisker？',
    children: <p>AgileWhisker is set of revolutionary PC peripheral widgets that can be programmed with JavaScript.</p>,
  },
  {
    key: '2',
    label: 'Who is this keyboard suitable for?',
    children: <p>Keyboard user enthusiasts who want to try a new keyboard interactive experience
    In-depth users of TypeScript who want to try TypeScript to control the keyboard and its hardware</p>,
  },
  {
    key: '3',
    label: 'How to join this project and become a member of community?',
    children: <ul style={{fontSize:'18px'}}>
      <li>As an ordinary user, you can provide us with more interesting application scenarios and electronic module requirements. Or experience our SKILL on the website, we very much welcome your valuable opinions.</li>
      <li>As a light developer, you can submit your unique SKILL on our website. Writing SKILL is very simple. Follow the format of our tutorial document, write the Markdown document, and initiate a PR request to our github repository.</li>
      <li>As an in-depth developer, you can join in the underlying development of our hardware and software, and build your development environment according to our development documents. The building process is very simple.</li>
    </ul>,
  },
  {
    key: '4',
    label: 'What is the main control chip of the keyboard? How to update firmware?',
    children: <p>The main control chip used in the keyboard is RP2040, and the firmware generally does not need to be upgraded unless there is a major update. There is a BOOT button behind the keyboard. Connect the computer and keyboard through the data cable. Press and hold the BOOT button again and release it after 3 seconds. A "RPI-RP2" USB flash drive will appear on the computer. Then drag the upgraded UF2 file to the USB flash drive. to complete the upgrade.</p>,
  },
  {
    key: '5',
    label: 'Does this keyboard support Bluetooth or 2.4G?',
    children: <p>Currently, only USB single-mode connection is supported. In the future, there will be plans to launch multi-mode connection with product iteration.</p>,
  },
];


export default function Showcase(): JSX.Element {
  // const videoRef = useRef<HTMLVideoElement>(null);
  // useEffect(() => {
  //   const video = videoRef.current;
  //   video.addEventListener("loadeddata", function () {
  //     console.log('come on');
  //     video.play();
  //     function render() {
  //       requestAnimationFrame(render);
  //     }
  //     render();
  //   });
  //   video.addEventListener("error", function () {
  //     console.error("视频加载失败");
  //   });
  // }, []);
  const scrollDownId = styles.scrollDown
  useEffect(()=>{
    const handleScroll = ()=>{
      const targetDiv = document.getElementById(scrollDownId)
      if (!targetDiv) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const opacity = 1 - (scrollTop / 100);
      targetDiv.style.opacity = opacity.toFixed(2);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  },[])
  return (
    <div>
      <div id={scrollDownId}>
        <div className={styles.chevron}/>
        <div className={styles.chevron}/>
        <div className={styles.chevron}/>
        <span id={styles.scrollText}>Scroll down</span>
      </div>
      <div className={styles.container}>
        <div className={styles.showcase}>
          {/* ref={videoRef} */}
          <video className={styles.video} loop muted preload="auto" autoPlay poster="../../img/screenPic.jpg">
            <source src="../../img/video.mp4" type="video/mp4" />
          </video>
          <div className={styles.showtext}>
            <h1>
              The Fully Programmable Keyboard
            </h1>
            <p>
              Every Keystroke, A Support for &nbsp;
              <span style={{ color: "#E8D975" }}>I</span>
              <span style={{ color: "#E8D975" }}>n</span>
              <span style={{ color: "#E8D975" }}>n</span>
              <span style={{ color: "#D1DD82" }}>o</span>
              <span style={{ color: "#8CE9A9" }}>v</span>
              <span style={{ color: "#75EDB6" }}>a</span>
              <span style={{ color: "#5EF1C3" }}>t</span>
              <span style={{ color: "#47F5D0" }}>i</span>
              <span style={{ color: "#30F9DD" }}>o</span>
              <span style={{ color: "#19FDEA" }}>n</span>
            </p>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.product}>
            <div>
              <h1>
                Meet <span>AgileWhisker</span>: A fully customizable{" "}
              </h1>
              <h1> PC Peripheral product </h1>
            </div>
            <div className={styles.textdesc}>
              <span>
                Is keyboard innovation just about swapping keycaps or cases?{" "}
              </span>
              <br />
              <span>
                Is it merely about upgrading to triple modes, adding screens, or
                knobs?
              </span>
              <br />
              <span>
                Let's redefine what a custom keyboard can be. It's about
                returning the power of definition to the users. It's about
              </span>
              <br />
              <span>
                lowering the barriers in both hardware and software, allowing
                anyone to easily master keyboard creation skills. Let's
              </span>
              <br />
              <span>
                make custom keyboards fun and efficient companions in life and
                work.
              </span>
            </div>
          </div>
          <div className={styles.overview}>
            <button>
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 17.0195L15.5 12.0195L10.5 7.01953"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.3 12.0195H3.5M12.5 22.0195C15.1522 22.0195 17.6957 20.966 19.5711 19.0906C21.4464 17.2152 22.5 14.6717 22.5 12.0195C22.5 9.36737 21.4464 6.82383 19.5711 4.94846C17.6957 3.0731 15.1522 2.01953 12.5 2.01953"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Overview
            </button>
          </div>
          <div className={styles.picturegallery}>
            {
              productPng.map((item,key)=>(
                <div key={key}>
                  <img src={item.svg as any} alt="" />
                  <p>{item.dec}</p>
                </div>
              ))
            }
          </div>
        </div>
        <div className={styles.lightLine}/>
        <div className={clsx(styles.wrapper)}>
          <div className={styles.secondtitle}>
            <h1>Unleash Your <span>Creativity</span></h1>
            <div className={styles.secondtext}>
              <p>You can experience various interactive experiments in our demo</p>
              <p>community, or you can customize creations using typescript</p>
            </div>
          </div>
          <div className={clsx(styles.secondpicturegallery)}>
            {
              secondPng.map((item,key) =>(
                <div className={styles.masks}>
                  <img src={item.svg as any} alt="" />
                  <div style={{position:'absolute'}} className={styles.mask}>{item.dec}</div>
                </div>
              ))
            }
          </div>
        </div>
        <div className={styles.lightLine}/>
        {
          thirdPng.map((item,index)=>(
            <div className={styles.wrapper} style={{border:'none',paddingTop:index!==0?'0':'120px'}}>
              <div className={styles.card} style={{flexDirection: `${item.position === 'right' ? 'row-reverse' : 'row'}`}}>
                <div className={styles.cardimg}><img src={item.svg} width={'100%'} height={'100%'} /></div>
                <div className={styles.cardtext}>
                  <h1 dangerouslySetInnerHTML={{ __html:item.Text.h1 }}/>
                  <p>{item.Text.line}</p>
                </div>
              </div>
            </div>
          ))
        }
        <div className={styles.lightLine}/>
        <div className={styles.fourthcontainer}>
          <div>
            <h1>Maximize <span>Productivity</span></h1>
            <p>
              Our web-based SKILL platform allows users to browse and customize 
            </p>
            <p>
            effortlessly, ditching all connection software. Change SKILL as you wish.
            </p>
          </div>
          <button className={styles.github}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 13.0601C0 14.1476 0.102 15.1316 0.30525 16.0113C0.5085 16.8918 0.7905 17.6568 1.1505 18.3056C1.50975 18.9551 1.968 19.5266 2.523 20.0193C3.07875 20.5121 3.681 20.9148 4.3305 21.2283C4.98 21.5411 5.721 21.7953 6.55425 21.9911C7.3875 22.1868 8.23875 22.3233 9.10725 22.4021C9.97575 22.4801 10.9298 22.5191 11.9708 22.5191C13.0192 22.5191 13.9777 22.4801 14.8463 22.4021C15.7148 22.3233 16.5675 22.1868 17.4045 21.9911C18.2415 21.7953 18.987 21.5411 19.6403 21.2283C20.2935 20.9148 20.8995 20.5121 21.459 20.0193C22.0185 19.5266 22.4805 18.9551 22.8442 18.3056C23.208 17.6568 23.4915 16.8918 23.6947 16.0113C23.898 15.1316 24 14.1476 24 13.0601C24 11.1198 23.3505 9.44134 22.0522 8.02534C22.122 7.83709 22.1865 7.62409 22.2458 7.38559C22.3042 7.14709 22.359 6.80659 22.41 6.36484C22.461 5.92234 22.4415 5.41234 22.3515 4.83334C22.2615 4.25434 22.095 3.66334 21.852 3.06109L21.6765 3.02584C21.5513 3.00259 21.3458 3.00784 21.06 3.04309C20.7743 3.07834 20.442 3.14884 20.0625 3.25459C19.683 3.36034 19.194 3.56359 18.5955 3.86509C17.997 4.16584 17.3655 4.54384 16.7003 4.99759C15.558 4.68409 13.989 4.52809 11.994 4.52809C10.0065 4.52809 8.442 4.68409 7.29975 4.99759C6.6345 4.54384 5.99925 4.16584 5.3925 3.86509C4.7865 3.56359 4.3035 3.36034 3.9435 3.25459C3.5835 3.14884 3.24675 3.08059 2.934 3.04909C2.62125 3.01759 2.42325 3.00784 2.3415 3.01984C2.259 3.03184 2.1945 3.04534 2.148 3.06109C1.905 3.66334 1.7385 4.25359 1.64925 4.83334C1.55925 5.41234 1.53975 5.92234 1.59 6.36484C1.641 6.80659 1.69575 7.14709 1.75425 7.38559C1.8135 7.62409 1.878 7.83709 1.9485 8.02534C0.6495 9.44134 0 11.1198 0 13.0601ZM2.946 16.0053C2.946 14.8788 3.45825 13.8461 4.4835 12.9071C4.788 12.6258 5.14425 12.4128 5.55075 12.2673C5.958 12.1233 6.41775 12.0408 6.93 12.0213C7.44225 12.0018 7.9335 12.0056 8.403 12.0333C8.8725 12.0603 9.4515 12.0978 10.14 12.1443C10.8285 12.1916 11.4233 12.2148 11.9235 12.2148C12.4245 12.2148 13.0192 12.1916 13.7078 12.1443C14.3963 12.0978 14.9753 12.0603 15.4447 12.0333C15.9143 12.0056 16.4047 12.0018 16.917 12.0213C17.43 12.0408 17.8897 12.1233 18.2962 12.2673C18.7035 12.4121 19.059 12.6258 19.3643 12.9071C20.3895 13.8303 20.9017 14.8631 20.9017 16.0053C20.9017 16.6788 20.8177 17.2751 20.649 17.7956C20.481 18.3161 20.2658 18.7518 20.004 19.1043C19.7415 19.4561 19.3777 19.7553 18.9128 20.0021C18.447 20.2481 17.9932 20.4378 17.5507 20.5713C17.109 20.7041 16.542 20.8076 15.849 20.8818C15.1567 20.9561 14.5387 21.0011 13.995 21.0168C13.4513 21.0326 12.7605 21.0408 11.9235 21.0408C11.0865 21.0408 10.3958 21.0326 9.852 21.0168C9.30825 21.0011 8.69025 20.9561 7.998 20.8818C7.30575 20.8076 6.73875 20.7041 6.29625 20.5713C5.8545 20.4378 5.40075 20.2481 4.935 20.0021C4.46925 19.7553 4.1055 19.4561 3.84375 19.1043C3.58125 18.7518 3.366 18.3161 3.198 17.7956C3.03 17.2751 2.946 16.6788 2.946 16.0053ZM15 15.7691C15 16.3658 15.158 16.9381 15.4393 17.3601C15.7206 17.782 16.1022 18.0191 16.5 18.0191C16.8978 18.0191 17.2794 17.782 17.5607 17.3601C17.842 16.9381 18 16.3658 18 15.7691C18 15.1724 17.842 14.6001 17.5607 14.1781C17.2794 13.7561 16.8978 13.5191 16.5 13.5191C16.1022 13.5191 15.7206 13.7561 15.4393 14.1781C15.158 14.6001 15 15.1724 15 15.7691ZM6 15.7691C6 16.3658 6.15804 16.9381 6.43934 17.3601C6.72064 17.782 7.10218 18.0191 7.5 18.0191C7.89782 18.0191 8.27936 17.782 8.56066 17.3601C8.84196 16.9381 9 16.3658 9 15.7691C9 15.4736 8.9612 15.181 8.88582 14.9081C8.81044 14.6351 8.69995 14.387 8.56066 14.1781C8.42137 13.9692 8.25601 13.8034 8.07403 13.6904C7.89204 13.5773 7.69698 13.5191 7.5 13.5191C7.30302 13.5191 7.10796 13.5773 6.92597 13.6904C6.74399 13.8034 6.57863 13.9692 6.43934 14.1781C6.15804 14.6001 6 15.1724 6 15.7691Z" fill="white"/>
              </svg>
              Github
          </button>
          <img src="../../img/Maskgroup.png" alt="" />
        </div>
        <div className={styles.wrapper}>
          <h1>
            Frequently Asked Questions
          </h1>
          <div className={styles.collapse}>
            <Collapse 
              defaultActiveKey={['1']} 
              accordion
              // onChange={onChange}
              ghost 
              items={items}
              expandIconPosition={'end'}
              expandIcon={({ isActive }) =>isActive ? closSvg : openSvg }
            />
          </div>
          <div className={styles.discussions}>
            Want to support us and join our discussions?
          </div>
          <div className={styles.link}>
            <button className={styles.discord}>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5196C21.0034 12.8394 20.6951 14.1414 20.1 15.3196C19.3944 16.7313 18.3098 17.9187 16.9674 18.7488C15.6251 19.5789 14.0782 20.0189 12.5 20.0196C11.1801 20.023 9.87812 19.7146 8.7 19.1196L3 21.0196L4.9 15.3196C4.30493 14.1414 3.99656 12.8394 4 11.5196C4.00061 9.94132 4.44061 8.39441 5.27072 7.05211C6.10083 5.70981 7.28825 4.62513 8.7 3.91956C9.87812 3.32449 11.1801 3.01612 12.5 3.01956H13C15.0843 3.13455 17.053 4.01432 18.5291 5.49042C20.0052 6.96652 20.885 8.93521 21 11.0196V11.5196Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

              Discord
            </button>
            {/* <button className={styles.github}>
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 13.0601C0 14.1476 0.102 15.1316 0.30525 16.0113C0.5085 16.8918 0.7905 17.6568 1.1505 18.3056C1.50975 18.9551 1.968 19.5266 2.523 20.0193C3.07875 20.5121 3.681 20.9148 4.3305 21.2283C4.98 21.5411 5.721 21.7953 6.55425 21.9911C7.3875 22.1868 8.23875 22.3233 9.10725 22.4021C9.97575 22.4801 10.9298 22.5191 11.9708 22.5191C13.0192 22.5191 13.9777 22.4801 14.8463 22.4021C15.7148 22.3233 16.5675 22.1868 17.4045 21.9911C18.2415 21.7953 18.987 21.5411 19.6403 21.2283C20.2935 20.9148 20.8995 20.5121 21.459 20.0193C22.0185 19.5266 22.4805 18.9551 22.8442 18.3056C23.208 17.6568 23.4915 16.8918 23.6947 16.0113C23.898 15.1316 24 14.1476 24 13.0601C24 11.1198 23.3505 9.44134 22.0522 8.02534C22.122 7.83709 22.1865 7.62409 22.2458 7.38559C22.3042 7.14709 22.359 6.80659 22.41 6.36484C22.461 5.92234 22.4415 5.41234 22.3515 4.83334C22.2615 4.25434 22.095 3.66334 21.852 3.06109L21.6765 3.02584C21.5513 3.00259 21.3458 3.00784 21.06 3.04309C20.7743 3.07834 20.442 3.14884 20.0625 3.25459C19.683 3.36034 19.194 3.56359 18.5955 3.86509C17.997 4.16584 17.3655 4.54384 16.7003 4.99759C15.558 4.68409 13.989 4.52809 11.994 4.52809C10.0065 4.52809 8.442 4.68409 7.29975 4.99759C6.6345 4.54384 5.99925 4.16584 5.3925 3.86509C4.7865 3.56359 4.3035 3.36034 3.9435 3.25459C3.5835 3.14884 3.24675 3.08059 2.934 3.04909C2.62125 3.01759 2.42325 3.00784 2.3415 3.01984C2.259 3.03184 2.1945 3.04534 2.148 3.06109C1.905 3.66334 1.7385 4.25359 1.64925 4.83334C1.55925 5.41234 1.53975 5.92234 1.59 6.36484C1.641 6.80659 1.69575 7.14709 1.75425 7.38559C1.8135 7.62409 1.878 7.83709 1.9485 8.02534C0.6495 9.44134 0 11.1198 0 13.0601ZM2.946 16.0053C2.946 14.8788 3.45825 13.8461 4.4835 12.9071C4.788 12.6258 5.14425 12.4128 5.55075 12.2673C5.958 12.1233 6.41775 12.0408 6.93 12.0213C7.44225 12.0018 7.9335 12.0056 8.403 12.0333C8.8725 12.0603 9.4515 12.0978 10.14 12.1443C10.8285 12.1916 11.4233 12.2148 11.9235 12.2148C12.4245 12.2148 13.0192 12.1916 13.7078 12.1443C14.3963 12.0978 14.9753 12.0603 15.4447 12.0333C15.9143 12.0056 16.4047 12.0018 16.917 12.0213C17.43 12.0408 17.8897 12.1233 18.2962 12.2673C18.7035 12.4121 19.059 12.6258 19.3643 12.9071C20.3895 13.8303 20.9017 14.8631 20.9017 16.0053C20.9017 16.6788 20.8177 17.2751 20.649 17.7956C20.481 18.3161 20.2658 18.7518 20.004 19.1043C19.7415 19.4561 19.3777 19.7553 18.9128 20.0021C18.447 20.2481 17.9932 20.4378 17.5507 20.5713C17.109 20.7041 16.542 20.8076 15.849 20.8818C15.1567 20.9561 14.5387 21.0011 13.995 21.0168C13.4513 21.0326 12.7605 21.0408 11.9235 21.0408C11.0865 21.0408 10.3958 21.0326 9.852 21.0168C9.30825 21.0011 8.69025 20.9561 7.998 20.8818C7.30575 20.8076 6.73875 20.7041 6.29625 20.5713C5.8545 20.4378 5.40075 20.2481 4.935 20.0021C4.46925 19.7553 4.1055 19.4561 3.84375 19.1043C3.58125 18.7518 3.366 18.3161 3.198 17.7956C3.03 17.2751 2.946 16.6788 2.946 16.0053ZM15 15.7691C15 16.3658 15.158 16.9381 15.4393 17.3601C15.7206 17.782 16.1022 18.0191 16.5 18.0191C16.8978 18.0191 17.2794 17.782 17.5607 17.3601C17.842 16.9381 18 16.3658 18 15.7691C18 15.1724 17.842 14.6001 17.5607 14.1781C17.2794 13.7561 16.8978 13.5191 16.5 13.5191C16.1022 13.5191 15.7206 13.7561 15.4393 14.1781C15.158 14.6001 15 15.1724 15 15.7691ZM6 15.7691C6 16.3658 6.15804 16.9381 6.43934 17.3601C6.72064 17.782 7.10218 18.0191 7.5 18.0191C7.89782 18.0191 8.27936 17.782 8.56066 17.3601C8.84196 16.9381 9 16.3658 9 15.7691C9 15.4736 8.9612 15.181 8.88582 14.9081C8.81044 14.6351 8.69995 14.387 8.56066 14.1781C8.42137 13.9692 8.25601 13.8034 8.07403 13.6904C7.89204 13.5773 7.69698 13.5191 7.5 13.5191C7.30302 13.5191 7.10796 13.5773 6.92597 13.6904C6.74399 13.8034 6.57863 13.9692 6.43934 14.1781C6.15804 14.6001 6 15.1724 6 15.7691Z" fill="white"/>
              </svg>
              Github
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
