import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

import Image from 'next/image'

import { hightlightsSlides } from '@/constants'
import { pauseImg, playImg, replayImg } from '@/lib'

gsap.registerPlugin(ScrollTrigger)

const VideoCarousel = () => {
  const videoRef: MutableRefObject<(HTMLVideoElement | null)[]> = useRef([])
  const videoSpanRef: MutableRefObject<(HTMLSpanElement | null)[]> = useRef([])
  const videoDivRef: MutableRefObject<(HTMLDivElement | null)[]> = useRef([])

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false
  })

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video

  useGSAP(() => {
    // slider animation to move the video out of the screen and bring the next video in
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: 'power2.inOut' // show visualizer https://gsap.com/docs/v3/Eases
    })
    // video animation to play the video when it is in the view
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none'
      },
      onComplete: () => {
        setVideo(pre => ({
          ...pre,
          startPlay: true,
          isPlaying: true
        }))
      }
    })
  }, [isEnd, videoId])

  useEffect(() => {
    if (videoRef.current.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause()
      } else {
        startPlay && videoRef.current[videoId]?.play()
      }
    }
  }, [startPlay, videoId, isPlaying])

  useEffect(() => {
    let currentProgress = 0
    let span = videoSpanRef.current

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // get the progress of the video
          const progress = Math.ceil(anim.progress() * 100)

          if (progress !== currentProgress) {
            currentProgress = progress

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '10vw' // mobile
                  : window.innerWidth < 1200
                    ? '10vw' // tablet
                    : '4vw' // laptop
            })

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white'
            })
          }
        },

        // when the video is ended, replace the progress bar with the indicator and change the background color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px'
            })
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf'
            })
          }
        }
      })
      if (videoId == 0) {
        anim.restart()
      }

      // update the progress bar
      const animUpdate = () => {
        const currentVideo = videoRef.current[videoId]
        if (currentVideo) {
          anim.progress(
            currentVideo.currentTime / hightlightsSlides[videoId].videoDuration
          )
        }
      }

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate)
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate)
      }
    }
  }, [videoId, startPlay, isPlaying])

  const handleProcess = (type: string, index: number) => {
    switch (type) {
      case 'video-end':
        setVideo(prev => ({ ...prev, isEnd: true, videoId: index + 1 }))
        break
      case 'video-last':
        setVideo(prev => ({ ...prev, isLastVideo: true }))
        break
      case 'video-reset':
        setVideo(prev => ({ ...prev, isLastVideo: false, videoId: 0 }))
        break
      case 'play':
        setVideo(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
        break
      case 'pause':
        setVideo(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
        break

      default:
        return video
    }
  }

  return (
    <>
      <div className='flex items-center'>
        {hightlightsSlides.map((slide, index) => (
          <div className='pr-10 sm:pr-20' key={slide.id} id='slider'>
            <div className='video-carousel_container'>
              <div className='flex-center h-full w-full overflow-hidden rounded-xl bg-black '>
                <video
                  id='video'
                  playsInline={true}
                  className={`${
                    slide.id === 1 && 'translate-x-44'
                  } pointer-events-none`}
                  muted
                  preload='auto'
                  ref={e => (videoRef.current[index] = e)}
                  onPlay={() => {
                    setVideo(prevVideo => ({ ...prevVideo, isPlaying: true }))
                  }}
                  onEnded={() =>
                    index !== hightlightsSlides.length - 1
                      ? handleProcess('video-end', index)
                      : handleProcess('video-last', index)
                  }
                >
                  <source src={slide.video} type='video/mp4' />
                </video>
              </div>

              <div className='absolute left-[5%] top-12 z-10 '>
                {slide.textLists.map(text => (
                  <p className='text-xl font-medium md:text-2xl' key={text}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex-center relative mt-10'>
        <div className='flex-center rounded-full bg-gray-300 px-7 py-5 backdrop-blur'>
          {videoRef.current.map((_, index) => (
            <div
              key={index}
              ref={e => (videoDivRef.current[index] = e)}
              className='relative mx-2 h-3 w-3 cursor-pointer rounded-full bg-gray-200'
            >
              <span
                className='absolute h-full w-full rounded-full '
                ref={e => (videoSpanRef.current[index] = e)}
              />
            </div>
          ))}
        </div>
        <button className='control-btn'>
          <Image
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset', 0)
                : !isPlaying
                  ? () => handleProcess('play', 0)
                  : () => handleProcess('pause', 0)
            }
          />
        </button>
      </div>
    </>
  )
}

export default VideoCarousel
