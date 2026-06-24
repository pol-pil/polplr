import ImageTrail from './components/image-trail'
import { ModeToggle } from './components/mode-toggle'
import { ResizableMain } from './components/resizable-main'
import { ThemeProvider } from './components/theme-provider'

function App() {
   return (
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
         <div className='absolute z-100 p-2 lg:p-4 text-foreground'>
            <ModeToggle />
         </div>
         <div className='h-dvh w-full p-4 sm:px-8 lg:px-24 xl:px-40'>
            {/* ImageTrail behind everything */}
            <div className='fixed inset-0 z-0'>
               <ImageTrail
                  key='image-trail'
                  items={[
                     '/cleanrot7.png',
                     '/varre8.png',
                     '/juliana.png',
                     '/jane9.png',
                     '/resto.png',
                  ]}
                  variant={1}
               />
            </div>

            {/* ResizableMain on top */}
            <div className='relative z-10 h-full'>
               <ResizableMain />
            </div>
         </div>
      </ThemeProvider>
   )
}
export default App
