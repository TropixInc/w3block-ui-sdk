/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useCopyToClipboard } from 'react-use';
import { useRouterConnect } from '../hooks/useRouterConnect';

interface TranslationPreviewContextData {
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  hoveredKey: string | null;
}

const TranslationPreviewContext = createContext<TranslationPreviewContextData>(
  {} as TranslationPreviewContextData
);

export const useTranslationPreview = () => {
  const context = useContext(TranslationPreviewContext);
  if (!context) {
    throw new Error(
      'useTranslationPreview must be used within TranslationPreviewProvider'
    );
  }
  return context;
};

interface TranslationPreviewProviderProps {
  children: ReactNode;
  enableByDefault?: boolean;
  translationSelector?: string;
}

export const TranslationPreviewProvider: React.FC<
  TranslationPreviewProviderProps
> = ({
  children,
  enableByDefault = false,
  translationSelector = '[data-translation-key]',
}) => {
  const { query } = useRouterConnect();
  const [, copyToClipboard] = useCopyToClipboard();
  const isPreviewFromQuery = query?.preview === 'true';
  const [isPreviewMode, setIsPreviewMode] = useState(
    isPreviewFromQuery || enableByDefault
  );
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    if (isPreviewFromQuery) {
      setIsPreviewMode(true);
    }
  }, [isPreviewFromQuery]);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPreviewMode) {
      setHoveredKey(null);
      return;
    }

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementWithKey = target.closest(translationSelector) as HTMLElement;
      
      if (elementWithKey) {
        const translationKey = elementWithKey.getAttribute('data-translation-key');
        if (translationKey) {
          setHoveredKey(translationKey);
          elementWithKey.style.outline = '2px dashed #3b82f6';
          elementWithKey.style.outlineOffset = '2px';
          elementWithKey.style.cursor = 'help';
        }
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementWithKey = target.closest(translationSelector) as HTMLElement;
      
      if (elementWithKey) {
        setHoveredKey(null);
        elementWithKey.style.outline = '';
        elementWithKey.style.outlineOffset = '';
        elementWithKey.style.cursor = '';
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementWithKey = target.closest(translationSelector) as HTMLElement;
      
      if (elementWithKey) {
        const translationKey = elementWithKey.getAttribute('data-translation-key');
        if (translationKey) {
          event.preventDefault();
          event.stopPropagation();
          
          copyToClipboard(translationKey);
        
          const originalBg = elementWithKey.style.backgroundColor;
          const originalColor = elementWithKey.style.color;
          elementWithKey.style.backgroundColor = '#10b981';
          elementWithKey.style.color = '#fff';
          
          setTimeout(() => {
            elementWithKey.style.backgroundColor = originalBg;
            elementWithKey.style.color = originalColor;
          }, 300);
        }
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
      
      const elements = document.querySelectorAll(translationSelector);
      elements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.cursor = '';
      });
    };
  }, [isPreviewMode, translationSelector]);

  return (
    <TranslationPreviewContext.Provider
      value={{
        isPreviewMode,
        togglePreviewMode,
        hoveredKey,
      }}
    >
      {children}
      {isPreviewMode && hoveredKey && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#1f2937',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 10000,
            maxWidth: '400px',
            wordBreak: 'break-word',
            fontFamily: 'monospace',
            fontSize: '12px',
            border: '1px solid #3b82f6',
          }}
        >
          <div
            style={{
              fontWeight: 'bold',
              marginBottom: '4px',
              color: '#3b82f6',
              fontSize: '10px',
              textTransform: 'uppercase',
            }}
          >
            Translation Key
          </div>
          <div>{hoveredKey}</div>
          <div
            style={{
              marginTop: '8px',
              fontSize: '10px',
              color: '#9ca3af',
            }}
          >
            Click to copy
          </div>
        </div>
      )}
    </TranslationPreviewContext.Provider>
  );
};

export const withTranslationKey = (
  Component: React.ComponentType<any>,
  translationKey: string
) => {
  return React.forwardRef((props: any, ref) => (
    <div data-translation-key={translationKey}>
      <Component {...props} ref={ref} />
    </div>
  ));
};

export const useTranslationKey = (translationKey: string) => {
  return {
    'data-translation-key': translationKey,
  };
};
