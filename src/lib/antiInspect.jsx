import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_DEVTOOLS_THRESHOLD = 160;

const isConsoleLikelyOpen = () => {
  let opened = false;
  const bait = new Image();

  Object.defineProperty(bait, 'id', {
    get() {
      opened = true;
      return 'anti-inspect';
    },
    configurable: true,
  });

  try {
    console.debug(bait);
  } catch {
    return false;
  }

  return opened;
};

const shouldBlockShortcut = (event) => {
  const key = String(event.key || '').toLowerCase();
  const ctrlOrCmd = event.ctrlKey || event.metaKey;

  if (event.key === 'F12') return true;
  if (ctrlOrCmd && event.shiftKey && ['i', 'j', 'c', 'k', 's'].includes(key)) return true;
  if (ctrlOrCmd && ['u', 's', 'p'].includes(key)) return true;

  return false;
};

const isDevtoolsLikelyOpen = (threshold) => {
  const widthGap = window.outerWidth - window.innerWidth;
  const heightGap = window.outerHeight - window.innerHeight;
  return widthGap > threshold || heightGap > threshold;
};

const isAnyDevtoolsLikelyOpen = (threshold) => {
  return isDevtoolsLikelyOpen(threshold) || isConsoleLikelyOpen();
};

const useAntiInspect = ({
  enabled = true,
  blockContextMenu = true,
  blockKeyboardShortcuts = true,
  detectDevtools = true,
  lockOnDetect = true,
  autoUnlockOnClose = true,
  unlockDelayMs = 1000,
  checkIntervalMs = 1000,
  devtoolsThreshold = DEFAULT_DEVTOOLS_THRESHOLD,
  onDetect,
} = {}) => {
  const [isBlocked, setIsBlocked] = useState(() => {
    if (!enabled || !detectDevtools || !lockOnDetect || typeof window === 'undefined') {
      return false;
    }

    return isAnyDevtoolsLikelyOpen(devtoolsThreshold);
  });
  const detectedRef = useRef(false);
  const unlockTimerRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;

    const handleContextMenu = (event) => {
      if (!blockContextMenu) return;
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      if (!blockKeyboardShortcuts) return;
      if (!shouldBlockShortcut(event)) return;

      event.preventDefault();
      event.stopPropagation();

      if (lockOnDetect) {
        setIsBlocked(true);
      }

      if (!detectedRef.current) {
        detectedRef.current = true;
        if (typeof onDetect === 'function') {
          onDetect();
        }
      }
    };

    const detect = () => {
      if (!detectDevtools) return;

      const isOpen = isAnyDevtoolsLikelyOpen(devtoolsThreshold);

      if (!isOpen) {
        if (unlockTimerRef.current) {
          window.clearTimeout(unlockTimerRef.current);
          unlockTimerRef.current = null;
        }

        if (autoUnlockOnClose && lockOnDetect) {
          unlockTimerRef.current = window.setTimeout(() => {
            setIsBlocked(false);
            unlockTimerRef.current = null;
          }, unlockDelayMs);
        }
        return;
      }

      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }

      if (lockOnDetect) {
        setIsBlocked(true);
      }

      if (!detectedRef.current) {
        detectedRef.current = true;
        if (typeof onDetect === 'function') {
          onDetect();
        }
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('resize', detect);
    window.addEventListener('focus', detect);
    window.addEventListener('pageshow', detect);
    document.addEventListener('visibilitychange', detect);

    detect();
    const timerId = window.setInterval(detect, checkIntervalMs);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('resize', detect);
      window.removeEventListener('focus', detect);
      window.removeEventListener('pageshow', detect);
      document.removeEventListener('visibilitychange', detect);
      if (unlockTimerRef.current) {
        window.clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
      window.clearInterval(timerId);
    };
  }, [
    enabled,
    blockContextMenu,
    blockKeyboardShortcuts,
    detectDevtools,
    lockOnDetect,
    autoUnlockOnClose,
    unlockDelayMs,
    checkIntervalMs,
    devtoolsThreshold,
    onDetect,
  ]);

  return { isBlocked, setIsBlocked };
};

export const InspectBlockScreen = ({
  title = 'Acceso restringido',
  message = 'Cierra las herramientas del navegador y recarga la página para continuar.',
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at 20% 20%, rgba(255, 89, 94, 0.25), transparent 45%), radial-gradient(circle at 80% 20%, rgba(25, 130, 196, 0.25), transparent 45%), #101014',
        color: '#f8f8f8',
        textAlign: 'center',
        padding: '24px',
        pointerEvents: 'all',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      <div style={{ maxWidth: '460px' }}>
        <h2 style={{ marginBottom: '10px' }}>{title}</h2>
        <p style={{ opacity: 0.92 }}>{message}</p>
      </div>
    </div>
  );
};

export const AntiInspectGuard = ({
  children,
  title = 'Acceso restringido',
  message = 'Cierra las herramientas del navegador y recarga la página para continuar.',
  ...options
}) => {
  const { isBlocked } = useAntiInspect({
    enabled: true,
    blockContextMenu: true,
    blockKeyboardShortcuts: true,
    detectDevtools: true,
    lockOnDetect: true,
    autoUnlockOnClose: true,
    unlockDelayMs: 250,
    checkIntervalMs: 450,
    devtoolsThreshold: 120,
    ...options,
  });

  if (isBlocked) {
    return <InspectBlockScreen title={title} message={message} />;
  }

  return <>{children}</>;
};
