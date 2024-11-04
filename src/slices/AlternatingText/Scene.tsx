"use client"

import FloatingCan from '@/components/FloatingCan';
import { Environment } from '@react-three/drei';
import { useRef } from 'react'
import { Group } from 'three';
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {}

export default function Scene({}: Props) {
    const canRef = useRef<Group>(null)

    const bgColours = [ "#f5bcd5", "#afef9a"]

    const isDesktop = useMediaQuery("(min-width: 768px)", true);



    useGSAP(() =>{
      if (!canRef.current) return

      const sections = gsap.utils.toArray(".alternating-section")

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".alternating-text-view",
          endTrigger: ".alternating-text-container",
          pin: true,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      })

      sections.forEach((_, index)=>{
        if(!canRef.current) return;
        if(index === 0) return;

        const isOdd = index % 2 !== 0;

        {/* If isDektop is true, moves left to right otherwise can stays in the central position. */}
        const xPosition = isDesktop ? ( isOdd ? "-1" : "1") : 0;
        const yRotation = isDesktop ? ( isOdd ? "0.4" : "-0.4") : 0;
        {/* Can animation*/}
        
        scrollTl
          .to(canRef.current.position, {
            x: xPosition,
            ease: "circ.inOut",
            delay: 0.5,
          })
          .to(
            canRef.current.rotation, 
            {
              y: yRotation,
              ease: "back.inOut",
            },
            "<",
          )
        .to(".alternating-text-container",{
          backgroundColor: gsap.utils.wrap(bgColours, index),
        });
      });
    }, 
    { dependencies: [isDesktop] }
  );

    {/* Update ref; isDesktop can be -0.3, if not it can be 0. */}
  return (
    <group ref={canRef} position-x={isDesktop ? 1: 0} rotation-y={isDesktop ? -0.3 : 0}>
        <FloatingCan flavor="grape" floatSpeed={3} />
        <Environment files={"/hdr/lobby.hdr"}
        environmentIntensity={1.5} />
    </group>
  )
}