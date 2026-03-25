import type { CSSProperties } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'

export interface StaggeredMenuItem {
  label: string
  description: string
  to: string
  ariaLabel: string
  end?: boolean
}

interface StaggeredMenuProps {
  items: StaggeredMenuItem[]
  accentColor?: string
  colors?: string[]
}

const closedXPercent = 100

export function StaggeredMenu({
  items,
  accentColor = '#2457d6',
  colors = ['#eef4ff', '#d7e6ff', '#2457d6'],
}: StaggeredMenuProps) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [textLines, setTextLines] = useState(['导航', '关闭'])
  const portalRoot = typeof document !== 'undefined' ? document.body : null

  const openRef = useRef(false)
  const reduceMotionRef = useRef(false)
  const previousPathRef = useRef(location.pathname)
  const panelRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLButtonElement | null>(null)
  const preLayersRef = useRef<HTMLDivElement | null>(null)
  const iconRef = useRef<HTMLSpanElement | null>(null)
  const textInnerRef = useRef<HTMLSpanElement | null>(null)
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Timeline | null>(null)
  const iconTweenRef = useRef<gsap.core.Tween | null>(null)
  const textTweenRef = useRef<gsap.core.Tween | null>(null)
  const busyRef = useRef(false)

  const getPreLayers = useCallback(
    () => Array.from(preLayersRef.current?.querySelectorAll<HTMLElement>('.sm-prelayer') ?? []),
    [],
  )

  const getMenuElements = useCallback(() => {
    const panel = panelRef.current

    return {
      panel,
      labels: Array.from(panel?.querySelectorAll<HTMLElement>('.sm-panel-itemLabel') ?? []),
      descriptions: Array.from(
        panel?.querySelectorAll<HTMLElement>('.sm-panel-itemDescription') ?? [],
      ),
      numbers: Array.from(panel?.querySelectorAll<HTMLElement>('.sm-panel-itemNumber') ?? []),
      notes: Array.from(panel?.querySelectorAll<HTMLElement>('.sm-panel-note > *') ?? []),
    }
  }, [])

  const setClosedState = useCallback(() => {
    const overlay = overlayRef.current
    const { panel, labels, descriptions, numbers, notes } = getMenuElements()
    const preLayers = getPreLayers()

    if (!panel || !overlay) {
      return
    }

    gsap.set(overlay, { autoAlpha: 0 })
    gsap.set([panel, ...preLayers], { xPercent: closedXPercent })
    gsap.set(labels, { yPercent: 140, rotate: 8 })
    gsap.set(descriptions, { y: 24, opacity: 0 })
    gsap.set(numbers, { x: -18, opacity: 0 })
    gsap.set(notes, { y: 18, opacity: 0 })
  }, [getMenuElements, getPreLayers])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPreference = () => {
      reduceMotionRef.current = mediaQuery.matches
    }

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)

    return () => {
      mediaQuery.removeEventListener('change', syncPreference)
    }
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const icon = iconRef.current
      const textInner = textInnerRef.current

      if (icon) {
        gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      }

      if (textInner) {
        gsap.set(textInner, { yPercent: 0 })
      }

      setClosedState()
    })

    return () => ctx.revert()
  }, [setClosedState])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current

    if (!icon) {
      return
    }

    iconTweenRef.current?.kill()

    if (reduceMotionRef.current) {
      gsap.set(icon, { rotate: opening ? 225 : 0 })
      return
    }

    iconTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    })
  }, [])

  const animateText = useCallback((opening: boolean) => {
    const textInner = textInnerRef.current

    if (!textInner) {
      return
    }

    const currentLabel = opening ? '导航' : '关闭'
    const targetLabel = opening ? '关闭' : '导航'
    const sequence = [currentLabel]
    let lastLabel = currentLabel

    for (let index = 0; index < 2; index += 1) {
      lastLabel = lastLabel === '导航' ? '关闭' : '导航'
      sequence.push(lastLabel)
    }

    if (lastLabel !== targetLabel) {
      sequence.push(targetLabel)
    }

    sequence.push(targetLabel)

    setTextLines(sequence)
    textTweenRef.current?.kill()

    if (reduceMotionRef.current) {
      gsap.set(textInner, { yPercent: -75 })
      return
    }

    gsap.set(textInner, { yPercent: 0 })

    const finalShift = ((sequence.length - 1) / sequence.length) * 100

    textTweenRef.current = gsap.to(textInner, {
      yPercent: -finalShift,
      duration: 0.45 + sequence.length * 0.06,
      ease: 'power4.out',
      overwrite: 'auto',
    })
  }, [])

  const resetToggleVisuals = useCallback(() => {
    iconTweenRef.current?.kill()
    textTweenRef.current?.kill()

    if (iconRef.current) {
      gsap.set(iconRef.current, { rotate: 0 })
    }

    if (textInnerRef.current) {
      gsap.set(textInnerRef.current, { yPercent: 0 })
    }
  }, [])

  const playOpen = useCallback(() => {
    const overlay = overlayRef.current
    const { panel, labels, descriptions, numbers, notes } = getMenuElements()
    const preLayers = getPreLayers()

    if (!panel || !overlay || busyRef.current) {
      return
    }

    busyRef.current = true
    openTimelineRef.current?.kill()
    closeTweenRef.current?.kill()

    if (reduceMotionRef.current) {
      gsap.set(overlay, { autoAlpha: 1 })
      gsap.set([panel, ...preLayers], { xPercent: 0 })
      gsap.set(labels, { yPercent: 0, rotate: 0 })
      gsap.set(descriptions, { y: 0, opacity: 1 })
      gsap.set(numbers, { x: 0, opacity: 1 })
      gsap.set(notes, { y: 0, opacity: 1 })
      busyRef.current = false
      return
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        busyRef.current = false
      },
    })

    timeline.to(overlay, { autoAlpha: 1, duration: 0.22, ease: 'power2.out' }, 0)

    preLayers.forEach((layer, index) => {
      timeline.to(
        layer,
        {
          xPercent: 0,
          duration: 0.5,
          ease: 'power4.out',
        },
        index * 0.07,
      )
    })

    const panelStart = preLayers.length ? (preLayers.length - 1) * 0.07 + 0.08 : 0

    timeline.to(
      panel,
      {
        xPercent: 0,
        duration: 0.65,
        ease: 'power4.out',
      },
      panelStart,
    )

    timeline.to(
      labels,
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.95,
        ease: 'power4.out',
        stagger: 0.08,
      },
      panelStart + 0.12,
    )

    timeline.to(
      numbers,
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.06,
      },
      panelStart + 0.2,
    )

    timeline.to(
      descriptions,
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.06,
      },
      panelStart + 0.26,
    )

    timeline.to(
      notes,
      {
        y: 0,
        opacity: 1,
        duration: 0.48,
        ease: 'power3.out',
        stagger: 0.05,
      },
      panelStart + 0.42,
    )

    openTimelineRef.current = timeline
  }, [getMenuElements, getPreLayers])

  const closeMenu = useCallback(
    (immediate = false) => {
      const overlay = overlayRef.current
      const { panel } = getMenuElements()
      const preLayers = getPreLayers()

      if (!panel || !overlay) {
        return
      }

      openRef.current = false
      setOpen(false)
      openTimelineRef.current?.kill()
      closeTweenRef.current?.kill()

      if (immediate || reduceMotionRef.current) {
        setClosedState()
        busyRef.current = false
        return
      }

      busyRef.current = true

      closeTweenRef.current = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          setClosedState()
          busyRef.current = false
        },
      })

      closeTweenRef.current.to(
        [panel, ...preLayers],
        {
          xPercent: closedXPercent,
          duration: 0.32,
          ease: 'power3.in',
          stagger: 0.03,
        },
        0,
      )

      closeTweenRef.current.to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.18,
          ease: 'power2.out',
        },
        0.08,
      )
    },
    [getMenuElements, getPreLayers, setClosedState],
  )

  const toggleMenu = useCallback(() => {
    const nextState = !openRef.current

    openRef.current = nextState
    setOpen(nextState)
    animateIcon(nextState)
    animateText(nextState)

    if (nextState) {
      playOpen()
      return
    }

    closeMenu()
  }, [animateIcon, animateText, closeMenu, playOpen])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        animateIcon(false)
        animateText(false)
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [animateIcon, animateText, closeMenu, open])

  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      previousPathRef.current = location.pathname

      if (openRef.current) {
        const frameId = window.requestAnimationFrame(() => {
          resetToggleVisuals()
          closeMenu(true)
        })

        return () => {
          window.cancelAnimationFrame(frameId)
        }
      }
    }
  }, [closeMenu, location.pathname, resetToggleVisuals])

  const dismissMenu = useCallback(() => {
    animateIcon(false)
    animateText(false)
    closeMenu()
  }, [animateIcon, animateText, closeMenu])

  return (
    <>
      <div className="staggered-menu">
        <button
          className="staggered-menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-staggered-menu-panel"
          aria-label={open ? '关闭页面导航' : '打开页面导航'}
          onClick={toggleMenu}
        >
          <span className="staggered-menu-toggleTextWrap" aria-hidden="true">
            <span ref={textInnerRef} className="staggered-menu-toggleTextInner">
              {textLines.map((line, index) => (
                <span key={`${line}-${index}`} className="staggered-menu-toggleLine">
                  {line}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="staggered-menu-toggleIcon" aria-hidden="true">
            <span className="staggered-menu-toggleStroke" />
            <span className="staggered-menu-toggleStroke is-vertical" />
          </span>
        </button>
      </div>

      {portalRoot
        ? createPortal(
            <div className={`staggered-menu-portal ${open ? 'is-open' : ''}`}>
              <button
                ref={overlayRef}
                className="staggered-menu-overlay"
                type="button"
                aria-label="关闭页面导航"
                tabIndex={open ? 0 : -1}
                onClick={dismissMenu}
              />

              <div ref={preLayersRef} className="staggered-menu-layers" aria-hidden="true">
                {colors.slice(0, 3).map((color, index) => (
                  <div
                    key={`${color}-${index}`}
                    className="sm-prelayer"
                    style={{ background: color }}
                  />
                ))}
              </div>

              <aside
                id="site-staggered-menu-panel"
                ref={panelRef}
                className="staggered-menu-panel"
                aria-hidden={!open}
                aria-label="页面切换菜单"
              >
                <button
                  className="staggered-menu-dismiss"
                  type="button"
                  aria-label="取消并关闭页面导航"
                  tabIndex={open ? 0 : -1}
                  onClick={dismissMenu}
                >
                  取消
                </button>

                <div className="staggered-menu-panelInner">
                  <div className="staggered-menu-kicker">
                    <span>Page Switch</span>
                    <strong>{items.length} Views</strong>
                  </div>

                  <nav aria-label="页面导航">
                    <ul className="staggered-menu-list">
                      {items.map((item, index) => (
                        <li key={item.to} className="staggered-menu-itemWrap">
                          <NavLink
                            to={item.to}
                            end={item.end}
                            aria-label={item.ariaLabel}
                            className={({ isActive }) =>
                              `staggered-menu-item ${isActive ? 'is-active' : ''}`
                            }
                            onClick={dismissMenu}
                            style={{ '--menu-accent': accentColor } as CSSProperties}
                          >
                            <span className="sm-panel-itemNumber">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="sm-panel-itemBody">
                              <span className="sm-panel-itemLabel">{item.label}</span>
                              <span className="sm-panel-itemDescription">{item.description}</span>
                            </span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="sm-panel-note">
                    <p>283 PRODUCTION</p>
                    <strong>B/W/H Visual Archive</strong>
                    <small>
                      {location.pathname === '/'
                        ? 'Current issue overview'
                        : 'Switch between the three reading views'}
                    </small>
                  </div>
                </div>
              </aside>
            </div>,
            portalRoot,
          )
        : null}
    </>
  )
}
