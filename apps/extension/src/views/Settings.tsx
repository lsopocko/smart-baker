import { useState } from 'react';

const panShapes = [
    { label: 'Rectangle (sheet pan)', value: 'rectangle' },
    { label: 'Round (cake pan)', value: 'round' }
];

// All posible pan sizes in cm
const panSizes = [
    { label: '18×28 cm', value: '18x28' },
    { label: '20×30 cm', value: '20x30' },
    { label: '22×32 cm', value: '22x32' },
    { label: '24×34 cm', value: '24x34' },
    { label: '26×36 cm', value: '26x36' }
];

const unitSystems = [
    { label: 'Metric', value: 'metric' },
    { label: 'Imperial', value: 'imperial' }
];

export const Settings = () => {
    const [isAddingCustomPan, setIsAddingCustomPan] = useState(false);
    const [panShape, setPanShape] = useState('rectangle');
    const [panWidth, setPanWidth] = useState('22');
    const [panHeight, setPanHeight] = useState('32');
    const [panDiameter, setPanDiameter] = useState('22');
    const [defaultPanSize, setDefaultPanSize] = useState('22×32 cm');
    const [unitSystem, setUnitSystem] = useState('metric');

    const [showPopup, setShowPopup] = useState(false);

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
                                <input
                                    type="text"
                                    placeholder="Diameter"
                                    className="input"
                                    value={panDiameter}
                                    onChange={(e) => setPanDiameter(e.target.value)}
                                />
                                <span>Diameter</span>
                            </label>
                        </>
                    )}

                    <div className="flex justify-between">
                        <button className="btn btn-sm" onClick={() => setIsAddingCustomPan(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => {}}>
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
                                    {panSizes.map((size) => (
                                        <option key={size.value} value={size.value}>
                                            {size.label}
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
                            <select value={unitSystem} onChange={(e) => setUnitSystem(e.target.value)} className="select">
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
                    </fieldset>

                    <button className="btn btn-primary btn-sm">Save</button>
                </>
            )}
        </>
    );
};
