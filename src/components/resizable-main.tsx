import { useEffect, useMemo, useRef, useState } from 'react'
import { Database, Maximize, Minimize, SquareTerminal, Wallpaper } from 'lucide-react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Card } from './ui/card'
import { Avatar, AvatarImage } from './ui/avatar'
// import GradualBlurMemo from './ui/gradual-blur'
import { VideoPopOver } from './video-popover'
import { TextRoll } from './ui/skiper-ui/skiper58'
import Dock from './Dock'
import { Spinner } from './ui/spinner'
import { ModeToggle } from './mode-toggle'

type SectionId = 'visuals' | 'projects'

type WorkItem = {
   id: string
   section: SectionId
   category: string
   title: string
   image: string
   video?: string
   thumbnail?: string
   alt: string
   description: string
   embedUrl?: string
   tags: Array<{
      label: string
      icon: React.FC<React.SVGProps<SVGSVGElement>>
   }>
   aspectRatio: number
}

const FigmaIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
   >
      <path d='M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z' />
      <path d='M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z' />
      <path d='M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z' />
      <path d='M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z' />
      <path d='M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z' />
   </svg>
)

const ReactIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M12,10.11A1.87,1.87,0,1,1,10.13,12,1.88,1.88,0,0,1,12,10.11M7.37,20c.63.38,2-.2,3.6-1.7a24.22,24.22,0,0,1-1.51-1.9A22.7,22.7,0,0,1,7.06,16c-.51,2.14-.32,3.61.31,4m.71-5.74-.29-.51a7.91,7.91,0,0,0-.29.86c.27.06.57.11.88.16l-.3-.51m6.54-.76.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17,9,12.6,9,12,9s-1.17,0-1.71,0c-.29.47-.61.94-.91,1.47L8.57,12l.81,1.5c.3.53.62,1,.91,1.47.54,0,1.11,0,1.71,0s1.17,0,1.71,0c.29-.47.61-.94.91-1.47M12,6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0,10.44c.19-.22.39-.45.59-.72H11.41c.2.27.4.5.59.72M16.62,4c-.62-.38-2,.2-3.59,1.7a24.22,24.22,0,0,1,1.51,1.9,22.7,22.7,0,0,1,2.4.36c.51-2.14.32-3.61-.32-4m-.7,5.74.29.51a7.91,7.91,0,0,0,.29-.86c-.27-.06-.57-.11-.88-.16l.3.51m1.45-7c1.47.84,1.63,3.05,1,5.63,2.54.75,4.37,2,4.37,3.68s-1.83,2.93-4.37,3.68c.62,2.58.46,4.79-1,5.63s-3.45-.12-5.37-1.95c-1.92,1.83-3.91,2.79-5.38,1.95s-1.62-3-1-5.63c-2.54-.75-4.37-2-4.37-3.68S3.08,9.07,5.62,8.32c-.62-2.58-.46-4.79,1-5.63s3.46.12,5.38,1.95c1.92-1.83,3.91-2.79,5.37-1.95M17.08,12A22.51,22.51,0,0,1,18,14.26c2.1-.63,3.28-1.53,3.28-2.26S20.07,10.37,18,9.74A22.51,22.51,0,0,1,17.08,12M6.92,12A22.51,22.51,0,0,1,6,9.74c-2.1.63-3.28,1.53-3.28,2.26S3.93,13.63,6,14.26A22.51,22.51,0,0,1,6.92,12m9,2.26-.3.51c.31,0,.61-.1.88-.16a7.91,7.91,0,0,0-.29-.86l-.29.51M13,18.3c1.59,1.5,3,2.08,3.59,1.7s.83-1.82.32-4a22.7,22.7,0,0,1-2.4.36A24.22,24.22,0,0,1,13,18.3M8.08,9.74l.3-.51c-.31,0-.61.1-.88.16a7.91,7.91,0,0,0,.29.86l.29-.51M11,5.7C9.38,4.2,8,3.62,7.37,4s-.82,1.82-.31,4a22.7,22.7,0,0,1,2.4-.36A24.22,24.22,0,0,1,11,5.7Z' />
   </svg>
)

const TailwindIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='4 1 14 24' fill='currentColor' {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M12 6.036c-2.667 0-4.333 1.325-5 3.976 1-1.325 2.167-1.822 3.5-1.491.761.189 1.305.738 1.906 1.345C13.387 10.855 14.522 12 17 12c2.667 0 4.333-1.325 5-3.976-1 1.325-2.166 1.822-3.5 1.491-.761-.189-1.305-.738-1.907-1.345-.98-.99-2.114-2.134-4.593-2.134zM7 12c-2.667 0-4.333 1.325-5 3.976 1-1.326 2.167-1.822 3.5-1.491.761.189 1.305.738 1.907 1.345.98.989 2.115 2.134 4.594 2.134 2.667 0 4.333-1.325 5-3.976-1 1.325-2.167 1.822-3.5 1.491-.761-.189-1.305-.738-1.906-1.345C10.613 13.145 9.478 12 7 12z'
      />
   </svg>
)

const ExpoIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 0 1 1.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77z' />
   </svg>
)

const ConvexIcon = () => (
   <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='31 31.5 140 130'>
      <path
         d='M108.092 130.021C126.258 128.003 143.385 118.323 152.815 102.167C148.349 142.128 104.653 167.385 68.9858 151.878C65.6992 150.453 62.8702 148.082 60.9288 145.034C52.9134 132.448 50.2786 116.433 54.0644 101.899C64.881 120.567 86.8748 132.01 108.092 130.021Z'
         fill='currentColor'
      />
      <path
         d='M53.4012 90.1735C46.0375 107.191 45.7186 127.114 54.7463 143.51C22.9759 119.608 23.3226 68.4578 54.358 44.7949C57.2286 42.6078 60.64 41.3097 64.2178 41.1121C78.9312 40.336 93.8804 46.0225 104.364 56.6193C83.0637 56.831 62.318 70.4756 53.4012 90.1735Z'
         fill='currentColor'
      />
      <path
         d='M114.637 61.8552C103.89 46.8701 87.0686 36.6684 68.6387 36.358C104.264 20.1876 148.085 46.4045 152.856 85.1654C153.3 88.7635 152.717 92.4322 151.122 95.6775C144.466 109.195 132.124 119.679 117.702 123.559C128.269 103.96 126.965 80.0151 114.637 61.8552Z'
         fill='currentColor'
      />
   </svg>
)

const LaravelIcon = () => (
   <svg xmlns='http://www.w3.org/2000/svg' width='800px' height='800px' viewBox='0 0 58 49' fill='currentColor'>
      <path d='M49.626 11.564a.809.809 0 0 1 .028.209v10.972a.8.8 0 0 1-.402.694l-9.209 5.302V39.25c0 .286-.152.55-.4.694L20.42 51.01c-.044.025-.092.041-.14.058-.018.006-.035.017-.054.022a.805.805 0 0 1-.41 0c-.022-.006-.042-.018-.063-.026-.044-.016-.09-.03-.132-.054L.402 39.944A.801.801 0 0 1 0 39.25V6.334c0-.072.01-.142.028-.21.006-.023.02-.044.028-.067.015-.042.029-.085.051-.124.015-.026.037-.047.055-.071.023-.032.044-.065.071-.093.023-.023.053-.04.079-.06.029-.024.055-.05.088-.069h.001l9.61-5.533a.802.802 0 0 1 .8 0l9.61 5.533h.002c.032.02.059.045.088.068.026.02.055.038.078.06.028.029.048.062.072.094.017.024.04.045.054.071.023.04.036.082.052.124.008.023.022.044.028.068a.809.809 0 0 1 .028.209v20.559l8.008-4.611v-10.51c0-.07.01-.141.028-.208.007-.024.02-.045.028-.068.016-.042.03-.085.052-.124.015-.026.037-.047.054-.071.024-.032.044-.065.072-.093.023-.023.052-.04.078-.06.03-.024.056-.05.088-.069h.001l9.611-5.533a.801.801 0 0 1 .8 0l9.61 5.533c.034.02.06.045.09.068.025.02.054.038.077.06.028.029.048.062.072.094.018.024.04.045.054.071.023.039.036.082.052.124.009.023.022.044.028.068zm-1.574 10.718v-9.124l-3.363 1.936-4.646 2.675v9.124l8.01-4.611zm-9.61 16.505v-9.13l-4.57 2.61-13.05 7.448v9.216l17.62-10.144zM1.602 7.719v31.068L19.22 48.93v-9.214l-9.204-5.209-.003-.002-.004-.002c-.031-.018-.057-.044-.086-.066-.025-.02-.054-.036-.076-.058l-.002-.003c-.026-.025-.044-.056-.066-.084-.02-.027-.044-.05-.06-.078l-.001-.003c-.018-.03-.029-.066-.042-.1-.013-.03-.03-.058-.038-.09v-.001c-.01-.038-.012-.078-.016-.117-.004-.03-.012-.06-.012-.09v-.002-21.481L4.965 9.654 1.602 7.72zm8.81-5.994L2.405 6.334l8.005 4.609 8.006-4.61-8.006-4.608zm4.164 28.764l4.645-2.674V7.719l-3.363 1.936-4.646 2.675v20.096l3.364-1.937zM39.243 7.164l-8.006 4.609 8.006 4.609 8.005-4.61-8.005-4.608zm-.801 10.605l-4.646-2.675-3.363-1.936v9.124l4.645 2.674 3.364 1.937v-9.124zM20.02 38.33l11.743-6.704 5.87-3.35-8-4.606-9.211 5.303-8.395 4.833 7.993 4.524z' />
   </svg>
)

const IonicIcon = () => (
   <svg width='800px' height='800px' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg' fill='currentColor'>
      <g>
         <path d='M128.151659,0.00118559798 C148.92891,0.00118559798 168.492891,4.85546114 186.843602,14.2583047 L186.843602,14.2583047 L189.270142,15.4715749 L187.146919,17.1398213 C181.990521,21.2346081 177.895735,26.5426649 175.317536,32.6090156 L175.317536,32.6090156 L174.559242,34.2772621 L173.042654,33.5189682 C158.938389,26.8459825 143.924171,23.3578308 128.303318,23.3578308 C70.521327,23.3578308 23.6587678,70.3720488 23.6587678,128.002381 C23.6587678,185.632712 70.3696682,232.64693 128.151659,232.64693 C185.933649,232.64693 232.796209,185.632712 232.796209,128.002381 C232.796209,114.201433 230.218009,100.703802 224.758294,87.9644659 L224.758294,87.9644659 L224,86.2962194 L225.668246,85.5379256 C231.886256,83.2630441 237.345972,79.4715749 241.744076,74.6184943 L241.744076,74.6184943 L243.412322,72.4952716 L244.473934,74.9218119 C252.208531,91.7559351 256,109.65167 256,127.699063 C256,198.22039 198.521327,255.699063 128,255.699063 C57.478673,255.699063 0,198.22039 0,127.699063 C0,57.177736 57.478673,-0.300936964 128.151659,0.00118559798 Z M128.151659,69.7654137 C160.151659,69.7654137 186.388626,95.8507218 186.540284,128.154039 C186.540284,160.457357 160.454976,186.542665 128.151659,186.542665 C95.8483412,186.542665 69.7630332,160.457357 69.7630332,128.154039 C69.7630332,95.8507218 96,69.7654137 128.151659,69.7654137 Z M211.71564,21.5379256 C226.457193,21.5379256 238.407583,33.4883156 238.407583,48.2298687 C238.407583,62.9714219 226.457193,74.9218119 211.71564,74.9218119 C196.974087,74.9218119 185.023697,62.9714219 185.023697,48.2298687 C185.023697,33.4883156 196.974087,21.5379256 211.71564,21.5379256 Z'></path>
      </g>
   </svg>
)

const AngularIcon = () => (
   <svg width='800px' height='800px' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' fill='currentColor'>
      <path d='M24.826 23.885h-3.297l-1.777-4.377h-7.507l-1.777 4.379h-3.299l8.83-19.571zM15.999 1.004l-14.145 4.976 2.157 18.458 11.989 6.557 11.992-6.551 2.154-18.462-14.147-4.977zM13.414 16.806h5.171l-2.587-6.133z'></path>
   </svg>
)

const workItems: WorkItem[] = [
   {
      id: 'artsphere-layout',
      section: 'visuals',
      category: 'Layouts',
      title: 'ArtSphere',
      image: '/artsphere1.avif',
      thumbnail: '/artspherepreview.avif',
      alt: 'The ArtSphere thumbnail',
      description: 'The ArtSphere · School Project · 2024',
      embedUrl:
         'https://embed.figma.com/proto/zR7MV8n7ismhZS2bup8sMq/Virtual-Tour-App-for-Art-Gallery--Copy-?node-id=660-113&page-id=0%3A1&starting-point-node-id=660%3A113&scaling=scale-down-width&content-scaling=fixed&embed-host=share&hide-ui=1',
      tags: [{ label: 'Figma', icon: FigmaIcon }],
      aspectRatio: 16 / 10.4,
   },
   {
      id: 'slicehaus-layout',
      section: 'visuals',
      category: 'Layouts',
      title: 'Slicehaus',
      image: '/slicehaus1.avif',
      thumbnail: '/slicehauspreview.avif',
      alt: 'Slicehaus logo',
      description: 'Slicehaus · School Project · 2025',
      embedUrl:
         'https://embed.figma.com/proto/xuQnWFXgDs1Ilym2SvqmIl/Slicehaus--Community-?node-id=2003-22266&p=f&viewport=-144%2C-189%2C0.02&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=2003%3A22266&page-id=0%3A1&embed-host=share&hide-ui=1',
      tags: [{ label: 'Figma', icon: FigmaIcon }],
      aspectRatio: 16 / 10.4,
   },
   {
      id: 'bondbook-layout',
      section: 'visuals',
      category: 'Layouts',
      title: 'BondBook',
      image: '/bondbook1.avif',
      thumbnail: '/bondbookpreview.avif',
      alt: 'BondBook layout thumbnail',
      description: 'BondBook · School Project · 2024',
      embedUrl:
         'https://embed.figma.com/proto/QuentdTLxdNzwYDaEI2AL6/Pilar--John-Paul?node-id=943-2646&p=f&viewport=473%2C-79%2C0.09&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=943%3A2619&page-id=0%3A1&embed-host=share&hide-ui=1',
      tags: [{ label: 'Figma', icon: FigmaIcon }],
      aspectRatio: 9 / 18.4,
   },
   {
      id: 'technoday-poster',
      section: 'visuals',
      category: 'Posters',
      title: 'Technoday',
      image: '/technoday.avif',
      alt: 'Technoday poster thumbnail',
      description: 'Technoday · Event Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 1 / 1.41,
   },
   {
      id: 'whywait-poster',
      section: 'visuals',
      category: 'Posters',
      title: 'Why Wait?',
      image: '/whywait.avif',
      alt: 'Why Wait poster thumbnail',
      description: 'Why · Poster Design',
      tags: [
         { label: 'Figma', icon: FigmaIcon },
         { label: 'Photoshop', icon: Wallpaper },
      ],
      aspectRatio: 16 / 9,
   },
   {
      id: 'resto-artwork',
      section: 'visuals',
      category: 'Artworks',
      title: 'Resto',
      image: '/resto.avif',
      alt: 'Resto artwork thumbnail',
      description: 'Resto · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 16 / 9,
   },
   {
      id: 'jane-artwork',
      section: 'visuals',
      category: 'Artworks',
      title: 'Jane',
      image: '/jane9.avif',
      alt: 'Jane artwork thumbnail',
      description: 'Jane · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 16 / 9,
   },
   {
      id: 'mirror-artwork',
      section: 'visuals',
      category: 'Artworks',
      title: 'Mirror',
      image: '/neverhappened.avif',
      alt: 'Mirror artwork thumbnail',
      description: 'Mirror · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 2 / 3,
   },
   {
      id: 'juliana-artwork',
      section: 'visuals',
      category: 'Artworks',
      title: 'Juliana',
      image: '/juliana.avif',
      alt: 'Juliana artwork thumbnail',
      description: 'Juliana · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 2 / 3,
   },
   {
      id: 'varre-poster',
      section: 'visuals',
      category: 'Posters',
      title: 'Varre',
      image: '/whosbehindthemask.avif',
      alt: 'Varre poster thumbnail',
      description: "Who's Behind the Mask · School Project · Poster Design",
      tags: [
         { label: 'Figma', icon: FigmaIcon },
         { label: 'Photoshop', icon: Wallpaper },
      ],
      aspectRatio: 4 / 5,
   },
   {
      id: 'cleanrasdasdot-poster',
      section: 'visuals',
      category: 'Posters',
      title: 'Cleanrot',
      image: '/cleanrot7.avif',
      alt: 'Cleanrot poster thumbnail',
      description: 'Cleanrot · Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 9 / 16,
   },
   {
      id: 'eResq-app',
      section: 'projects',
      category: 'Systems',
      title: 'e-ResQ',
      image: '/eresq.avif',
      video: '/eresq.mp4',
      thumbnail: '/eresqsummary.mp4',
      alt: 'e-ResQ System thumbnail',
      description: 'e-ResQ · Best Capstone Project Award - Gold (Web Systems Technology) · 2025',
      tags: [
         { label: 'React', icon: ReactIcon },
         { label: 'Tailwind', icon: TailwindIcon },
         { label: 'Expo', icon: ExpoIcon },
         { label: 'Convex', icon: ConvexIcon },
      ],
      aspectRatio: 16 / 9,
   },
   {
      id: 'casa-app',
      section: 'projects',
      category: 'Systems',
      title: 'Booking System',
      image: '/casatmb.avif',
      video: '/casa.mp4',
      thumbnail: '/casapreview.mp4',
      alt: 'Booking System thumbnail',
      description: 'Casa Jedliana · OJT Project · 2026',
      tags: [
         { label: 'Laravel', icon: LaravelIcon },
         { label: 'React', icon: ReactIcon },
         { label: 'Tailwind', icon: TailwindIcon },
         { label: 'MySQL', icon: Database },
      ],
      aspectRatio: 16 / 10,
   },
   {
      id: 'ipundar-app',
      section: 'projects',
      category: 'Systems',
      title: 'Budgeting App',
      image: '/ipundar.avif',
      video: '/ipundar.mp4',
      thumbnail: '/ipundar.mp4',
      alt: 'Budgeting System thumbnail',
      description: 'iPundar · School Project · 2024',
      tags: [
         { label: 'Ionic', icon: IonicIcon },
         { label: 'Angular', icon: AngularIcon },
      ],
      aspectRatio: 9 / 18.5,
   },
]

const sections: Array<{ id: SectionId; label: string }> = [
   { id: 'visuals', label: 'Visuals' },
   { id: 'projects', label: 'Projects' },
]

function getDefaultItem(section: SectionId) {
   return workItems.find((item) => item.section === section) ?? workItems[0]
}

function getItemsByCategory(items: WorkItem[]) {
   return items.reduce<Record<string, WorkItem[]>>((categories, item) => {
      categories[item.category] = [...(categories[item.category] ?? []), item]
      return categories
   }, {})
}

function ItemPreview({ item }: { item: WorkItem }) {
   const isPortrait = item.aspectRatio < 1
   const [popOpen, setPopOpen] = useState(false)
   const [isLoaded, setIsLoaded] = useState(false)
   const [isFullscreen, setIsFullscreen] = useState(false)
   const iframeRef = useRef<HTMLIFrameElement>(null)
   const containerRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const handler = () => setIsFullscreen(!!document.fullscreenElement)
      document.addEventListener('fullscreenchange', handler)
      return () => document.removeEventListener('fullscreenchange', handler)
   }, [])

   useEffect(() => {
      if (!item.embedUrl) return
      setIsLoaded(false)

      const handler = (e: MessageEvent) => {
         if (e.origin !== 'https://www.figma.com') return
         if (e.data?.type === 'INITIAL_LOAD') {
            setTimeout(() => setIsLoaded(true), 300)
         }
      }

      window.addEventListener('message', handler)
      const fallback = setTimeout(() => setIsLoaded(true), 8000)

      return () => {
         window.removeEventListener('message', handler)
         clearTimeout(fallback)
      }
   }, [item.embedUrl])

   function toggleFullscreen() {
      const el = containerRef.current
      if (!el) return

      if (!document.fullscreenElement) {
         el.requestFullscreen?.()
      } else {
         document.exitFullscreen?.()
      }
   }

   if (item.video) {
      return (
         <div className='flex flex-col gap-4'>
            {isPortrait ? (
               <div className='flex justify-center' onClick={() => setPopOpen(true)}>
                  <div
                     className='cursor-pointer overflow-hidden rounded-lg'
                     style={{
                        height: `min(80vh, 90vw / ${item.aspectRatio})`,
                        width: `min(90vw, min(80vh, 90vw / ${item.aspectRatio}) * ${item.aspectRatio})`,
                     }}
                  >
                     <video
                        autoPlay
                        muted
                        playsInline
                        loop
                        className='h-full w-full object-cover'
                        src={item.thumbnail || item.video}
                     />
                  </div>
               </div>
            ) : (
               <div
                  className='cursor-pointer overflow-hidden rounded-lg'
                  style={{ aspectRatio: item.aspectRatio }}
                  onClick={() => setPopOpen(true)}
               >
                  <video
                     autoPlay
                     muted
                     playsInline
                     loop
                     className='h-full w-full object-cover'
                     src={item.thumbnail || item.video}
                  />
               </div>
            )}
            <VideoPopOver src={item.video} open={popOpen} onClose={() => setPopOpen(false)} aspectRatio={item.aspectRatio}/>
            <div className='flex flex-row justify-between items-center pb-4'>
            <p className='text-lg font-medium'>{item.description}</p>
            <ItemTags item={item} />
         </div>
         </div>
      )
   }

   const thumbnailOverlay = (
      <div
         style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            transition: 'opacity 0.4s ease',
            opacity: isLoaded ? 0 : 1,
            pointerEvents: isLoaded ? 'none' : 'auto',
         }}
      >
         <img src={item.thumbnail} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         <div
            style={{
               position: 'absolute',
               inset: 0,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               background: 'rgba(0,0,0,0.2)',
            }}
         >
            <Spinner />
         </div>
      </div>
   )

   const fullscreenButton = isLoaded && (
      <button
         onClick={toggleFullscreen}
         style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            zIndex: 10,
         }}
         className='rounded-md bg-black/50 p-1.5 text-white hover:bg-black/70 backdrop-blur-sm'
      >
         {isFullscreen ? <Minimize className='size-4' /> : <Maximize className='size-4' />}
      </button>
   )

   return (
      <div className='flex h-full flex-col gap-4'>
         {item.embedUrl ? (
            isPortrait ? (
               <div className='flex justify-center'>
                  <div
                     ref={containerRef}
                     style={{
                        position: 'relative',
                        ...(isFullscreen && {
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           width: '100%',
                           height: '100%',
                           background: 'black',
                        }),
                     }}
                  >
                     {thumbnailOverlay}
                     <iframe
                        ref={iframeRef}
                        className='rounded-lg'
                        style={{
                           height: `min(80vh, 90vw / ${item.aspectRatio})`,
                           width: `min(90vw, min(80vh, 90vw / ${item.aspectRatio}) * ${item.aspectRatio})`,
                        }}
                        src={item.embedUrl}
                        title={item.title}
                     />
                     {fullscreenButton}
                  </div>
               </div>
            ) : (
               <div
                  ref={containerRef}
                  className='w-full overflow-hidden rounded-lg'
                  style={{ position: 'relative', aspectRatio: item.aspectRatio }}
               >
                  {thumbnailOverlay}
                  <iframe ref={iframeRef} className='h-full w-full rounded-lg' src={item.embedUrl} title={item.title} />
                  {fullscreenButton}
               </div>
            )
         ) : isPortrait ? (
            <div className='flex justify-center'>
               <img
                  className='rounded-lg object-contain'
                  style={{
                     height: 'min(80vh, 90vw / ' + item.aspectRatio + ')',
                     width: `min(90vw, min(80vh, 90vw / ${item.aspectRatio}) * ${item.aspectRatio})`,
                  }}
                  src={item.image}
                  alt={item.alt}
               />
            </div>
         ) : (
            <div className='w-full overflow-hidden rounded-lg' style={{ aspectRatio: item.aspectRatio }}>
               <img className='h-full w-full object-cover rounded-lg' src={item.image} alt={item.alt} />
            </div>
         )}
         <div className='flex flex-row justify-between items-center pb-4'>
            <p className='text-lg font-medium'>{item.description}</p>
            <ItemTags item={item} />
         </div>
      </div>
   )
}

function ItemTags({ item }: { item: WorkItem }) {
   return (
      <div className='flex flex-wrap justify-end gap-2'>
         {item.tags.map(({ icon: Icon, label }) => (
            <Badge className='h-6 px-2' key={label} variant='outline'>
               <Icon data-icon='inline-start' />
               <p className='hidden lg:block'>{label}</p>
            </Badge>
         ))}
      </div>
   )
}

function WorkItemButton({
   item,
   isSelected,
   onSelect,
}: {
   item: WorkItem
   isSelected: boolean
   onSelect: (item: WorkItem) => void
}) {
   const [isHovered, setIsHovered] = useState(false)

   return (
      <Button
         type='button'
         variant='ghost'
         className={cn(
            'group relative w-full h-14 overflow-hidden rounded-lg p-0 border-0',
            isSelected && 'shadow-2xl'
         )}
         aria-pressed={isSelected}
         onClick={() => onSelect(item)}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         <img className='absolute inset-0 h-full w-full object-cover' src={item.image} alt={item.alt} />

         {/* Overlay: invisible by default, darkens on hover */}
         <div
            className={cn(
               'absolute inset-0 bg-white dark:bg-black transition-opacity duration-500',
               isHovered ? 'opacity-70' : 'opacity-80',
               isSelected && 'opacity-0'
            )}
         />

         {/* Text: hidden by default, fades in on hover */}
         <div
            className={cn(
               'relative z-10 flex h-full w-full items-center justify-center px-2 transition-opacity duration-500 dark:text-white text-black',
               isHovered ? 'opacity-100' : 'opacity-0',
               isSelected && 'opacity-0'
            )}
         >
            <TextRoll
               animate={isHovered ? 'hovered' : 'initial'}
               className='font-semibold lg:font-bold text-3xl uppercase'
            >
               {item.title}
            </TextRoll>
         </div>
      </Button>
   )
}

export function ResizableMain() {
   const [activeSection, setActiveSection] = useState<SectionId>('visuals')
   const [selectedItemId, setSelectedItemId] = useState(getDefaultItem('visuals').id)

   const selectedItem = workItems.find((item) => item.id === selectedItemId) ?? getDefaultItem(activeSection)
   const sectionItems = useMemo(() => workItems.filter((item) => item.section === activeSection), [activeSection])
   const sidebarCategories = useMemo(() => getItemsByCategory(sectionItems), [sectionItems])

   const scrollRef = useRef<HTMLDivElement>(null)

   function handleSectionChange(value: string) {
      const nextSection = value as SectionId
      setActiveSection(nextSection)
      setSelectedItemId(getDefaultItem(nextSection).id)
   }

   function handleItemSelect(item: WorkItem) {
      setActiveSection(item.section)
      setSelectedItemId(item.id)

      const isMobile = window.innerWidth < 1024
      if (isMobile) {
         window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
         scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }
   }

   const tabs = [
      ...sections.map((section) => ({
         icon: section.id === 'visuals' ? <Wallpaper className='size-5' /> : <SquareTerminal className='size-5' />,
         label: section.label,
         className: 'rounded-lg border-[1px]',
         isActive: activeSection === section.id,
         onClick: () => handleSectionChange(section.id),
      })),
      {
         icon: <ModeToggle />,
         label: 'Theme',
         className: 'rounded-full border-[1px] border-none shadow-none',
         isActive: false,
         onClick: () => {},
      },
   ]

   return (
      <div className='lg:flex gap-2 space-y-2 h-full text-foreground'>
         <Dock
            items={tabs}
            className='fixed z-20 dark:border-[1px] border-none shadow-xl text-white dark:bg-neutral-900 bg-neutral-50'
            panelHeight={70}
            baseItemSize={50}
            magnification={60}
         />
         <Card className='min-w-0 flex-1 lg:h-full border-none p-0 overflow-hidden shadow-lg'>
            <Tabs value={activeSection} onValueChange={handleSectionChange} className='h-full'>
               {sections.map((section) => (
                  <TabsContent key={section.id} value={section.id} className='min-h-0'>
                     <ScrollArea className='h-full w-full p-4'>
                        <ItemPreview
                           item={selectedItem.section === section.id ? selectedItem : getDefaultItem(section.id)}
                        />
                     </ScrollArea>
                  </TabsContent>
               ))}
            </Tabs>
         </Card>

         <div className='flex flex-col min-w-70 space-y-2 gap-2 lg:gap-0 lg:max-w-70'>
            <Card className='flex-1 border-none lg:rounded-br-[4em] rounded-tr-[4em] shadow-lg order-2 lg:order-1'>
               <div className='flex h-full flex-col items-center justify-center gap-3 p-6 text-center'>
                  <Avatar size='lg'>
                     <AvatarImage src='/polpr.avif' alt='Paul Pilar' />
                  </Avatar>
                  <span className='font-semibold'>@pol.plr</span>
               </div>
            </Card>

            <Card className='flex-4 min-h-0 border-none py-0 overflow-hidden lg:rounded-tr-[4em] rounded-br-[4em] shadow-lg order-1 lg:order-2 w-full'>
               <ScrollArea className='h-full w-full'>
                  <div className='px-4 w-full'>
                     {Object.entries(sidebarCategories).map(([category, items], index) => (
                        <div key={category} className='space-y-2 py-4 w-full'>
                           {index > 0 && <Separator />}
                           <p className='text-sm font-medium text-muted-foreground'>{category}</p>
                           <div className='space-y-2 w-full'>
                              {items.map((item) => (
                                 <WorkItemButton
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedItem.id === item.id}
                                    onSelect={handleItemSelect}
                                 />
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </ScrollArea>
            </Card>
         </div>
      </div>
   )
}
