import { useMemo, useRef, useState } from 'react'
import { Wallpaper } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { motion } from 'framer-motion'

type SectionId = 'designs' | 'projects'

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

const ReactIcon = () => (
   <svg width='800px' height='800px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12,10.11A1.87,1.87,0,1,1,10.13,12,1.88,1.88,0,0,1,12,10.11M7.37,20c.63.38,2-.2,3.6-1.7a24.22,24.22,0,0,1-1.51-1.9A22.7,22.7,0,0,1,7.06,16c-.51,2.14-.32,3.61.31,4m.71-5.74-.29-.51a7.91,7.91,0,0,0-.29.86c.27.06.57.11.88.16l-.3-.51m6.54-.76.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17,9,12.6,9,12,9s-1.17,0-1.71,0c-.29.47-.61.94-.91,1.47L8.57,12l.81,1.5c.3.53.62,1,.91,1.47.54,0,1.11,0,1.71,0s1.17,0,1.71,0c.29-.47.61-.94.91-1.47M12,6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0,10.44c.19-.22.39-.45.59-.72H11.41c.2.27.4.5.59.72M16.62,4c-.62-.38-2,.2-3.59,1.7a24.22,24.22,0,0,1,1.51,1.9,22.7,22.7,0,0,1,2.4.36c.51-2.14.32-3.61-.32-4m-.7,5.74.29.51a7.91,7.91,0,0,0,.29-.86c-.27-.06-.57-.11-.88-.16l.3.51m1.45-7c1.47.84,1.63,3.05,1,5.63,2.54.75,4.37,2,4.37,3.68s-1.83,2.93-4.37,3.68c.62,2.58.46,4.79-1,5.63s-3.45-.12-5.37-1.95c-1.92,1.83-3.91,2.79-5.38,1.95s-1.62-3-1-5.63c-2.54-.75-4.37-2-4.37-3.68S3.08,9.07,5.62,8.32c-.62-2.58-.46-4.79,1-5.63s3.46.12,5.38,1.95c1.92-1.83,3.91-2.79,5.37-1.95M17.08,12A22.51,22.51,0,0,1,18,14.26c2.1-.63,3.28-1.53,3.28-2.26S20.07,10.37,18,9.74A22.51,22.51,0,0,1,17.08,12M6.92,12A22.51,22.51,0,0,1,6,9.74c-2.1.63-3.28,1.53-3.28,2.26S3.93,13.63,6,14.26A22.51,22.51,0,0,1,6.92,12m9,2.26-.3.51c.31,0,.61-.1.88-.16a7.91,7.91,0,0,0-.29-.86l-.29.51M13,18.3c1.59,1.5,3,2.08,3.59,1.7s.83-1.82.32-4a22.7,22.7,0,0,1-2.4.36A24.22,24.22,0,0,1,13,18.3M8.08,9.74l.3-.51c-.31,0-.61.1-.88.16a7.91,7.91,0,0,0,.29.86l.29-.51M11,5.7C9.38,4.2,8,3.62,7.37,4s-.82,1.82-.31,4a22.7,22.7,0,0,1,2.4-.36A24.22,24.22,0,0,1,11,5.7Z' />
   </svg>
)

const TailwindIcon = () => (
   <svg fill='currentColor' width='800px' height='800px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <path
         fill-rule='evenodd'
         clip-rule='evenodd'
         d='M12 6.036c-2.667 0-4.333 1.325-5 3.976 1-1.325 2.167-1.822 3.5-1.491.761.189 1.305.738 1.906 1.345C13.387 10.855 14.522 12 17 12c2.667 0 4.333-1.325 5-3.976-1 1.325-2.166 1.822-3.5 1.491-.761-.189-1.305-.738-1.907-1.345-.98-.99-2.114-2.134-4.593-2.134zM7 12c-2.667 0-4.333 1.325-5 3.976 1-1.326 2.167-1.822 3.5-1.491.761.189 1.305.738 1.907 1.345.98.989 2.115 2.134 4.594 2.134 2.667 0 4.333-1.325 5-3.976-1 1.325-2.167 1.822-3.5 1.491-.761-.189-1.305-.738-1.906-1.345C10.613 13.145 9.478 12 7 12z'
      />
   </svg>
)

const ExpoIcon = () => (
   <svg
      fill='currentColor'
      width='800px'
      height='800px'
      viewBox='0 0 24 24'
      role='img'
      xmlns='http://www.w3.org/2000/svg'
   >
      <path d='M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 0 1 1.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77z' />
   </svg>
)

const ConvexIcon = () => (
   <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='31 31.5 122 125'>
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

const workItems: WorkItem[] = [
   {
      id: 'artsphere-layout',
      section: 'designs',
      category: 'Layouts',
      title: 'The ArtSphere',
      image: '/artsphere.png',
      alt: 'The ArtSphere thumbnail',
      description: 'The ArtSphere · School Project · 2024',
      embedUrl:
         'https://embed.figma.com/proto/zR7MV8n7ismhZS2bup8sMq/Virtual-Tour-App-for-Art-Gallery--Copy-?node-id=660-113&page-id=0%3A1&starting-point-node-id=660%3A113&scaling=scale-down-width&content-scaling=fixed&embed-host=share&hide-ui=1',
      tags: [{ label: 'Figma', icon: FigmaIcon }],
      aspectRatio: 16 / 10.4,
   },
   {
      id: 'slicehaus-layout',
      section: 'designs',
      category: 'Layouts',
      title: 'Slicehaus',
      image: '/slicehaus.png',
      alt: 'Slicehaus logo',
      description: 'Slicehaus · School Project · 2025',
      embedUrl:
         'https://embed.figma.com/proto/xuQnWFXgDs1Ilym2SvqmIl/Slicehaus--Community-?node-id=2003-22266&p=f&viewport=-144%2C-189%2C0.02&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=2003%3A22266&page-id=0%3A1&embed-host=share&hide-ui=1',
      tags: [{ label: 'Figma', icon: FigmaIcon }],
      aspectRatio: 16 / 10.4,
   },
   {
      id: 'bondbook-layout',
      section: 'designs',
      category: 'Layouts',
      title: 'BondBook',
      image: '/bondbook.png',
      alt: 'BondBook layout thumbnail',
      description: 'BondBook · School Project · 2024',
      embedUrl:
         'https://embed.figma.com/proto/QuentdTLxdNzwYDaEI2AL6/Pilar--John-Paul?node-id=943-2646&p=f&viewport=473%2C-79%2C0.09&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=943%3A2619&page-id=0%3A1&embed-host=share&hide-ui=1',
      tags: [{ label: 'Figma', icon: FigmaIcon }],
      aspectRatio: 9 / 18.4,
   },
   {
      id: 'technoday-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Technoday',
      image: '/technoday.png',
      alt: 'Technoday poster thumbnail',
      description: 'Technoday · Event Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 1 / 1.41,
   },
   {
      id: 'whywait-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Why Wait?',
      image: '/whywait.png',
      alt: 'Why Wait poster thumbnail',
      description: 'Why · Poster Design',
      tags: [
         { label: 'Figma', icon: FigmaIcon },
         { label: 'Photoshop', icon: Wallpaper },
      ],
      aspectRatio: 16 / 9,
   },
   {
      id: 'resto-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Resto',
      image: '/resto.png',
      alt: 'Resto poster thumbnail',
      description: 'Resto · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 16 / 9,
   },
   {
      id: 'jane-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Jane',
      image: '/jane9.png',
      alt: 'Jane poster thumbnail',
      description: 'Jane · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 16 / 9,
   },
   {
      id: 'never-happened-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Never Happened',
      image: '/neverhappened.png',
      alt: 'Never Happened poster thumbnail',
      description: 'Never Happened · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 2 / 3,
   },
   {
      id: 'juliana-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Juliana',
      image: '/juliana.png',
      alt: 'Juliana poster thumbnail',
      description: 'Juliana · Digital Art',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 2 / 3,
   },
   {
      id: 'varre-poster',
      section: 'designs',
      category: 'Posters',
      title: "Varre",
      image: '/whosbehindthemask.png',
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
      section: 'designs',
      category: 'Posters',
      title: 'Cleanrot',
      image: '/cleanrot7.png',
      alt: 'Cleanrot poster thumbnail',
      description: 'Cleanrot · Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 9 / 16,
   },
   {
      id: 'eResq-app',
      section: 'projects',
      category: 'Apps',
      title: 'e-ResQ',
      image: '/eresq.png',
      video: '/eresq.mp4',
      thumbnail: '/eresqsummary.mp4',
      alt: 'e-ResQ System thumbnail',
      description: 'Portfolio · Capstone Project · 2025',
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
      category: 'Apps',
      title: 'Hotel Management System',
      image: '/casatmb.png',
      video: '/casa.mp4',
      thumbnail: '/casapreview.mp4',
      alt: 'Hotel Management System thumbnail',
      description: 'Casa Jedliana · OJT Project · 2026',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 16 / 10,
   },
]

const sections: Array<{ id: SectionId; label: string }> = [
   { id: 'designs', label: 'Designs' },
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

   if (item.video) {
      const [popOpen, setPopOpen] = useState(false)

      return (
         <div className='flex flex-col gap-4'>
            <div
               className='cursor-pointer overflow-hidden rounded-lg'
               style={{ aspectRatio: item.aspectRatio }}
               onClick={() => setPopOpen(true)}
            >
               {/* thumbnail — still autoPlay muted loop */}
               <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  className='h-full w-full object-cover'
                  src={item.thumbnail || item.video}
               />
            </div>

            <VideoPopOver src={item.video} open={popOpen} onClose={() => setPopOpen(false)} />
            <p className='text-lg font-medium pb-4'>{item.description}</p>
         </div>
      )
   }

   return (
      <div className='flex h-full flex-col gap-4'>
         {item.embedUrl ? (
            isPortrait ? (
               <div className='flex justify-center'>
                  <iframe
                     className='rounded-lg'
                     style={{
                        height: 'min(80vh, 90vw / ' + item.aspectRatio + ')',
                        width: `min(90vw, min(80vh, 90vw / ${item.aspectRatio}) * ${item.aspectRatio})`,
                     }}
                     src={item.embedUrl}
                     title={item.title}
                  />
               </div>
            ) : (
               <div className='w-full overflow-hidden rounded-lg' style={{ aspectRatio: item.aspectRatio }}>
                  <iframe className='h-full w-full rounded-lg' src={item.embedUrl} title={item.title} />
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
         <p className='text-lg font-medium pb-4'>{item.description}</p>
      </div>
   )
}

function ItemTags({ item }: { item: WorkItem }) {
   return (
      <div className='flex flex-wrap justify-end gap-2'>
         {item.tags.map(({ icon: Icon, label }) => (
            <Badge className='px-2' key={label} variant='outline'>
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
            'group relative w-full h-14 overflow-hidden rounded-md p-0 border-0',
            isSelected && 'ring-2 ring-primary'
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
               'absolute inset-0 bg-black transition-opacity duration-500',
               isHovered ? 'opacity-80' : 'opacity-0'
            )}
         />

         {/* Text: hidden by default, fades in on hover */}
         <div
            className={cn(
               'relative z-10 flex h-full w-full items-center justify-center px-2 transition-opacity duration-300',
               isHovered ? 'opacity-100' : 'opacity-0'
            )}
         >
            <TextRoll animate={isHovered ? 'hovered' : 'initial'} className='font-bold text-xl uppercase text-white'>
               {item.title}
            </TextRoll>
         </div>
      </Button>
   )
}

export function ResizableMain() {
   const [activeSection, setActiveSection] = useState<SectionId>('designs')
   const [selectedItemId, setSelectedItemId] = useState(getDefaultItem('designs').id)

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

   return (
      <div className='lg:flex gap-2 space-y-2 h-full text-foreground'>
         <Card className='min-w-0 flex-1 lg:h-full border-none p-0 overflow-hidden shadow-lg'>
            <Tabs value={activeSection} onValueChange={handleSectionChange} className='h-full'>
               <div className='flex items-center justify-between p-4'>
                  <TabsList className='grid w-[220px] grid-cols-2'>
                     {sections.map((section) => (
                        <TabsTrigger key={section.id} value={section.id}>
                           {section.label}
                        </TabsTrigger>
                     ))}
                  </TabsList>
                  <ItemTags item={selectedItem} />
               </div>

               {sections.map((section) => (
                  <TabsContent key={section.id} value={section.id} className='min-h-0'>
                     <ScrollArea className='h-full w-full px-4'>
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
                     <AvatarImage src='/polpr.png' alt='Paul Pilar' />
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
                           <div className='space-y-1 w-full'>
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
