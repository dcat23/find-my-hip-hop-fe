"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";
import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaflet } from "./leaflet";
import { useModalStore } from "../stores/use-modal";
import { useWindowSize } from "../hooks/use-window-size";


export function Modal() {

  const showModal = useModalStore(state => state.showing)
  const content = useModalStore(state => state.content)
  const setShowing = useModalStore(state => state.setShowing)

  const desktopModalRef = useRef(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowing(false);
      }
    },
    [setShowing],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const { isMobile, isDesktop } = useWindowSize();

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {isMobile && <Leaflet>{content}</Leaflet>}
          {isDesktop && (
            <>
              <FocusTrap focusTrapOptions={{ initialFocus: false }}>
                <motion.div
                  ref={desktopModalRef}
                  key="desktop-modal"
                  className="fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onMouseDown={(e) => {
                    if (desktopModalRef.current === e.target) {
                      setShowing(false);
                    }
                  }}
                >
                  {content}
                </motion.div>
              </FocusTrap>
              <motion.div
                key="desktop-backdrop"
                className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowing(false)}
              />
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
