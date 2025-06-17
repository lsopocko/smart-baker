import { Settings } from './views/Settings';
import { ConvertedIngredients } from './views/ConvertedIngredients';
import { useState, useEffect } from 'react';
import { type BakeIQSettings } from './types';
import { defaultSettings } from './state/BakeIQ.module';

function App() {
    const [view, setView] = useState<'settings' | 'convertedIngredients'>('convertedIngredients');
    const [settings, setSettings] = useState<BakeIQSettings>(defaultSettings);

    useEffect(() => {
        chrome.storage.sync.get('bakeiq_settings', (result) => {
            setSettings({ ...defaultSettings, ...result.bakeiq_settings });
        });
    }, []);

    const handleChange = (updatedSettings: BakeIQSettings) => {
        const updated = { ...settings, ...updatedSettings };
        setSettings(updated);
        chrome.storage.sync.set({ bakeiq_settings: updated });

        console.log('updated', updated);

        // Notify content script
        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     chrome.tabs.sendMessage(tabs[0].id!, {
        //         type: 'BAKEIQ_SETTINGS_UPDATED',
        //         payload: updated
        //     });
        // });
    };

    const handleClose = () => {
        setView('settings');
    };

    const handleSettings = () => {
        setView('settings');
    };

    return (
        <div className="p-4 min-w-[330px] font-sans bg-base-200 text-base-content shadow-lg flex flex-col items-center justify-center gap-2 relative">
            <img src={chrome.runtime.getURL('images/logo-2.png')} alt="Smart Baker" width={57.5} height={89.5} />
            {/* Close button */}
            <button className="btn btn-ghost btn-circle absolute top-2 right-2" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Settings button */}
            <button className="btn btn-ghost btn-circle absolute top-2 left-2" onClick={handleSettings}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                </svg>
            </button>

            {view === 'settings' && <Settings settings={settings} onChange={handleChange} />}
            {view === 'convertedIngredients' && <ConvertedIngredients />}
        </div>
    );
}

export default App;
