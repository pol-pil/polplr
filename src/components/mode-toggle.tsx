import { ThemeToggleButton2 } from '@/components/ui/skiper-ui/skiper4';
import { useThemeToggle } from './ui/skiper-ui/skiper26';

export function ModeToggle() {
  const {
    setCrazyDarkTheme,
    setCrazyLightTheme,
    isDark,
  } = useThemeToggle({
    variant: "rectangle",
    start: "bottom-up",
  });

  const toggleTheme = () => {
    if (isDark) {
      setCrazyLightTheme();
    } else {
      setCrazyDarkTheme();
    }
  };

  return (
    <div onClick={toggleTheme}>
      <ThemeToggleButton2 className="size-8 rounded-lg p-2" />
    </div>
  );
}