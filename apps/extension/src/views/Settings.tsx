import { useState } from 'react';
import { type BakeIQSettings, type PanSize, UnitSystem } from '../types';
import { defaultSettings } from '../state/BakeIQ.module';

const panShapes = [
    { label: 'Rectangle (sheet pan)', value: 'rectangle' },
    { label: 'Round (cake pan)', value: 'round' }
];

const unitSystems = [
    { label: 'Metric', value: UnitSystem.Metric },
    { label: 'Imperial', value: UnitSystem.Imperial }
];

export const Settings = ({ settings, onChange }: { settings: BakeIQSettings; onChange: (updatedSettings: Partial<BakeIQSettings>) => void }) => {
    const [isAddingCustomPan, setIsAddingCustomPan] = useState(false);
    const [panShape, setPanShape] = useState('rectangle');
    const [panWidth, setPanWidth] = useState('0');
    const [panHeight, setPanHeight] = useState('0');
    const [defaultPanSize, setDefaultPanSize] = useState(settings.defaultPanSize?.name);
    const [unitSystem, setUnitSystem] = useState<UnitSystem>(settings.defaultUnit);
    const [autoConvert, setAutoConvert] = useState(settings.autoConvert);
    const [showPopup, setShowPopup] = useState(settings.showBanner);

    const handleSave = () => {
        const defaultPan = settings.panSizes.find((p) => p.name === defaultPanSize);
        onChange({
            defaultPanSize: defaultPan,
            panSizes: settings.panSizes,
            defaultUnit: unitSystem,
            showBanner: showPopup,
            autoConvert: autoConvert
        });
    };

    const handleAddCustomPan = () => {
        const newPan: PanSize = {
            width: Number(panWidth),
            height: Number(panHeight),
            area: panShape === 'rectangle' ? Number(panWidth) * Number(panHeight) : Math.PI * Math.pow(Number(panWidth) / 2, 2),
            unit: 'cm',
            name: `${panWidth}×${panHeight} ${panShape === 'rectangle' ? 'sheet' : 'cake'} pan`
        };

        onChange({
            defaultPanSize: newPan,
            panSizes: [...settings.panSizes, newPan],
            defaultUnit: unitSystem,
            showBanner: showPopup,
            autoConvert: autoConvert
        });

        setIsAddingCustomPan(false);
        setPanWidth('0');
        setPanHeight('0');
    };

    return (
        <>
            {isAddingCustomPan && (
                <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4 gap-4">
                    <legend className="fieldset-legend">Custom pan size</legend>

                    <label className="floating-label">
                        <select value={panShape} onChange={(e) => setPanShape(e.target.value)} className="select">
                            {panShapes.map((shape) => (
                                <option key={shape.value} value={shape.value}>
                                    {shape.label}
                                </option>
                            ))}
                        </select>
                        <span>Pan shape</span>
                    </label>

                    {panShape === 'rectangle' && (
                        <div className="join gap-2">
                            <label className="join-item floating-label">
                                <input type="text" placeholder="Width" className="input" value={panWidth} onChange={(e) => setPanWidth(e.target.value)} />
                                <span>Width</span>
                            </label>
                            <label className="join-item floating-label">
                                <input type="text" placeholder="Height" className="input" value={panHeight} onChange={(e) => setPanHeight(e.target.value)} />
                                <span>Height</span>
                            </label>
                        </div>
                    )}

                    {panShape === 'round' && (
                        <>
                            <label className="floating-label">
                                <input type="text" placeholder="Diameter" className="input" value={panWidth} onChange={(e) => setPanWidth(e.target.value)} />
                                <span>Diameter</span>
                            </label>
                        </>
                    )}

                    <div className="flex justify-between">
                        <button className="btn btn-sm" onClick={() => setIsAddingCustomPan(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={handleAddCustomPan}>
                            Add pan size
                        </button>
                    </div>
                </fieldset>
            )}

            {!isAddingCustomPan && (
                <>
                    <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4 gap-4">
                        <legend className="fieldset-legend">Default settings</legend>

                        <div className="join gap-2 items-center justify-between">
                            <label className="join-item floating-label w-full">
                                <select value={defaultPanSize} onChange={(e) => setDefaultPanSize(e.target.value)} className="select">
                                    {settings.panSizes.map((size) => (
                                        <option key={size.name} value={size.name}>
                                            {size.name}
                                        </option>
                                    ))}
                                </select>
                                <span>Pan size</span>
                            </label>
                            <div className="join-item">
                                <button className="btn btn-primary btn-sm" onClick={() => setIsAddingCustomPan(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <label className="floating-label">
                            <select value={unitSystem} onChange={(e) => setUnitSystem(e.target.value as UnitSystem)} className="select">
                                {unitSystems.map((system) => (
                                    <option key={system.value} value={system.value}>
                                        {system.label}
                                    </option>
                                ))}
                            </select>
                            <span>Unit system</span>
                        </label>

                        <label className="label">
                            <input type="checkbox" checked={showPopup} onChange={(e) => setShowPopup(e.target.checked)} className="checkbox" />
                            Show popup on supported websites
                        </label>

                        <label className="label">
                            <input type="checkbox" checked={autoConvert} onChange={(e) => setAutoConvert(e.target.checked)} className="checkbox" />
                            Auto convert ingredients
                        </label>
                    </fieldset>

                    <button className="btn btn-primary btn-sm" onClick={handleSave}>
                        Save
                    </button>
                </>
            )}
        </>
    );
};
