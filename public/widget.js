/**
 * W-AI Chat Widget Loader
 * 
 * This script injects the chat widget (iframe + floating button) into the host page.
 * It uses Shadow DOM to fully isolate styles and ensure a consistent appearance.
 * 
 * Usage:
 * <script src="https://domain.com/widget.js" 
 *   data-bot-id="YOUR_BOT_ID" 
 *   data-color="#105D3B"
 *   data-position="rtl" 
 *   async></script>
 */
(function () {
    // 1. Configuration & Constants
    const SCRIPT_ID = 'wai-widget-script';
    const CONTAINER_ID = 'wai-widget-container';

    // Auto-detect base URL based on script location, fallback to w-ai.io
    const getBaseUrl = () => {
        const script = document.currentScript;
        if (script && script.src) {
            try {
                const url = new URL(script.src);
                return url.origin;
            } catch (e) { }
        }
        return 'https://w-ai.io';
    };

    const BASE_URL = getBaseUrl();
    const isLocal = BASE_URL.includes('localhost');

    // Get configuration from script tag
    const scriptTag = document.currentScript || document.querySelector(`script[src*="widget.js"]`);
    const config = {
        botId: scriptTag?.getAttribute('data-bot-id'),
        color: scriptTag?.getAttribute('data-color') || '#105D3B',
        position: scriptTag?.getAttribute('data-position') || 'rtl', // 'rtl' (right) or 'ltr' (left)
    };

    if (!config.botId) {
        console.error('W-AI Widget: data-bot-id is required');
        return;
    }

    // 2. Create Shadow Container
    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.style.position = 'fixed';
    container.style.zIndex = '999999';
    container.style.bottom = '20px';
    container.style[config.position === 'ltr' ? 'left' : 'right'] = '20px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = config.position === 'ltr' ? 'flex-start' : 'flex-end';
    container.style.gap = '15px';
    container.style.pointerEvents = 'none'; // Allow clicking through empty space

    document.body.appendChild(container);
    const shadow = container.attachShadow({ mode: 'open' });

    // 3. Inject Styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        :host {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        /* Iframe Styles */
        #wai-iframe {
            width: 380px;
            height: 600px;
            max-height: calc(100vh - 100px);
            max-width: calc(100vw - 40px);
            border: none;
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 2px rgba(0,0,0,0.1);
            background: white;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transform-origin: bottom ${config.position === 'ltr' ? 'left' : 'right'};
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none; /* Disabled when closed */
            position: absolute; /* Take out of flow to prevent pushing button */
            bottom: 80px; /* Above the button */
            ${config.position === 'ltr' ? 'left: 0;' : 'right: 0;'}
        }

        #wai-iframe.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* Launcher Button Styles */
        #wai-launcher {
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background-color: ${config.color};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
            pointer-events: auto;
            position: relative;
            user-select: none;
        }

        #wai-launcher:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        #wai-launcher:active {
            transform: scale(0.95);
        }

        /* Icon Transitions */
        .icon {
            position: absolute;
            transition: opacity 0.3s ease, transform 0.3s ease;
            color: white;
        }

        .icon-close {
            opacity: 0;
            transform: rotate(-90deg) scale(0.5);
        }

        /* State: Open */
        #wai-launcher.open .icon-chat {
            opacity: 0;
            transform: rotate(90deg) scale(0.5);
        }

        #wai-launcher.open .icon-close {
            opacity: 1;
            transform: rotate(0) scale(1);
        }
    `;
    shadow.appendChild(styleSheet);

    // 4. Create Elements

    // Iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'wai-iframe';
    const widgetUrl = `${BASE_URL}/widget?botId=${config.botId}&color=${encodeURIComponent(config.color)}`;
    iframe.src = widgetUrl;
    iframe.setAttribute('allow', 'microphone; clipboard-write'); // Permissions

    // Launcher Button
    const launcher = document.createElement('div');
    launcher.id = 'wai-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('aria-label', 'Chat with us');

    // Icons (SVG)
    const chatIcon = `
        <svg class="icon icon-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    `;

    const closeIcon = `
        <svg class="icon icon-close" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
        </svg>
    `;

    launcher.innerHTML = chatIcon + closeIcon;

    // 5. Assemble
    shadow.appendChild(iframe);
    shadow.appendChild(launcher);

    // 6. Logic
    let isOpen = false;

    // Toggle Function
    const toggle = () => {
        isOpen = !isOpen;
        if (isOpen) {
            iframe.classList.add('open');
            launcher.classList.add('open');
        } else {
            iframe.classList.remove('open');
            launcher.classList.remove('open');
        }
    };

    launcher.addEventListener('click', toggle);

    // Message Listener for closing from inside (optional future proofing)
    window.addEventListener('message', (event) => {
        if (event.origin !== BASE_URL) return;
        if (event.data === 'wai-widget:close') {
            if (isOpen) toggle();
        }
    });

})();
