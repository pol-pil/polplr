import { useMemo, useRef, useState } from 'react'
import { Atom, Figma, Wallpaper, Wind } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Card } from './ui/card'
import { Avatar, AvatarImage } from './ui/avatar'
import GradualBlurMemo from './ui/gradual-blur'

type SectionId = 'designs' | 'projects'

type WorkItem = {
   id: string
   section: SectionId
   category: string
   title: string
   image: string
   alt: string
   description: string
   embedUrl?: string
   tags: Array<{
      label: string
      icon: typeof Figma
   }>
   aspectRatio: number
}

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
      tags: [{ label: 'Figma', icon: Figma }],
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
      tags: [{ label: 'Figma', icon: Figma }],
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
      tags: [{ label: 'Figma', icon: Figma }],
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
         { label: 'Figma', icon: Figma },
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
      title: "Who's Behind the Mask?",
      image: '/whosbehindthemask.png',
      alt: 'Varre poster thumbnail',
      description: "Who's Behind the Mask · School Project · Poster Design",
      tags: [
         { label: 'Figma', icon: Figma },
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
      description: 'Cleanrot / Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
      aspectRatio: 9 / 16,
   },
   {
      id: 'portfolio-app',
      section: 'projects',
      category: 'Apps',
      title: 'Portfolio',
      image: '/artsphere.png',
      alt: 'Portfolio app thumbnail',
      description: 'Portfolio / React Project',
      tags: [
         { label: 'React', icon: Atom },
         { label: 'Tailwind', icon: Wind },
      ],
      aspectRatio: 9 / 16,
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

   return (
      <div className='flex h-full flex-col gap-4'>
         {item.embedUrl ? (
            isPortrait ? (
               <div className='flex justify-center'>
                  <iframe
                     className='rounded-lg'
                     style={{
                        height: '80vh',
                        width: `calc(80vh * ${item.aspectRatio})`,
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
            // Portrait image: constrained by screen height, centered
            <div className='flex justify-center'>
               <img
                  className='rounded-lg object-contain'
                  style={{
                     height: '80vh',
                     width: `calc(80vh * ${item.aspectRatio})`,
                  }}
                  src={item.image}
                  alt={item.alt}
               />
            </div>
         ) : (
            // Landscape image: full width, height follows ratio
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
            <Badge className='h-8 px-4' key={label} variant='outline'>
               <Icon data-icon='inline-start' />
               {label}
            </Badge>
         ))}
      </div>
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
               <div className='flex items-start justify-between p-4'>
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

         <div className='flex flex-col min-w-70 space-y-2 lg:max-w-70'>
            <Card className='flex-1 border-none rounded-br-[4em] shadow-lg'>
               <div className='flex h-full flex-col items-center justify-center gap-3 p-6 text-center'>
                  <Avatar size='lg'>
                     <AvatarImage src='/polpr.png' alt='Paul Pilar' />
                  </Avatar>
                  <span className='font-semibold'>@pol.plr</span>
               </div>
            </Card>

            <Card className='flex-4 min-h-0 border-none py-0 overflow-hidden rounded-tr-[4em] shadow-lg'>
               <ScrollArea className='h-full px-4'>
                  {Object.entries(sidebarCategories).map(([category, items], index) => (
                     <div key={category} className='space-y-2 py-4'>
                        {index > 0 && <Separator />}
                        <p className='text-sm font-medium text-muted-foreground'>{category}</p>
                        <div className='space-y-1'>
                           {items.map((item) => (
                              <Button
                                 key={item.id}
                                 type='button'
                                 variant='ghost'
                                 className={cn(
                                    'h-auto w-full justify-start gap-2 px-2 py-2 text-left ',
                                    selectedItem.id === item.id && 'bg-accent text-accent-foreground hover:bg-accent'
                                 )}
                                 aria-pressed={selectedItem.id === item.id}
                                 onClick={() => handleItemSelect(item)}
                              >
                                 <img className='size-10 rounded-md object-cover' src={item.image} alt={item.alt} />
                                 <span className='min-w-0 truncate'>{item.title}</span>
                              </Button>
                           ))}
                        </div>
                     </div>
                  ))}
                  <GradualBlurMemo
                     target='parent'
                     position='bottom'
                     height='1rem'
                     strength={1}
                     divCount={6}
                     curve='bezier'
                     exponential
                     opacity={1}
                  />
               </ScrollArea>
            </Card>
         </div>
      </div>
   )
}
