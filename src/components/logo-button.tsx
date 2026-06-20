import LogoIcon from "./logo-icon";
import { Button } from "./ui/button";

export default function logoButton() {
   return (
      <Button
         variant="ghost"
         onClick={() =>
            window.open("https://www.instagram.com/pol.plr/", "_blank")
         }
      >
         <div className="flex bg-secondary border-1 rounded-full overflow-auto">
            <LogoIcon className="size-6" />
         </div>
         pol.plr
      </Button>
   );
}
