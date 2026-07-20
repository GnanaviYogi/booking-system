"use client";

import Particles from "react-tsparticles";

export default function ParticlesBackground() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0,
        },

        background: {
          color: {
            value: "#0f172a",
          },
        },

        fpsLimit: 60,

        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },

            resize: true,
          },

          modes: {
            grab: {
              distance: 150,
              links: {
                opacity: 0.5,
              },
            },
          },
        },

        particles: {
          color: {
            value: "#60a5fa",
          },

          links: {
            color: "#60a5fa",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },

          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            outModes: {
              default: "bounce",
            },
          },

          number: {
            density: {
              enable: true,
            },
            value: 70,
          },

          opacity: {
            value: 0.5,
          },

          shape: {
            type: "circle",
          },

          size: {
            value: {
              min: 2,
              max: 5,
            },
          },
        },

        detectRetina: true,
      }}
    />
  );
}
