import { networkPlaces } from '../../content/networkPlaces'
import { appRegistryById } from '../registry'
import { useAppActions } from '../../hooks/useAppActions'
import { AppIcon } from '../../components/common/AppIcon'
import styles from './NetworkPlacesWindow.module.css'

export function NetworkPlacesWindow() {
  const { openApp } = useAppActions()

  function openHomelab() {
    const app = appRegistryById['project-homelab']
    if (app) openApp(app)
  }

  return (
    <>
      <div className={styles.menubar}>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>
      <div className={styles.body}>
        <div className={styles.grid}>
          {networkPlaces.map((place) => (
            <button
              key={place.id}
              type="button"
              className={styles.place}
              title={place.description}
              onDoubleClick={openHomelab}
            >
              <div className={styles.glyph}>
                <AppIcon icon={place.icon} size={48} />
              </div>
              <div className={styles.label}>{place.label}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
