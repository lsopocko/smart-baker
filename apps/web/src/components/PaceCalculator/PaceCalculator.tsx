import { useState } from 'react';
import TimeInput from '../TimeInput/TimeInput';

type Split = {
    km: number;
    miles?: number;
    pace: string;
    paceSeconds: number;
    totalTime?: string;
};

export function calculateSplits(distanceKm: number, desiredFinishTimeMin: number, pacingStrategy: number): Split[] {
    const totalSeconds = desiredFinishTimeMin * 60;
    const averagePace = totalSeconds / distanceKm;
    const variation = Math.abs(pacingStrategy) / 100;
    const splits: Split[] = [];

    for (let i = 0; i < distanceKm; i++) {
        let bias = 0;
        if (pacingStrategy !== 0) {
            const offset = averagePace * variation;
            const linearStep = (2 * offset * i) / (distanceKm - 1);
            bias =
                pacingStrategy < 0
                    ? -offset + linearStep // Negative split: start fast
                    : offset - linearStep; // Positive split: start slow
        }

        const kmPace = averagePace + bias;
        const minutes = Math.floor(kmPace / 60);
        const seconds = Math.round(kmPace % 60);
        splits.push({
            km: i + 1,
            pace: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            paceSeconds: kmPace
        });
    }

    // Calculate total time for each split

    let cumulativeTime = 0;
    for (let i = 0; i < splits.length; i++) {
        cumulativeTime += splits[i].paceSeconds;
        const totalMinutes = Math.floor(cumulativeTime / 60);
        const totalSeconds = Math.round(cumulativeTime % 60);
        splits[i].totalTime = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
    }

    return splits;
}

export function calculateSplitsInMiles(distanceKm: number, desiredFinishTimeMin: number, pacingStrategy: number): Split[] {
    const KM_TO_MILES = 0.621371;
    const totalSeconds = desiredFinishTimeMin * 60;
    const distanceInMiles = distanceKm * KM_TO_MILES;
    const averagePacePerMile = totalSeconds / distanceInMiles;
    const variation = Math.abs(pacingStrategy) / 100;
    const splits: Split[] = [];

    for (let i = 0; i < distanceKm; i++) {
        let bias = 0;
        if (pacingStrategy !== 0) {
            const offset = averagePacePerMile * variation;
            const linearStep = (2 * offset * i) / (distanceKm - 1);
            bias =
                pacingStrategy < 0
                    ? -offset + linearStep // Negative split: start fast
                    : offset - linearStep; // Positive split: start slow
        }

        // Calculate mile pace for this kilometer
        const milePace = averagePacePerMile + bias;
        const minutes = Math.floor(milePace / 60);
        const seconds = Math.round(milePace % 60);

        // Store the kilometer split with mile pace
        splits.push({
            miles: i + 1 * KM_TO_MILES,
            km: i + 1,
            pace: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            paceSeconds: milePace
        });
    }

    // Calculate cumulative time for each split
    let cumulativeTime = 0;
    for (let i = 0; i < splits.length; i++) {
        cumulativeTime += splits[i].paceSeconds * KM_TO_MILES;
        const totalMinutes = Math.floor(cumulativeTime / 60);
        const totalSeconds = Math.round(cumulativeTime % 60);
        splits[i].totalTime = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
    }

    return splits;
}

enum Units {
    KM = 'km',
    MILES = 'miles',
    MINUTES = 'minutes',
    SECONDS = 'seconds'
}

const PaceCalculator = () => {
    const [raceDistance, setRaceDistance] = useState<string>('');
    const [desiredFinishTime, setDesiredFinishTime] = useState<number>(0);
    const [pacingStrategy, setPacingStrategy] = useState<number>(0); // Default value for pacing strategy
    const [splits, setSplits] = useState<Split[]>([]);
    const [units, setUnits] = useState<Units>(Units.KM);

    const handleCalculate = () => {
        const parsedDistance = parseInt(raceDistance, 10);
        const pacingStrategyValue = parseInt(pacingStrategy.toString(), 10);

        console.log(units);

        if (units === Units.KM) {
            setSplits(calculateSplits(parsedDistance, desiredFinishTime, pacingStrategyValue));
        } else {
            setSplits(calculateSplitsInMiles(parsedDistance, desiredFinishTime, pacingStrategyValue));
        }
    };

    const handleTimeChange = (time: { hours: number; minutes: number; seconds: number }) => {
        const totalMinutes = time.hours * 60 + time.minutes + time.seconds / 60;
        setDesiredFinishTime(totalMinutes);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="pace-calculator">
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-4">
                        <label className="label" htmlFor="distance">
                            Race distance
                        </label>
                        <select id="distance" defaultValue={0} className="select" onChange={(e) => setRaceDistance(e.target.value)}>
                            <option disabled={true} value={0}>
                                Select race distance
                            </option>
                            <option value={5}>5k</option>
                            <option value={10}>10k</option>
                            <option value={21}>Half-marathon</option>
                            <option value={42}>Marathon</option>
                        </select>
                        <label className="label">Desired finish time</label>
                        <TimeInput onChange={handleTimeChange} />
                        <label className="label" htmlFor="pacingStrategy">
                            Pacing strategy
                        </label>
                        <div className="w-full max-w-xs">
                            <input
                                type="range"
                                min={-10}
                                max={10}
                                id="pacingStrategy"
                                defaultValue={pacingStrategy}
                                className="range range-info"
                                onChange={(e) => setPacingStrategy(parseInt(e.target.value, 10))}
                            />
                            <div className="flex justify-between px-2.5 mt-2 text-xs">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="flex justify-between px-2.5 mt-2 text-xs">
                                <span>Start faster</span>
                                <span>Steady</span>
                                <span>Finish faster</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="km-min"
                                checked={units === Units.KM}
                                className="radio"
                                id="km"
                                value={Units.KM}
                                onChange={(e) => setUnits(Units.KM)}
                            />{' '}
                            <label htmlFor="km">min/km</label>{' '}
                            <input
                                type="radio"
                                name="mi-min"
                                value={Units.MILES}
                                checked={units === Units.MILES}
                                className="radio"
                                id="mi"
                                onChange={(e) => setUnits(Units.MILES)}
                            />{' '}
                            <label htmlFor="mi">min/mile</label>
                        </div>
                        <button className="btn btn-neutral mt-4" onClick={handleCalculate}>
                            Calculate
                        </button>
                    </fieldset>
                </div>
            </div>
            <div className="flex items-start justify-center w-full">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-fit">
                    <table className="table table-zebra table-fixed">
                        <thead>
                            <tr>
                                <th>Distance</th>
                                <th>Split pace ({units === Units.KM ? 'min/km' : 'min/mi'})</th>
                                <th>Total time</th>
                            </tr>
                        </thead>
                        {splits.length > 0 && (
                            <tbody>
                                {splits.map((split) => (
                                    <tr key={split.km}>
                                        <td>{split.km} km</td>
                                        <td>
                                            {split.pace} {units === Units.KM ? 'min/km' : 'min/mi'}
                                        </td>
                                        <td>{split.totalTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}

                        {splits.length === 0 && (
                            <tbody>
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        No splits calculated
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </>
    );
};

export default PaceCalculator;
