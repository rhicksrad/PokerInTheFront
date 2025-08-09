/**
 * Mobile utilities for iOS Safari optimization
 */

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isSafari = (): boolean => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const supportsViewportUnits = (): boolean => {
  return CSS.supports('height', '100svh') || CSS.supports('height', '100dvh');
};

/**
 * Apply safe area insets to an element using CSS custom properties
 */
export const applySafeArea = (element: HTMLElement): void => {
  if (!isIOS()) return;
  
  element.style.setProperty('--safe-top', 'env(safe-area-inset-top)');
  element.style.setProperty('--safe-bottom', 'env(safe-area-inset-bottom)');
  element.style.setProperty('--safe-left', 'env(safe-area-inset-left)');
  element.style.setProperty('--safe-right', 'env(safe-area-inset-right)');
};

/**
 * Enable iOS WebAudio - must be called on first user gesture
 */
export const enableIOSAudio = async (audioContext: AudioContext): Promise<void> => {
  if (!isIOS()) return;
  
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      console.log('iOS AudioContext resumed successfully');
    } catch (error) {
      console.warn('Failed to resume iOS AudioContext:', error);
    }
  }
};

/**
 * Add mobile-optimized pointer event listeners
 * Automatically handles touch delays, cancellation, and fallbacks
 */
export const addPointerListener = (
  element: HTMLElement,
  callback: () => void,
  options: { passive?: boolean; debounce?: number } = {}
): (() => void) => {
  const { passive = true, debounce = 0 } = options;
  
  let debounceTimer: number;
  let isPointerDown = false;
  
  const handlePointer = () => {
    if (debounce > 0) {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(callback, debounce);
    } else {
      callback();
    }
  };
  
  // Pointer Events (preferred for modern touch devices)
  const onPointerDown = () => {
    isPointerDown = true;
  };
  
  const onPointerUp = (e: PointerEvent) => {
    if (isPointerDown && e.pointerType !== 'mouse') {
      // Touch/pen input - use pointerup
      handlePointer();
      isPointerDown = false;
    }
  };
  
  const onPointerCancel = () => {
    isPointerDown = false; // Reset state on cancel
  };
  
  // Mouse fallback for desktop
  const onMouseClick = (e: MouseEvent) => {
    if (e.detail === 0) return; // Ignore programmatic clicks
    handlePointer();
  };
  
  // Add event listeners based on device capabilities
  if ('PointerEvent' in window) {
    element.addEventListener('pointerdown', onPointerDown, { passive });
    element.addEventListener('pointerup', onPointerUp, { passive });
    element.addEventListener('pointercancel', onPointerCancel, { passive });
    // Still add click for mouse users
    element.addEventListener('click', onMouseClick, { passive });
  } else {
    // Fallback for older browsers
    element.addEventListener('click', handlePointer, { passive });
  }
  
  // Return cleanup function
  return () => {
    clearTimeout(debounceTimer);
    if ('PointerEvent' in window) {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerCancel);
      element.removeEventListener('click', onMouseClick);
    } else {
      element.removeEventListener('click', handlePointer);
    }
  };
};

/**
 * Prevent accidental scroll/zoom during gameplay
 */
export const preventAccidentalGestures = (element: HTMLElement): void => {
  // Prevent double-tap zoom
  element.style.touchAction = 'manipulation';
  
  // Prevent iOS rubber band bounce effect
  element.style.overscrollBehavior = 'none';
  element.style.overscrollBehaviorY = 'none';
  element.style.overscrollBehaviorX = 'none';
  
  // Prevent context menu on long press
  element.addEventListener('contextmenu', (e) => {
    if (isIOS()) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Prevent selection that can interfere with touches
  element.style.userSelect = 'none';
  element.style.webkitUserSelect = 'none';
};

/**
 * Get the current orientation and provide rotate hint if needed
 */
export const getOrientationInfo = () => {
  const isPortrait = window.innerHeight > window.innerWidth;
  const isNarrow = window.innerWidth < 640;
  
  return {
    isPortrait,
    isNarrow,
    shouldShowRotateHint: isPortrait && isNarrow,
    preferLandscape: true
  };
};

/**
 * Debounced resize handler to prevent performance issues
 */
export const createDebouncedResize = (callback: () => void, delay: number = 100) => {
  let timeoutId: number;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(callback, delay);
  };
};

/**
 * Performance-optimized animation frame scheduler
 * Replaces setTimeout for animations and UI updates
 */
export const scheduleAnimation = (callback: () => void, delay: number = 0): (() => void) => {
  let animationId: number;
  let timeoutId: number;
  
  if (delay > 0) {
    // For delayed animations, use setTimeout then RAF
    timeoutId = window.setTimeout(() => {
      animationId = requestAnimationFrame(callback);
    }, delay);
  } else {
    // Immediate animation frame
    animationId = requestAnimationFrame(callback);
  }
  
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (timeoutId) clearTimeout(timeoutId);
  };
};

/**
 * Optimized batch DOM reads and writes to prevent layout thrashing
 */
export const batchDOMOperations = (operations: {
  reads?: (() => void)[];
  writes?: (() => void)[];
}): void => {
  const { reads = [], writes = [] } = operations;
  
  // Schedule reads first, then writes in next frame
  if (reads.length > 0) {
    requestAnimationFrame(() => {
      reads.forEach(read => read());
      
      // Schedule writes for next frame to prevent read/write mixing
      if (writes.length > 0) {
        requestAnimationFrame(() => {
          writes.forEach(write => write());
        });
      }
    });
  } else if (writes.length > 0) {
    // Only writes, schedule immediately
    requestAnimationFrame(() => {
      writes.forEach(write => write());
    });
  }
};

/**
 * Add will-change hints for better rendering performance
 */
export const optimizeForAnimation = (element: HTMLElement, properties: string[] = ['transform', 'opacity']): (() => void) => {
  const originalWillChange = element.style.willChange;
  element.style.willChange = properties.join(', ');
  
  // Return cleanup function
  return () => {
    element.style.willChange = originalWillChange;
  };
};

/**
 * Intersection Observer for efficient visibility detection
 */
export const createVisibilityObserver = (
  elements: HTMLElement[],
  callback: (element: HTMLElement, isVisible: boolean) => void,
  threshold: number = 0.1
): (() => void) => {
  if (!('IntersectionObserver' in window)) {
    // Fallback: assume all elements are visible
    elements.forEach(el => callback(el, true));
    return () => {};
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      callback(entry.target as HTMLElement, entry.isIntersecting);
    });
  }, { threshold });
  
  elements.forEach(el => observer.observe(el));
  
  return () => observer.disconnect();
};

/**
 * Handle visual viewport changes for iOS Safari
 * Prevents layout jump when address bar collapses/expands
 */
export const handleVisualViewport = (): (() => void) => {
  if (!('visualViewport' in window)) {
    return () => {}; // No-op cleanup for unsupported browsers
  }
  
  const viewport = window.visualViewport!;
  let pendingUpdate = false;
  
  const updateViewport = () => {
    if (pendingUpdate) return;
    pendingUpdate = true;
    
    requestAnimationFrame(() => {
      // Update CSS custom properties with viewport dimensions
      const root = document.documentElement;
      root.style.setProperty('--visual-viewport-width', `${viewport.width}px`);
      root.style.setProperty('--visual-viewport-height', `${viewport.height}px`);
      root.style.setProperty('--visual-viewport-offset-top', `${viewport.offsetTop}px`);
      root.style.setProperty('--visual-viewport-offset-left', `${viewport.offsetLeft}px`);
      
      pendingUpdate = false;
    });
  };
  
  // Initial setup
  updateViewport();
  
  // Listen for viewport changes
  viewport.addEventListener('resize', updateViewport);
  viewport.addEventListener('scroll', updateViewport);
  
  return () => {
    viewport.removeEventListener('resize', updateViewport);
    viewport.removeEventListener('scroll', updateViewport);
  };
};

/**
 * Enhanced orientation handling with better iOS support
 */
export const handleEnhancedOrientation = (): (() => void) => {
  const updateOrientation = createDebouncedResize(() => {
    const orientationInfo = getOrientationInfo();
    const root = document.documentElement;
    
    // Update CSS custom properties
    root.style.setProperty('--is-portrait', orientationInfo.isPortrait ? '1' : '0');
    root.style.setProperty('--is-landscape', orientationInfo.isPortrait ? '0' : '1');
    root.setAttribute('data-orientation', orientationInfo.isPortrait ? 'portrait' : 'landscape');
    
    // Show rotation hint if needed
    const rotateHint = document.querySelector('.rotate-hint');
    if (rotateHint && orientationInfo.shouldShowRotateHint) {
      rotateHint.classList.add('show');
      setTimeout(() => rotateHint.classList.remove('show'), 4000);
    }
    
    // Announce orientation change to screen readers
    const liveRegion = document.getElementById('game-status-live');
    if (liveRegion) {
      liveRegion.textContent = orientationInfo.isPortrait 
        ? 'Switched to portrait orientation' 
        : 'Switched to landscape orientation';
    }
  }, 150);
  
  // Listen for orientation changes
  window.addEventListener('orientationchange', updateOrientation);
  window.addEventListener('resize', updateOrientation);
  
  // Initial setup
  updateOrientation();
  
  return () => {
    window.removeEventListener('orientationchange', updateOrientation);
    window.removeEventListener('resize', updateOrientation);
  };
};
