import { useRef, useCallback, useMemo } from "react"
import throttle from "lodash/debounce"

//scrollRight and scrollLeft are useCallback functions that handle scroll logic
export function useModalScroll(scrollRight, scrollLeft) {
  const arrowScrolled = useRef(false)

  const registerKeyUp = () => {
    //allow for a new keydown action
    arrowScrolled.current = false
  }

  const handleKeyDown = useCallback((e) => {
    if (!arrowScrolled.current) {
      if (e.key == "ArrowRight") {
        scrollRight()
      }
      else if (e.key == "ArrowLeft") {
        scrollLeft()
      }
      //one keydown can only scroll once
      arrowScrolled.current = true
    }
  }, [scrollRight, scrollLeft])

  const throttleHandleKeyDown = useMemo(
    () => throttle(handleKeyDown, 100, { leading: true, trailing: false }),
    [handleKeyDown]
  );

  return {throttleHandleKeyDown, registerKeyUp}
}
