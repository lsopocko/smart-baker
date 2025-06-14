import { useEffect, useState } from 'react';

type ConversionResult = {
    unit: 'ml' | 'g';
    value: number;
    ingredient?: string;
};

type ConvertedIngredient = {
    original: string;
    converted: ConversionResult | null;
};

function App() {
    const [ingredients, setIngredients] = useState<ConvertedIngredient[]>([]);

    // Popup.tsx
    useEffect(() => {
        chrome.runtime.sendMessage({ type: 'GET_CONVERSIONS' }, (response) => {
            if (response) setIngredients(response);
        });
    }, []);

    useEffect(() => {
        chrome.runtime.onMessage.addListener((msg: { type: string; payload: ConvertedIngredient[] }) => {
            if (msg.type === 'SMART_BAKER_CONVERSIONS') {
                console.log('msg.payload', msg.payload);
                setIngredients(msg.payload);
            }
        });
    }, []);

    return (
        <div className="p-4 min-w-[300px] font-sans rounded-2xl bg-base-100 text-base-content shadow-lg">
            <h2 className="text-lg font-bold mb-2">🥣 Smart Baker</h2>
            {ingredients.length === 0 ? (
                <p className="text-sm text-gray-500">No ingredients detected yet.</p>
            ) : (
                <ul className="space-y-2">
                    {ingredients.map(({ original, converted }, idx) => (
                        <li key={idx} className="bg-pink-100 border rounded p-2">
                            <div className="text-sm text-gray-700">{original}</div>
                            <div className="text-base font-semibold text-pink-800">
                                → {converted?.value} {converted?.unit} {converted?.ingredient}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;
