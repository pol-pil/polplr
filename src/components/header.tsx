import { Button } from "./ui/button";
import LogoButton from "./logo-button";

export default function Header() {
   return (
      <div className="flex justify-between">
         <LogoButton />
         <Button>Contact</Button>
      </div>
   );
}
