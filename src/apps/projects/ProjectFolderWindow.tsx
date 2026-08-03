import type { ComponentType } from 'react'
import type { Project } from '../../content/types'
import { appRegistryById } from '../registry'
import { useAppActions } from '../../hooks/useAppActions'
import { AppIcon } from '../../components/common/AppIcon'
import styles from './ProjectFolderWindow.module.css'

export function createProjectFolderWindow(project: Project): ComponentType {
  return function ProjectFolderWindow() {
    const { openApp } = useAppActions()
    const linkedApps = (project.linkedApps ?? [])
      .map((id) => appRegistryById[id])
      .filter((app) => app !== undefined)

    return (
      <div className={styles.body}>
        <p className={styles.summary}>{project.summary}</p>
        <div className={styles.metaRow}>
          <div className={styles.metaLabel}>Role:</div>
          <div>{project.role}</div>
        </div>
        <div className={styles.metaRow}>
          <div className={styles.metaLabel}>Stack:</div>
          <div>{project.stack}</div>
        </div>
        <div className={styles.filesLabel}>Files</div>
        {linkedApps.map((app) => (
          <div
            key={app.id}
            className={`${styles.file} ${styles.shortcut}`}
            onDoubleClick={() => openApp(app)}
            title={`Double-click to open ${app.iconLabel}`}
          >
            <span className={styles.fileIcon}>
              <AppIcon icon={app.icon} size={16} />
            </span>
            <span className={styles.fileName}>{app.iconLabel}</span>
          </div>
        ))}
        {project.files.map((file) => (
          <div key={file.name} className={styles.file}>
            <span className={styles.fileIcon}>📄</span>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileDescription}>— {file.description}</span>
          </div>
        ))}
      </div>
    )
  }
}
