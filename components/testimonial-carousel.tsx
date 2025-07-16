"use client"

import { useState, useEffect } from "react"
import { Quote } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    content: "Working with my therapist has been transformative.",
    author: "Sarah a.",
    role: "Client for 8 months",
    image: "https://images.unsplash.com/photo-1581579438747-99ee7e39571d?q=80&w=2940&auto=format&fit=crop",
  },
  {
    content: "The support I've received here has helped me rediscover joy in my life.",
    author: "Michael T.",
    role: "Client for 1 year",
    image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=2071&auto=format&fit=crop",
  },
  {
    content: "The compassion and expertise of my therapist made all the difference.",
    author: "Elena R.",
    role: "Client for 6 months",
    image: "https://images.unsplash.com/photo-1593614201641-6f68ed4831c8?q=80&w=2787&auto=format&fit=crop",
  },
  {
    content: "Working with my therapist has been transformative.",
    author: "Sarah b.",
    role: "Client for 8 months",
    image: "https://images.unsplash.com/photo-1581579438747-99ee7e39571d?q=80&w=2940&auto=format&fit=crop",
  },
  {
    content: "Working with my therapist has been transformative.",
    author: "Sarah .",
    role: "Client for 8 months",
    image: "https://images.unsplash.com/photo-1581579438747-99ee7e39571d?q=80&w=2940&auto=format&fit=crop",
  },
]


export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'left'|'right'>('right')

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('right')
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToPrev = () => {
    setDirection('left')
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setDirection('right')
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  // Helper function to determine card visibility and position
  const getCardStyle = (index: number) => {
    const isCurrent = index === current
    const isPrev = index === (current - 1 + testimonials.length) % testimonials.length
    const isNext = index === (current + 1) % testimonials.length
    
    if (isCurrent) {
      return {
        translateX: '-50%',
        opacity: 1,
        zIndex: 30,
        scale: 1,
        pointerEvents: 'auto' as const,
        visible: true
      }
    } 
    else if (isPrev) {
      return {
        translateX: '-120%',
        opacity: 0.7,
        zIndex: 20,
        scale: 0.85,
        pointerEvents: 'none' as const,
        visible: true
      }
    }
    else if (isNext) {
      return {
        translateX: '20%',
        opacity: 0.7,
        zIndex: 20,
        scale: 0.85,
        pointerEvents: 'none' as const,
        visible: true
      }
    }
    else {
      // For non-visible cards, position them off-screen but still in DOM
      return {
        translateX: direction === 'right' ? '150%' : '-150%',
        opacity: 0,
        zIndex: 10,
        scale: 0.8,
        pointerEvents: 'none' as const,
        visible: false
      }
    }
  }

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-12">
      {/* Carousel container with fixed height */}
      <div className="relative h-[400px] md:h-[350px] overflow-hidden px-8 -mx-8">
        {testimonials.map((testimonial, index) => {
          const style = getCardStyle(index)
          
          return (
            <div
              key={index}
              className={`absolute top-0 left-1/2 w-full max-w-md transition-all duration-500 ease-in-out`}
              style={{
                zIndex: style.zIndex,
                opacity: style.opacity,
                transform: `translateX(${style.translateX}) scale(${style.scale})`,
                pointerEvents: style.pointerEvents,
              }}
            >
              <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 text-center">
                <div className="absolute top-8 left-8">
                  <Quote className="h-10 w-10 text-[#f4c9c8]/50" />
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-[#f4c9c8] shadow-md"
                  />
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-3">"{testimonial.content}"</blockquote>
                  <p className="font-semibold text-[#a98cc8]">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation arrows */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-40">
        <Button
          onClick={goToPrev}
          variant="outline"
          size="icon"
          className="rounded-full bg-[#ffe8e8] border-gray-200 hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-40">
        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="rounded-full bg-[#ffe8e8] border-gray-200 hover:bg-white"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${index === current ? "bg-[#a98cc8] w-6" : "bg-gray-300 w-2"}`}
            onClick={() => {
              setDirection(index > current ? 'right' : 'left')
              setCurrent(index)
            }}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// "use client"

// import { useState, useEffect } from "react"
// import { Quote } from "lucide-react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// const testimonials = [
//   {
//     content: "Working with my therapist has been transformative.",
//     author: "Sarah J.",
//     role: "Client for 8 months",
//     image: "https://images.unsplash.com/photo-1581579438747-99ee7e39571d?q=80&w=2940&auto=format&fit=crop",
//   },
//   {
//     content: "The support I've received here has helped me rediscover joy in my life.",
//     author: "Michael T.",
//     role: "Client for 1 year",
//     image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=2071&auto=format&fit=crop",
//   },
//   {
//     content: "The compassion and expertise of my therapist made all the difference.",
//     author: "Elena R.",
//     role: "Client for 6 months",
//     image: "https://images.unsplash.com/photo-1593614201641-6f68ed4831c8?q=80&w=2787&auto=format&fit=crop",
//   },
// ]

// // ... (previous imports remain the same)

// export default function TestimonialCarousel() {
//   const [current, setCurrent] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % testimonials.length)
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [])

//   const goToPrev = () => {
//     setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
//   }

//   const goToNext = () => {
//     setCurrent((prev) => (prev + 1) % testimonials.length)
//   }

//   return (
//     <div className="relative max-w-5xl mx-auto px-4 py-12">
//       {/* Carousel container with fixed height */}
//       <div className="relative h-[400px] md:h-[350px] overflow-visible px-8 -mx-8">

//         {testimonials.map((testimonial, index) => {
//           // Calculate position based on index relative to current
//           let position = ""
//           let zIndex = 0
//           let opacity = 0
//           let scale = 0.8
//           let translateX = "-50%"

//           // Current testimonial (center)
//           if (index === current) {
//             position = "left-1/2"
//             zIndex = 30
//             opacity = 1
//             scale = 1
//           }
//           // Previous testimonial (left)
//           else if (index === (current - 1 + testimonials.length) % testimonials.length) {
//             position = "left-1/2"
//             zIndex = 20
//             opacity = 0.7
//             scale = 0.85
//             translateX = "-120%"
//           }
//           // Next testimonial (right)
//           else if (index === (current + 1) % testimonials.length) {
//             position = "left-1/2"
//             zIndex = 20
//             opacity = 0.7
//             scale = 0.85
//             translateX = "20%"
//           }
//           // Hidden testimonials
//           else {
//             position = "left-1/2"
//             zIndex = 10
//             opacity = 0
//             scale = 0.7
//           }

//           return (
//             <div
//               key={index}
//               className={`absolute top-0 ${position} w-full max-w-md transition-all duration-500 ease-in-out`}
//               style={{
//                 zIndex: zIndex,
//                 opacity: opacity,
//                 transform: `translateX(${translateX}) scale(${scale})`,
//                 pointerEvents: index === current ? "auto" : "none",
//               }}
//             >
//               <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 text-center">
//                 <div className="absolute top-8 left-8">
//                   <Quote className="h-10 w-10 text-[#f4c9c8]/50" />
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <img
//                     src={testimonial.image || "/placeholder.svg"}
//                     alt={testimonial.author}
//                     className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-[#f4c9c8] shadow-md"
//                   />
//                   <blockquote className="text-lg md:text-xl text-gray-700 mb-3">"{testimonial.content}"</blockquote>
//                   <p className="font-semibold text-[#a98cc8]">{testimonial.author}</p>
//                   <p className="text-gray-500 text-sm">{testimonial.role}</p>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* Navigation arrows */}
//       <div className="absolute top-1/2 left-4 -translate-y-1/2 z-40">
//         <Button
//           onClick={goToPrev}
//           variant="outline"
//           size="icon"
//           className="rounded-full bg-white/80 border-gray-200 hover:bg-white"
//         >
//           <ChevronLeft className="h-5 w-5 text-gray-600" />
//         </Button>
//       </div>

//       <div className="absolute top-1/2 right-4 -translate-y-1/2 z-40">
//         <Button
//           onClick={goToNext}
//           variant="outline"
//           size="icon"
//           className="rounded-full bg-white/80 border-gray-200 hover:bg-white"
//         >
//           <ChevronRight className="h-5 w-5 text-gray-600" />
//         </Button>
//       </div>

//       {/* Navigation dots */}
//       <div className="flex justify-center mt-6 gap-2">
//         {testimonials.map((_, index) => (
//           <button
//             key={index}
//             className={`h-2 rounded-full transition-all ${index === current ? "bg-[#a98cc8] w-6" : "bg-gray-300 w-2"}`}
//             onClick={() => setCurrent(index)}
//             aria-label={`Go to testimonial ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }
