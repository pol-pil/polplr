import { useMemo, useState } from 'react'
import { Atom, Figma, PanelsTopLeft, Wallpaper, Wind } from 'lucide-react'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

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
}

const workItems: WorkItem[] = [
   {
      id: 'artsphere-layout',
      section: 'designs',
      category: 'Layouts',
      title: 'The ArtSphere',
      image: '/artsphere.png',
      alt: 'The ArtSphere thumbnail',
      description: 'The ArtSphere / School Project / 2024',
      embedUrl:
         'https://embed.figma.com/proto/zR7MV8n7ismhZS2bup8sMq/Virtual-Tour-App-for-Art-Gallery--Copy-?node-id=660-113&page-id=0%3A1&starting-point-node-id=660%3A113&scaling=scale-down-width&content-scaling=fixed&embed-host=share&hide-ui=1',
      tags: [
         { label: 'Figma', icon: Figma },
      ],
   },
   {
      id: 'slicehaus-layout',
      section: 'designs',
      category: 'Layouts',
      title: 'Slicehaus',
      image: '/slicehaus.png',
      alt: 'Slicehaus logo',
      description: 'Slicehaus / School Project / 2025',
      embedUrl:
         'https://embed.figma.com/proto/xuQnWFXgDs1Ilym2SvqmIl/Slicehaus--Community-?node-id=2003-22266&p=f&viewport=-144%2C-189%2C0.02&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=2003%3A22266&page-id=0%3A1&embed-host=share&hide-ui=1',
      tags: [{ label: 'Figma', icon: Figma }],
   },
   {
      id: 'bondbook-layout',
      section: 'designs',
      category: 'Layouts',
      title: 'BondBook',
      image: '/artsphere.png',
      alt: 'BondBook layout thumbnail',
      description: 'BondBook / School Project / 2026',
      tags: [
         { label: 'Figma', icon: Figma },
      ],
   },
   {
      id: 'technoday-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Technoday',
      image: '/technoday.png',
      alt: 'Technoday poster thumbnail',
      description: 'Technoday / Event Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
   },
   {
      id: 'whywait-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Why Wait?',
      image: '/whywait.png',
      alt: 'Why Wait poster thumbnail',
      description: 'Why / Poster Design',
      tags: [{ label: 'Figma', icon: Figma }, { label: 'Photoshop', icon: Wallpaper }],
   },
   {
      id: 'resto-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Resto',
      image: '/resto.png',
      alt: 'Resto poster thumbnail',
      description: 'Resto / Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
   },
   {
      id: 'jane-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Jane',
      image: '/jane9.png',
      alt: 'Jane poster thumbnail',
      description: 'Jane / Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
   },
   {
      id: 'never-happened-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Never Happened',
      image: '/neverhappened.png',
      alt: 'Never Happened poster thumbnail',
      description: 'Never Happened / Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
   },
   {
      id: 'juliana-poster',
      section: 'designs',
      category: 'Posters',
      title: 'Juliana',
      image: '/juliana.png',
      alt: 'Juliana poster thumbnail',
      description: 'Juliana / Poster Design',
      tags: [{ label: 'Photoshop', icon: Wallpaper }],
   },
   {
      id: 'varre-poster',
      section: 'designs',
      category: 'Posters',
      title: "Who's Behind the Mask?",
      image: '/whosbehindthemask.png',
      alt: 'Varre poster thumbnail',
      description: "Who's Behind the Mask / School Project / Poster Design",
      tags: [{ label: 'Figma', icon: Figma }, { label: 'Photoshop', icon: Wallpaper }],
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
   return (
      <div className='flex h-full flex-col gap-4'>
         {item.embedUrl ? (
            <iframe
               className='min-h-[44em] rounded-lg border border-border bg-muted'
               src={item.embedUrl}
               title={item.title}
            />
         ) : (
            <div className='flex min-h-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted'>
               <img className='h-full w-full object-fill' src={item.image} alt={item.alt} />
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
            <Badge key={label} variant='outline'>
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

   function handleSectionChange(value: string) {
      const nextSection = value as SectionId
      setActiveSection(nextSection)
      setSelectedItemId(getDefaultItem(nextSection).id)
   }

   function handleItemSelect(item: WorkItem) {
      setActiveSection(item.section)
      setSelectedItemId(item.id)
   }

   return (
      <div className='h-full overflow-hidden rounded-lg bg-background text-foreground shadow-xl'>
         <ResizablePanelGroup orientation='horizontal'>
            <ResizablePanel defaultSize='80%' maxSize='80%'>
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
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize='20%' maxSize='30%'>
               <ResizablePanelGroup orientation='vertical'>
                  <ResizablePanel defaultSize='30%' maxSize='40%'>
                     <div className='flex h-full flex-col items-center justify-center gap-3 p-6 text-center'>
                        <PanelsTopLeft className='size-8 text-primary' />
                        <span className='font-semibold'>Side Tabs</span>
                     </div>
                  </ResizablePanel>

                  <ResizableHandle />

                  <ResizablePanel defaultSize='70%' maxSize='70%'>
                     <ScrollArea className='h-full w-full'>
                        <div className='space-y-4 p-4'>
                           {Object.entries(sidebarCategories).map(([category, items], index) => (
                              <div key={category} className='space-y-2'>
                                 {index > 0 && <Separator />}
                                 <p className='text-sm font-medium text-muted-foreground'>{category}</p>
                                 <div className='space-y-1'>
                                    {items.map((item) => (
                                       <Button
                                          key={item.id}
                                          type='button'
                                          variant='ghost'
                                          className={cn(
                                             'h-auto w-full justify-start gap-2 px-2 py-2 text-left',
                                             selectedItem.id === item.id &&
                                                'bg-accent text-accent-foreground hover:bg-accent'
                                          )}
                                          aria-pressed={selectedItem.id === item.id}
                                          onClick={() => handleItemSelect(item)}
                                       >
                                          <img
                                             className='size-10 rounded-md object-cover'
                                             src={item.image}
                                             alt={item.alt}
                                          />
                                          <span className='min-w-0 truncate'>{item.title}</span>
                                       </Button>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </ScrollArea>
                  </ResizablePanel>
               </ResizablePanelGroup>
            </ResizablePanel>
         </ResizablePanelGroup>
      </div>
   )
}
