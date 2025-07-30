import { startTransition, useState, type FC } from 'react';

interface Item {
    label: string;
    value: string;
}

interface ButtonSelectComboProps {
    items: Item[];
    defaultValue?: Item;
    placeholder: string;
    onChange: (newValue: Item) => void;
}

export const ButtonSelectCombo: FC<ButtonSelectComboProps> = ({ items, defaultValue, placeholder, onChange }) => {
    const [selected, setSelected] = useState<Item>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const [prevDefaultValue, setPrevDefaultValue] = useState<Item>(defaultValue);

    if (defaultValue !== prevDefaultValue) {
        setSelected(defaultValue);
        setPrevDefaultValue(defaultValue);
    }

    const handleItemClick = (event, item: Item) => {
        event.stopPropagation();
        setSelected(item);
        console.log(item);
        onChange(item);
        startTransition(() => {
            setIsOpen(false);
        });
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    return (
        <div className="flex items-center bg-primary text-primary-content rounded-md flex-1 self-stretch relative cursor-pointer min-w-32" onClick={handleOpen}>
            <div className="self-stretch flex justify-between flex-1">
                {!selected && <div className="flex text-sm text-primary-content opacity-80 whitespace-nowrap p-2">{placeholder}</div>}
                {selected && <div className="flex text-sm text-primary-content p-2">{selected.label}</div>}
            </div>

            {/* Tick */}
            <div className="bg-secondary-content self-stretch rounded-br-md rounded-tr-md items-center flex p-2">▼</div>

            {isOpen && (
                <ul className="absolute top-11 left-0 right-0 bg-primary text-primary-content flex flex-col gap-2 rounded-md overflow-clip">
                    {items.map((item) => (
                        <li className="hover:bg-accent cursor-pointer p-2" key={item.label} onClick={(event) => handleItemClick(event, item)}>
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
