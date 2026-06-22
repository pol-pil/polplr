import { ModeToggle } from './components/mode-toggle'
import { ResizableMain } from './components/resizable-main'
import { ThemeProvider } from './components/theme-provider'

function App() {
   return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
         <div className='absolute z-10 p-4 text-foreground'>
            <ModeToggle />
         </div>
         <div className="h-dvh w-full bg-[url('/artspherebg.png')] bg-cover p-4 sm:px-8 lg:px-24 xl:px-40">
            <ResizableMain />
         </div>
      </ThemeProvider>
   )
}

export default App
