import { useEffect, useRef, useState } from 'react';

interface TimeInputProps {
    onChange: (time: { hours: number; minutes: number; seconds: number }) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ onChange, ...rest }) => {
    const [hh, setHh] = useState(0);
    const [mm, setMm] = useState(0);
    const [ss, setSs] = useState(0);

    const mmRef = useRef(null);
    const ssRef = useRef(null);

    const handleChange = (type: 'hh' | 'mm' | 'ss', value: string, nextRef?: React.RefObject<any>) => {
        if (!value) {
            return;
        }
        const cleanNum = parseInt(value, 10);
        if (type === 'hh') setHh(cleanNum);
        if (type === 'mm') setMm(cleanNum);
        if (type === 'ss') setSs(cleanNum);

        if ((value.length === 2 || value === '0') && nextRef?.current) {
            nextRef.current.focus();
        }
    };

    useEffect(() => {
        if (onChange) {
            onChange({
                hours: hh,
                minutes: mm,
                seconds: ss
            });
        }
    }, [hh, mm, ss]);

    return (
        <div className="flex items-center gap-2">
            <input
                type="number"
                min={0}
                max={23}
                className="input"
                value={hh}
                maxLength={2}
                onChange={(event) => handleChange('hh', event.target.value, mmRef)}
                placeholder="hh"
                tabIndex={0}
                onFocus={(event) => {
                    event.target.select();
                }}
            />
            :
            <input
                ref={mmRef}
                value={mm}
                type="nubmer"
                min={0}
                max={59}
                className="input"
                maxLength={2}
                onChange={(event) => handleChange('mm', event.target.value, ssRef)}
                placeholder="mm"
                tabIndex={0}
                onFocus={(event) => {
                    event.target.select();
                }}
            />
            :
            <input
                ref={ssRef}
                maxLength={2}
                type="number"
                min={0}
                max={59}
                className="input"
                value={ss}
                onChange={(event) => handleChange('ss', event.target.value, ssRef)}
                placeholder="ss"
                tabIndex={0}
                onFocus={(event) => {
                    event.target.select();
                }}
            />
        </div>
    );
};

export default TimeInput;
