export interface AppIconProps {
  icon: string
  size: number
}

// AppConfig.icon is usually a plain emoji glyph rendered as text, but an icon
// that starts with '/' is a path to a custom SVG asset under public/ instead.
export function AppIcon({ icon, size }: AppIconProps) {
  if (icon.startsWith('/')) {
    return (
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ width: size, height: size, display: 'block' }}
      />
    )
  }
  return <>{icon}</>
}
