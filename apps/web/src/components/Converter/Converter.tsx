import { ButtonSelectCombo } from '../ButtonSelectCombo/ButtonSelectCombo';
import Input from '../Input/Input';

const PLACEHOLDER_ITEMS = [
    {
        label: 'imperial',
        value: 'imperial'
    },
    {
        label: 'metric',
        value: 'metric'
    }
];

const Converter = ({}) => {
    const onTargetChanged = (newVal) => {
        console.log('newly selected value', newVal);
    };

    return (
        <div className="gap-4 flex items-center justify-between">
            <Input
                onClick={() => {
                    console.log('my test');
                }}
                label={'Convert'}
            />
            <ButtonSelectCombo items={PLACEHOLDER_ITEMS} onChange={onTargetChanged} placeholder="Select target" />
        </div>
    );
};

export default Converter;
